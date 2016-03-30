/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = (function() {

	// Level Data
	var _levelBounds = null;
	var _levelCellSize = null;

	var _blockSize = null;

	/////////////
	// Helpers //
	/////////////

	// Attempt to convert point to location on grid.
	var convertPointToLevelCoords = function(point) {
		if (point.x >= _levelBounds.x && point.x < _levelBounds.x + _levelBounds.width &&
			point.y >= _levelBounds.y && point.y < _levelBounds.y + _levelBounds.height) {

			var col = Math.floor((point.x - _levelBounds.x) / _levelCellSize.width);
			var row = Math.floor((point.y - _levelBounds.y) / _levelCellSize.height);

			// return only if coordinates in certain radius of the block.
			var radius = 0.7 * _levelCellSize.width / 2;

			var cellCenter = cc.p(_levelBounds.x + (col + 0.5) * _levelCellSize.width,
				_levelBounds.y + (row + 0.5) * _levelCellSize.height);

			var diff = cc.pSub(point, cellCenter);
			var distSq = cc.pDot(diff, diff);

			// check distance
			if (distSq <= radius * radius)
				return {col: col, row: row};
		}

		return null;
	};

	// attempt to convert level coords to point
	var convertLevelCoordsToPoint = function(col, row) {
		return cc.p(_levelBounds.x + (col + 0.5) * _levelCellSize.width,
			_levelBounds.y + (row + 0.5) * _levelCellSize.height);
	};

	return cc.Layer.extend({
		// UI Data
		_numboHeaderLayer: null,
		_settingsMenuLayer: null,
		_gameOverMenuLayer: null,
		_feedbackLayer: null,

		// Geometry Data
		_selectedLinesNode: null,

		// Sprite Data
		_backgroundLayer: null,

		// Controller Data
		_numboController: null,

		// Selection Data
		_lastTouchPosition: null,

		// Progress Bar
		_progressBar: null,

		pausedJumbo: null,

		////////////////////
		// Initialization //
		////////////////////

		ctor: function () {
			this._super();

			this.setTag(NJ.tags.PAUSABLE);

			NJ.gameState.init();

			// Init game logic
			this.initNumboController();
			this.initInput();

			// Init game visuals and audio
			this.initUI();
			this.initGeometry();
			this.initAudio();

			this.initPowerups();
			if(NJ.gameState.isPowerupMode())
				this.initProgressBar();

			// Begin scheduling block drops.
			this.schedule(this.spawnDropRandomBlock, 0.1, Math.floor(NJ.NUM_ROWS*NJ.NUM_COLS *.4));
			this.schedule(this.scheduleSpawn, 0.1*20);

			// begin searching for hints
			this.schedule(this.searchForHint, 0.1);

			// begin scheduling hint jiggles
			//this.unschedule(this.jiggleHintBlocks);
			this.schedule(this.jiggleHintBlocks, 5);
		},

		// initialize the powerup mode variable
		initPowerups: function() {
			if (NJ.gameState.getJumbo().name == "Powerups!") {
				NJ.gameState.setPowerupMode();
			}
		},

		initProgressBar: function() {
			this._progressBar = new ProgressBarLayer(_levelBounds, 20);
			this.addChild(this._progressBar);
			this.schedule(this.shrinkProgress, .1);
		},

		shrinkProgress: function() {
			if(this.pausedJumbo == null)
				this._progressBar.decrement();
		},

		// Initialize input depending on the device.
		initInput: function() {
			if ('mouse' in cc.sys.capabilities) {
				cc.eventManager.addListener({
					event: cc.EventListener.MOUSE,
					onMouseDown: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchBegan(event.getLocation());

						return true;
					},
					onMouseMove: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchMoved(event.getLocation());

						return true;
					},
					onMouseUp: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchEnded(event.getLocation());

						return true;
					}
				}, this);
			}
			else if (cc.sys.capabilities.hasOwnProperty('touches')) {
				cc.eventManager.addListener({
					prevTouchId: -1,
					event: cc.EventListener.TOUCH_ONE_BY_ONE,
					swallowTouches: true,
					onTouchBegan: function(touch, event) {
						event.getCurrentTarget().onTouchBegan(touch.getLocation());
						return true;
					},
					onTouchMoved: function(touch, event) {
						event.getCurrentTarget().onTouchMoved(touch.getLocation());
						return true;
					},
					onTouchEnded: function(touch, event) {
						event.getCurrentTarget().onTouchEnded(touch.getLocation());
						return true;
					}
				}, this);
			}
		},

		// Initialize UI elements
		initUI: function() {
			var that = this;

			// background
			this._backgroundLayer = new BackgroundLayer([res.backBG], [{image: res.backBottom, dx: 0, dy:.3},
				{image: res.backMiddle, dx: -.5, dy:.5},
				{image: res.backTop, dx:.5, dy:.5},
				{image: res.backVeryTop, dx: 0, dy:.22}]);
			this.addChild(this._backgroundLayer);

			// header
			this._numboHeaderLayer = new NumboHeaderLayer();
			this._numboHeaderLayer.setOnPauseCallback(function() {
				that.onPause();
			});
			this.addChild(this._numboHeaderLayer, 999);
			this._numboHeaderLayer.updateValues();

			// feedback overlay
			this._feedbackLayer = new FeedbackLayer();
			this.addChild(this._feedbackLayer, 800);

			this._feedbackLayer.launchFallingBanner({
				title: "Level " + NJ.gameState.getLevel()
			});
		},

		// Initialize dimensions and geometry
		initGeometry: function() {
			var playableRect = cc.rect({
				x: cc.visibleRect.bottomLeft.x,
				y: cc.visibleRect.bottomLeft.y,
				width: cc.visibleRect.width,
				height: cc.visibleRect.height - this._numboHeaderLayer.getContentSize().height
			});

			var refDim = Math.min(playableRect.width, playableRect.height);
			var levelPadding = refDim * 0.02;
			var safeDim = refDim - levelPadding * 2;
			var cellSize = Math.min(safeDim / NJ.NUM_COLS, safeDim / NJ.NUM_ROWS);

			var levelDims = cc.size(cellSize * NJ.NUM_COLS, cellSize * NJ.NUM_ROWS);
			var levelOrigin = cc.p(playableRect.x + playableRect.width / 2 - levelDims.width / 2, playableRect.y + playableRect.height / 2 - levelDims.height / 2);
			_levelCellSize = cc.size(cellSize, cellSize);
			_levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

			_blockSize = cc.size(_levelCellSize.width * 0.92, _levelCellSize.height * 0.92);

			// initialize rectangle around level
			var levelNode = cc.DrawNode.create();
			levelNode.drawRect(cc.p(_levelBounds.x, _levelBounds.y), cc.p(_levelBounds.x + _levelBounds.width, _levelBounds.y + _levelBounds.height), cc.color(33, 33, 33, 128), 2, cc.color(173, 216, 230, 0.4*255));
			this.addChild(levelNode);

			this._selectedLinesNode = cc.DrawNode.create();
			this.addChild(this._selectedLinesNode);
		},

		// Initialize the Numbo Controller, which controls the level.
		initNumboController: function() {
			this._numboController = new NumboController();
			this._numboController.init();
		},

		// Initialize audio.
		initAudio: function() {
			if(!NJ.settings.music)
				return;

			// start the music
			cc.audioEngine.playMusic(res.backgroundTrack, true);
		},

		/////////////////////////////
		// GAME STATE MANIPULATION //
		/////////////////////////////

		// Pauses the game, halting all actions and schedulers.
		pauseGame: function() {
			// halt the doomsayer
			this._feedbackLayer.clearDoomsayer();

			cc.eventManager.pauseTarget(this, true);

			// use breadth first search to pause all valid children
			var children = [this];
			var visited = [this];

			this.pause();

			var child, i, newChildren;
			while(children.length > 0) {
				child = children.pop();

				if (child.getTag() == NJ.tags.PAUSABLE)
					child.pause();

				newChildren = child.getChildren();
				for(i = 0; i < newChildren.length; i++) {
					cc.assert(visited.indexOf(newChildren[i]) < 0, "Circular node references detected!");

					visited.push(newChildren[i]);
					children.push(newChildren[i]);
				}
			}
		},

		// Unpauses game, resuming all actions and schedulers.
		resumeGame: function() {
			// resume doomsayer if needed
			if(this._numboController.isInDanger())
				this._feedbackLayer.launchDoomsayer();

			cc.eventManager.resumeTarget(this, true);

			// use breadth first search to resume all valid children
			var children = [this];
			var visited = [this];

			this.resume();

			var child, i, newChildren;
			while(children.length > 0) {
				child = children.pop();

				if (child.getTag() == NJ.tags.PAUSABLE)
					child.resume();

				newChildren = child.getChildren();
				for(i = 0; i < newChildren.length; i++) {
					cc.assert(visited.indexOf(newChildren[i]) < 0, "Circular node references detected");

					visited.push(newChildren[i]);
					children.push(newChildren[i]);
				}
			}
		},

		////////////////////
		// Block Spawning //
		////////////////////

		// Move scene block sprite into place.
		moveBlockIntoPlace: function(moveBlock) {
			var blockTargetY = _levelBounds.y + _levelCellSize.height * (moveBlock.row + 0.5);
			var blockTargetX = _levelBounds.x + _levelCellSize.width * (moveBlock.col + 0.5);

			var duration = 0.7;
			var easing = cc.easeQuinticActionInOut();
			var moveAction = cc.moveTo(duration, cc.p(blockTargetX, blockTargetY)).easing(easing);
			moveAction.setTag(42);
			//block.stopAllActions();
			moveBlock.stopActionByTag(42);
			//block.stopAction(moveAction);
			moveBlock.runAction(moveAction);
		},

		// Spawns a block and calls itself in a loop.
		scheduleSpawn: function() {
			// TODO: Order matters when scheduling, must schedule before spawning WHY?
			// PROBABLY because we pause, but then it schedules another one after
			this.unschedule(this.scheduleSpawn);
			this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());

			this.spawnDropRandomBlock();
		},

		// Spawns a block and drops the spawned block into place.
		// NOTE: This is the function you should be using to put new blocks into the game
		// TODO: Improve structure (don't check game over state here for improved separation of concerns)
		spawnDropRandomBlock: function() {
			if(this._numboController.isGameOver()) {
				if(this.pausedJumbo != null) {
					this.clearBlocks();
					NJ.gameState.setStage("normal");
					this._backgroundLayer.updateBackgroundColor(new cc.color(0, 0, 0, 255));
					this._numboController.recallBoard(this.pausedJumbo, _blockSize);
					this.spawnNBlocks(this.pausedJumbo.numBlocks);
					this.pausedJumbo = null;
					this.spawnNBlocks(Math.floor(NJ.NUM_COLS*NJ.NUM_ROWS *.4));
				}
				else {
					this.onGameOver();
				}
				return;
			}

			if(!this._feedbackLayer.isDoomsayerLaunched()) {
				if(this._numboController.isInDanger())
					this._feedbackLayer.launchDoomsayer();
			} else {
				if(!this._numboController.isInDanger())
					this._feedbackLayer.clearDoomsayer();
			}

			var spawnBlock = this._numboController.spawnDropRandomBlock(_blockSize);
			var blockX = _levelBounds.x + _levelCellSize.width * (spawnBlock.col + 0.5);
			spawnBlock.setPosition(blockX, cc.visibleRect.top.y + _levelCellSize.height / 2);
			this.addChild(spawnBlock);

			this.moveBlockIntoPlace(spawnBlock);
		},

		spawnNBlocks: function(N) {
			this.schedule(this.spawnDropRandomBlock, 0.1, N);
		},

		clearBlocks: function(){
			this._numboController._numboLevel.killAllBlocks();
		},

		///////////////////////
		//     Multiplier    //
		///////////////////////

		resetMultiplier: function() {
			NJ.gameState.resetMultiplier();

			this._numboHeaderLayer.updateValues();
		},

		//////////////////
		// Hint Finding //
		//////////////////

		searchForHint: function(){
			var hint = this._numboController.findHint();
		},

		jiggleHintBlocks: function(){
			var hint = this._numboController.findHint();
			for (var i in hint) {
				if(hint.hasOwnProperty(i))
					hint[i].jiggleSprite();
			}
			this.unschedule(this.jiggleHintBlocks);
			this.schedule(this.jiggleHintBlocks, 5);
		},

		///////////////////////
		// Game State Events //
		///////////////////////

		// Halts game, switches to game over, sends data.
		onGameOver: function() {
			NJ.stats.addCurrency(NJ.gameState.getScore());
			NJ.stats.offerHighscore(NJ.gameState.getScore());

			NJ.stats.save();

			// first send the analytics for the current game session
			NJ.sendAnalytics();

			var that = this;

			cc.audioEngine.stopMusic();

			this.pauseGame();

			this._gameOverMenuLayer = new GameOverMenuLayer();
			this._gameOverMenuLayer.setOnRetryCallback(function() {
				that.onRetry();
			});
			this._gameOverMenuLayer.setOnMenuCallback(function() {
				that.onMenu();
			});
			this.addChild(this._gameOverMenuLayer, 999);
		},

		///////////////
		// UI Events //
		///////////////

		// On pause, pauses game and opens up the settings menu.
		onPause: function() {
			var that = this;

			this.pauseGame();

			this._settingsMenuLayer = new SettingsMenuLayer(true);
			this._settingsMenuLayer.setOnCloseCallback(function() {
				that.onResume();
			});
			this._settingsMenuLayer.setOnMenuCallback(function() {
				that.onMenu();
			});
			this.addChild(this._settingsMenuLayer, 999);
		},

		// On closing previously opened settings menu we resume.
		onResume: function() {
			this.resumeGame();

			this.removeChild(this._settingsMenuLayer);

			// play music again if music settings turned on
			if(NJ.settings.music)
				cc.audioEngine.playMusic(res.backgroundTrack);
		},

		// On game over when player chooses to go to menu we return to menu.
		onRetry: function() {
			// reset necessary modules
			this._feedbackLayer.reset();

			this.unscheduleAllCallbacks();

			//load resources
			cc.LoaderScene.preload(g_game, function () {
				cc.audioEngine.stopMusic();
				var scene = new cc.Scene();
				scene.addChild(new NumboGameLayer());
				cc.director.runScene(new cc.TransitionFade(0.5, scene));
			}, this);
		},

		// On game over when player chooses to go to menu we return to menu.
		onMenu: function() {
			// reset necessary modules
			this._feedbackLayer.reset();

			//load resources
			cc.LoaderScene.preload(g_menu, function () {
				cc.audioEngine.stopMusic();
				var scene = new cc.Scene();
				scene.addChild(new NumboMenuLayer());
				cc.director.runScene(new cc.TransitionFade(0.5, scene));
			}, this);
		},

//////////////////
// Touch Events //
//////////////////

		// On touch began, tries to find level coordinates for the touch and selects block accordingly.
		onTouchBegan: function(touchPosition) {
			this._lastTouchPosition = touchPosition;

			var touchCoords = convertPointToLevelCoords(touchPosition);

			if (touchCoords) {
				var data = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

				if(data) {
					var currBlock = data.currBlock, lastBlock = data.lastBlock;
					var color = NJ.selectionColors.getNextColor(data.numSelectedBlocks);
					currBlock.highlight(color);
					this.redrawSelectedLines();
				}
			}
			// Prevent any hint during a touch.
			this.unschedule(this.jiggleHintBlocks);
		},

		// On touch moved, selects additional blocks as the touch is held and moved using raycasting
		onTouchMoved: function(touchPosition) {
			var touchDiff = cc.pSub(touchPosition, this._lastTouchPosition);
			var touchDistance = cc.pLength(touchDiff);
			var touchDirection = cc.pNormalize(touchDiff);
			var testLength = _levelCellSize.width * 0.25;
			var currLength = 0;
			var currPosition = null;

			var touchCoords, data, currBlock, lastBlock;

			for(var i = 0; currLength < touchDistance; i++) {
				currLength = testLength * (i + 1);
				currPosition = cc.pAdd(this._lastTouchPosition, cc.pMult(touchDirection, currLength));

				touchCoords = convertPointToLevelCoords(currPosition);

				if (touchCoords) {
					data = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

					if(data) {
						currBlock = data.currBlock;
						lastBlock = data.lastBlock;
						currBlock.highlight(NJ.selectionColors.getNextColor(data.numSelectedBlocks));
						this.redrawSelectedLines();
					}
				}
			}

			touchCoords = convertPointToLevelCoords(touchPosition);

			if (touchCoords) {
				data = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

				if(data) {
					currBlock = data.currBlock;
					lastBlock = data.lastBlock;
					currBlock.highlight(NJ.selectionColors.getNextColor(data.numSelectedBlocks));
					this.redrawSelectedLines();
				}
			}

			this._lastTouchPosition = touchPosition;
		},

		// On touch ended, activates all selected blocks once touch is released.
		onTouchEnded: function(touchPosition) {
			// Activate any selected blocks.
			var clearedBlocks = this._numboController.activateSelectedBlocks();

			this.redrawSelectedLines();

			// make sure something actually happened
			if(clearedBlocks) {
				var comboLength = clearedBlocks.length;

				if(NJ.gameState.isPowerupMode()) {
					if (this._progressBar.update(comboLength)) {
						this._progressBar.reset(Math.floor(this._progressBar.denom * 1.5));
						this._numboController.requestPowerup();
					}
				}

				var powerupValues = [];

				var block;
				var i;

				for (i = 0; i < comboLength; i++) {
					block = clearedBlocks[i];
					if (block.powerup)
						powerupValues.push(block.powerup);
				}

				// TODO: Really do not like how this is done
				// Gaps may be created; shift all affected blocks down.
				for (var col = 0; col < NJ.NUM_COLS; ++col) {
					for (var row = 0; row < this._numboController.getNumBlocksInColumn(col); ++row)
						this.moveBlockIntoPlace(this._numboController.getBlock(col, row));
				}

				NJ.gameState.addBlocksCleared(comboLength);

				var scoreDifference = NJ.gameState.addScore({blockCount: comboLength});
				var differenceThreshold = 30000;

				// launch feedback for combo threshold title snippet
				if(comboLength >= 5) {
					var overflow = comboLength - 5;
					var title = "WOMBO COMBO";

					this._feedbackLayer.launchFallingBanner({
						title: title,
						targetY: cc.visibleRect.center.y
					});
				}

				var threshold = NJ.comboThresholds.get(comboLength);

				// launch feedback for gained score
				this._feedbackLayer.launchSnippet({
					title: "+" + NJ.prettifier.formatNumber(scoreDifference),
					color: threshold ? threshold.color : cc.color("#ffffff"),
					x: touchPosition.x,
					y: touchPosition.y,
					targetX: touchPosition.x,
					targetY: touchPosition.y + _levelBounds.height / 6,
					targetScale: 1 + 0.125 * Math.min(1, scoreDifference / differenceThreshold)
				});

				// Check for a powerup.
				if (powerupValues.length > 0) {
					//cc.log(data.powerupValues);
					if (powerupValues[0] == 'clearAndSpawn') {
						this.clearBlocks();
						this.spawnNBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS * .4));
					}
					else if (powerupValues[0] == 'changeJumbo') {
						this._numboController.updateRandomJumbo();
						//this.schedule(resetjumotoclassimode, 10);
					}
					else if(powerupValues[0] == 'bonusOneMania' && this.pausedJumbo == null) {
						this.pausedJumbo = {id: NJ.gameState.getJumboId(), numBlocks: this._numboController.getNumBlocks()};
						this.clearBlocks();
						this._backgroundLayer.updateBackgroundColor(new cc.color(255, 255, 0, 255));
						NJ.gameState.setStage("bonus");
						this._progressBar.update();
						this._numboController.initiateOneManiaBonus();
						this.spawnNBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS *.4));
					}
				}

				// Level up with feedback if needed
				if (NJ.gameState.levelUpIfNeeded()) {
					// Check for Jumbo Swap
					if (NJ.gameState.currentJumboId == "multiple-progression") {
						this._numboController.updateMultipleProgression();
					}

					// Display "Level x"
					this._feedbackLayer.launchFallingBanner({
						title: "Level " + NJ.gameState.getLevel()
					});

				}
				// bonus for clearing screen
				if (this._numboController.getNumBlocks() < Math.ceil(NJ.NUM_COLS/2)) {
					this.spawnNBlocks(Math.floor(NJ.NUM_COLS*NJ.NUM_ROWS *.4));
					this.unschedule(this.scheduleSpawn);
					this.schedule(this.scheduleSpawn, 6);
					this._feedbackLayer.launchFallingBanner({
						title: "Nice Clear!",
						targetY: cc.visibleRect.center.y * 0.5
					});

					// give the player 5*999 points and launch 5 random '+999' snippets
					for (var i = 0; i < 5; ++i) {
						scoreDifference = NJ.gameState.addScore({numPoints: 999});
						this._feedbackLayer.launchSnippet({
							title: "+" + scoreDifference,
							x: cc.visibleRect.center.x,
							y: cc.visibleRect.center.y,
							targetX: _levelBounds.x + Math.random() * _levelBounds.width,
							targetY: _levelBounds.y + Math.random() * _levelBounds.height
						});
					}
				}

				// we made a new combo, record the combo time in game state
				this.unschedule(this.resetMultiplier);
				this.schedule(this.resetMultiplier, 5, 1);

				NJ.gameState.offerComboForMultiplier();

				// increment score, and update header labels
				this._numboHeaderLayer.updateValues();

				// Allow controller to look for new hint.
				this._numboController.resetKnownPath();
			}

			// schedule a hint
			this.schedule(this.jiggleHintBlocks, 5);
		},
		/*
		 pauseSpawn: function(time) {
		 this.unschedule(this.scheduleSpawn());
		 this.schedule(this.restartSpawn, time, 1);
		 },

		 restartSpawn: function() {
		 this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());
		 console.log("FREEZE");
		 },*/

/////////////
// Drawing //
/////////////

		// redraw lines indicating selected blocks
		redrawSelectedLines: function() {
			this._selectedLinesNode.clear();

			var selectedBlocks = this._numboController.getSelectedBlocks();
			var first, second;
			for(var i = 0; i < selectedBlocks.length - 1; i++) {
				first = selectedBlocks[i];
				second = selectedBlocks[i + 1];

				this._selectedLinesNode.drawSegment(convertLevelCoordsToPoint(first.col, first.row),
					convertLevelCoordsToPoint(second.col, second.row), 1, cc.color("#ffffff"));
			}
		}
	});
}());
