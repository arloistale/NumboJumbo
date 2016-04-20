/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = (function() {

	// Level Data
	var _levelBounds = null;
	var _levelCellSize = null;

	var _blockSize = null;

	// Number of times a hint is jiggled.
	var jiggleCount = 0;

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
			var radius = 0.5 * _blockSize.width;

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
		_toolbarLayer: null,
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

		pausedJumbo: null,

		_curtainLayer: null,

		levelTransition: false,

		////////////////////
		// Initialization //
		////////////////////

		ctor: function () {
			this._super();

			this.setTag(NJ.tags.PAUSABLE);

			NJ.gameState.init();

			// Init game logic
			this.initInput();
			this.initNumboController();

			// Init game visuals and audio
			this.initUI();
			this.initGeometry();
			this.initAudio();

			// Begin scheduling block drops.
			this.schedule(this.spawnDropRandomBlock, 0.1, Math.floor(NJ.NUM_ROWS*NJ.NUM_COLS *.4));
			this.schedule(this.scheduleSpawn, 0.1*20);

			// begin scheduling hint jiggles
			//this.unschedule(this.jiggleHintBlocks);
			this.schedule(this.jiggleHintBlocks, 5);

		},
                           
        onExit:function() {
            this._curtainLayer.release();
            this._super();
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
			this._backgroundLayer = new BackgroundLayer();
			this.addChild(this._backgroundLayer, -3);

			// header
			this._numboHeaderLayer = new NumboHeaderLayer();
			this._numboHeaderLayer.setOnPauseCallback(function() {
				that.onPause();
			});
			this.addChild(this._numboHeaderLayer, 999);
			this._numboHeaderLayer.updateValues();

			// toolbar
			this._toolbarLayer = new ToolbarLayer();
			this._toolbarLayer.setOnToggleThemeCallback(function() {
				that.onToggleTheme();
			});
			this.addChild(this._toolbarLayer, 999);

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
				y: cc.visibleRect.bottomLeft.y + this._toolbarLayer.getContentSize().height,
				width: cc.visibleRect.width,
				height: cc.visibleRect.height - this._numboHeaderLayer.getContentSize().height - this._toolbarLayer.getContentSize().height
			});

			var refDim = Math.min(playableRect.width, playableRect.height);
			var levelPadding = refDim * 0.02;
			var safeDim = refDim - levelPadding * 2;
			var cellSize = Math.min(safeDim / NJ.NUM_COLS, safeDim / NJ.NUM_ROWS);

			var levelDims = cc.size(cellSize * NJ.NUM_COLS, cellSize * NJ.NUM_ROWS);
			var levelOrigin = cc.p(playableRect.x + playableRect.width / 2 - levelDims.width / 2, playableRect.y + playableRect.height / 2 - levelDims.height / 2);
			_levelCellSize = cc.size(cellSize, cellSize);
			_levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

			_blockSize = cc.size(_levelCellSize.width * NJ.blockCellSize, _levelCellSize.height * NJ.blockCellSize);

			// initialize rectangle around level
			var levelNode = cc.DrawNode.create();
			levelNode.drawRect(cc.p(_levelBounds.x, _levelBounds.y), cc.p(_levelBounds.x + _levelBounds.width, _levelBounds.y + _levelBounds.height), cc.color(128, 128, 128, 64), 3, cc.color("#ffffff"));
			this.addChild(levelNode, -1);

			this._selectedLinesNode = cc.DrawNode.create();
			this.addChild(this._selectedLinesNode, 2);

			this._progressBar = new ProgressBarLayer(_levelBounds);
			this.addChild(this._progressBar, -2);

			this._curtainLayer = new CurtainLayer(_levelBounds);
            this._curtainLayer.retain();
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
            moveBlock.stopActionByTag(42);
			moveBlock.runAction(moveAction);
		},

		// Spawns a block and calls itself in a loop.
		scheduleSpawn: function() {
			// TODO: Order matters when scheduling, must schedule before spawning WHY?
			// PROBABLY because we pause, but then it schedules another one after
			this.unschedule(this.scheduleSpawn);
			this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());
			//console.log("SpawnTime: " + this._numboController.getSpawnTime());

			// don't make a hint unless they haven't made a move, AND a move exists
			if (NJ.gameState.getBlocksCleared() == 0) {
				if (this._numboController.getKnownPathLength() > 0) {
					this._feedbackLayer.launchHelperBanner({
						title: "swipe an equation!"
					});
				}
				else {
					this.spawnDropRandomBlock();
				}
			}
			else {
				this.spawnDropRandomBlock();
			}
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
					this.spawnRandomBlocks(this.pausedJumbo.numBlocks);
					this.pausedJumbo = null;
					this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS*NJ.NUM_ROWS *.4));
				} else {
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
			this.addChild(spawnBlock, 2, 69);

			this.moveBlockIntoPlace(spawnBlock);
		},

		spawnRandomBlocks: function(N) {
			this.schedule(this.spawnDropRandomBlock, 0.1, N);
		},

		clearBlocks: function() {
			this._numboController.killAllBlocks();
		},

		//////////////////
		// Hint Finding //
		//////////////////

		jiggleHintBlocks: function() {
			var hint = this._numboController.findHint();
			for (var i in hint) {
				if (hint.hasOwnProperty(i))
					hint[i].jiggleSprite();
			}
			this.unschedule(this.jiggleHintBlocks);
			this.jiggleCount++;
			if(this.jiggleCount < 2 || NJ.gameState.getBlocksCleared() == 0)
				this.schedule(this.jiggleHintBlocks, 5);

		},

		///////////////////////
		// Game State Events //
		///////////////////////

		// Halts game, switches to game over, sends data.
		onGameOver: function() {
			NJ.stats.addCurrency(NJ.gameState.getScore());
			NJ.stats.offerHighscore(NJ.gameState.getScore());
			NJ.stats.offerHighlevel(NJ.gameState.getLevel());

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

		// on toggle theme, change errthang
		onToggleTheme: function() {
			NJ.themes.toggle();

			this._backgroundLayer.setBackgroundColor(NJ.themes.backgroundColor);
			this._numboHeaderLayer.updateTheme();

			this._numboController.updateTheme();
		},

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
			if(!this.levelTransition) {
				this._lastTouchPosition = touchPosition;

				var touchCoords = convertPointToLevelCoords(touchPosition);

				if (touchCoords) {
					var selectedBlocks = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

					if (selectedBlocks) {
						var selectedBlockSum = 0;
						var block;
						for (i = 0; i < selectedBlocks.length; i++) {
							block = selectedBlocks[i];
							selectedBlockSum += block.val;
						}

						this.highlightSelectedBlocks(selectedBlocks);
						this.redrawSelectedLines(selectedBlocks);
					}
				}

				// Prevent any hint during a touch.
				this.unschedule(this.jiggleHintBlocks);

			}
		},

		// On touch moved, selects additional blocks as the touch is held and moved using raycasting
		onTouchMoved: function(touchPosition) {
			if(!this.levelTransition) {
				var touchDiff = cc.pSub(touchPosition, this._lastTouchPosition);
				var touchDistance = cc.pLength(touchDiff);
				var touchDirection = cc.pNormalize(touchDiff);
				var testLength = _levelCellSize.width * 0.25;
				var currLength = 0;
				var currPosition = null;

				var touchCoords, selectedBlocks, lastSelectedBlock;

				for (var i = 0; currLength < touchDistance; i++) {
					currPosition = cc.pAdd(this._lastTouchPosition, cc.pMult(touchDirection, currLength));

					touchCoords = convertPointToLevelCoords(currPosition);

					if (touchCoords)
						selectedBlocks = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

					currLength = testLength * (i + 1);
				}

				touchCoords = convertPointToLevelCoords(touchPosition);

				// we only look for additional touch coords if we currently touched a block
				if (touchCoords) {
					var lastCoords = touchCoords;

					selectedBlocks = this._numboController.selectBlock(lastCoords.col, lastCoords.row);
				}

				// only
				selectedBlocks = selectedBlocks || this._numboController.getSelectedBlocks();

				// update graphics for selected blocks
				if (selectedBlocks) {
					var selectedBlockSum = 0;
					var block;
					for (i = 0; i < selectedBlocks.length; i++) {
						block = selectedBlocks[i];
						selectedBlockSum += block.val;
					}

					this.highlightSelectedBlocks(selectedBlocks);
					this.redrawSelectedLines(selectedBlocks);

					lastSelectedBlock = selectedBlocks[selectedBlocks.length - 1];
					// draw a line from last selected to our finger if we are outside of the range of the block
					if (lastSelectedBlock) {
						var lastBlockPos = convertLevelCoordsToPoint(lastSelectedBlock.col, lastSelectedBlock.row);
						var diff = cc.pSub(touchPosition, lastBlockPos);
						var radius = 0.5 * _blockSize.width;
						if (cc.pDot(diff, diff) >= radius * radius) {
							this._selectedLinesNode.drawSegment(convertLevelCoordsToPoint(lastSelectedBlock.col, lastSelectedBlock.row),
								touchPosition, 3, NJ.getColor(NJ.gameState.getJumbo().blockColorString, selectedBlockSum - 1));
						}
					}
				}

				this._lastTouchPosition = touchPosition;
			}
		},

		// On touch ended, activates all selected blocks once touch is released.
		onTouchEnded: function(touchPosition) {
			if(!this.levelTransition) {
				// special case for if this is the very first combo:
				var isFirstCombo = NJ.gameState.getBlocksCleared() == 0; // bool

				// Activate any selected blocks.
				var clearedBlocks = this._numboController.activateSelectedBlocks();

				this.redrawSelectedLines();

				// make sure something actually happened
				if (clearedBlocks) {
					var clearedNums = clearedBlocks.map(function (b) {
						return b.val;
					});
					var comboLength = clearedBlocks.length;

					// initiate iterator variables here because we use them a lot
					var i, block;

					// TODO: Really do not like how this is done
					// Gaps may be created; shift all affected blocks down.
					for (var col = 0; col < NJ.NUM_COLS; ++col) {
						for (var row = 0; row < this._numboController.getNumBlocksInColumn(col); ++row)
							this.moveBlockIntoPlace(this._numboController.getBlock(col, row));
					}

					// add to number of blocks cleared
					NJ.gameState.addBlocksCleared(comboLength);

					// the base score is what we summed to
					var baseScore = Math.max.apply(null, clearedNums);

					// begin calculating score bonus
					var scoreBonus = 0;

					var threshold = NJ.comboThresholds.get(comboLength);
					if (threshold) {
						var scoreMultiplier = clearedBlocks.length - 3;
						scoreBonus += baseScore * scoreMultiplier;
					}

					var scoreDifference = NJ.gameState.addScore({
						amount: baseScore,
						bonus: scoreBonus
					});

					var differenceThreshold = 300;

					// launch 'yay' helper snippet if this was the first combo
					if (isFirstCombo) {
						// TODO: send the timestamp for first move off to goggle analytics
						var helperText = "";
						var maxIndex = 0;
						for (i = 0; i < clearedBlocks.length; ++i) {
							if (clearedBlocks[i].val > clearedBlocks[maxIndex].val) {
								maxIndex = i;
							}
						}

						for (i = 0; i < clearedBlocks.length; ++i) {
							if (i != maxIndex) {
								if (helperText == "") {
									helperText += clearedBlocks[i].val;
								}
								else {
									helperText += " + " + clearedBlocks[i].val;
								}
							}
						}
						helperText += " = " + clearedBlocks[maxIndex].val;

						this._feedbackLayer.launchHelperBanner({
							title: helperText,
							targetY: cc.visibleRect.center.y * 1,
							timeout: 3.0
						});
					}

					// launch feedback for combo threshold title snippet
					if (comboLength >= 5 && isFirstCombo == false) {
						var title = "WOMBO COMBO";

						this._feedbackLayer.launchFallingBanner({
							title: title,
							color: threshold ? threshold.color : cc.color("#ffffff"),
							targetY: cc.visibleRect.center.y,
							easing: cc.easeQuinticActionOut()
						});
					}

					// launch feedback for gained score
					this._feedbackLayer.launchSnippet({
						title: "+" + NJ.prettifier.formatNumber(scoreDifference),
						color: threshold ? threshold.color : cc.color("#ffffff"),
						x: touchPosition.x,
						y: touchPosition.y,
						targetX: touchPosition.x,
						targetY: touchPosition.y + _levelBounds.height / 6,
						targetScale: 1 + 0.25 * Math.min(1, scoreDifference / differenceThreshold)
					});

					/*
					var powerupValues = [];

					for (i = 0; i < comboLength; i++) {
						block = clearedBlocks[i];
						if (block.powerup)
							powerupValues.push(block.powerup);
					}

					// Check for a powerup.
					if (powerupValues.length > 0) {
						if (powerupValues[0] == 'clearAndSpawn') {
							this.clearBlocks();
							this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS * .4));
						}
						else if (powerupValues[0] == 'bonusOneMania' && this.pausedJumbo == null) {
							this.pausedJumbo = {
								id: NJ.gameState.getJumboId(),
								numBlocks: this._numboController.getNumBlocks()
							};
							this.clearBlocks();
							this._backgroundLayer.updateBackgroundColor(new cc.color(255, 255, 0, 255));
							NJ.gameState.setStage("bonus");
							NJ.chooseJumbo("one-mania");
							this._numboController.updateSpawnDataFromJumbo();
							this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS * .4));
						}
					}
					*/

					// Level up with feedback if needed
					if (NJ.gameState.levelUpIfNeeded()) {

						this._numboController.updateProgression();

						// Check for Jumbo Swap
						if (NJ.gameState.currentJumboId == "multiple-progression") {
							this._numboController.updateMultipleProgression();
						}

						//this.schedule(this.closeCurtain,.6);
						this.closeCurtain();
						this.unschedule(this.scheduleSpawn);
						this.schedule(this.openCurtain, 5);

						// Display "Level x"
						/*this._feedbackLayer.launchFallingBanner({
						 title: "Level " + NJ.gameState.getLevel()
						 title: "Level " + NJ.gameState.getLevel()
						 });*/
						// Play level up sound
						if (NJ.settings.sounds)
							cc.audioEngine.playEffect(res.levelupSound);
					}
					// Play progress sound if not a level up
					else if (NJ.settings.sounds)
						cc.audioEngine.playEffect(progresses[Math.floor(progresses.length * NJ.gameState.getLevelupProgress())]);

					this.checkClearBonus();

					NJ.gameState.offerComboForMultiplier();

					// show player data
					this._numboHeaderLayer.updateValues();

					// Allow controller to look for new hint.
					this._numboController.resetKnownPath();
					this.jiggleCount = 0;
				}

				// schedule a hint
				this.schedule(this.jiggleHintBlocks, 12);
			}
		},

		checkClearBonus: function() {
			// bonus for clearing screen
			if (this._numboController.getNumBlocks() < Math.ceil(NJ.NUM_COLS/2)) {
				if(NJ.settings.sounds)
					cc.audioEngine.playEffect(res.cheeringSound);
					cc.audioEngine.playEffect(res.cheeringSound);
				this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS*NJ.NUM_ROWS *.4));
				this.unschedule(this.scheduleSpawn);
				this.schedule(this.scheduleSpawn, 6);
				this._feedbackLayer.launchFallingBanner({
					title: "Nice Clear!",
					targetY: cc.visibleRect.center.y * 0.5
				});

				// give the player 5 * 9 points and launch 5 random '+9' snippets
				for (i = 0; i < 5; ++i) {
					scoreDifference = NJ.gameState.addScore(9);
					this._feedbackLayer.launchSnippet({
						title: "+" + scoreDifference,
						x: cc.visibleRect.center.x,
						y: cc.visibleRect.center.y,
						targetX: _levelBounds.x + Math.random() * _levelBounds.width,
						targetY: _levelBounds.y + Math.random() * _levelBounds.height
					});
				}
			}
		},

		closeCurtain: function() {
			this.levelTransition = true;
			if(NJ.settings.sounds)
				cc.audioEngine.playEffect(res.applauseSound);

			this.unschedule(this.closeCurtain);
			this._curtainLayer.animate();
			this.addChild(this._curtainLayer, 2);

			for (var col = 0; col < NJ.NUM_COLS; ++col) {
				for (var row = 0; row < this._numboController.getNumBlocksInColumn(col); ++row)
					this.moveBlockIntoPlace(this._numboController.getBlock(col, row));
			}
		},

		openCurtain: function() {
			this.levelTransition = false;
			this.removeChild(this._curtainLayer);
			this.unschedule(this.openCurtain);
			this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());
			this.checkClearBonus();
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

		highlightSelectedBlocks: function(selectedBlocks, color) {
			if(true)//!selectedBlocks)
				return;

			var i, block;

			for (i = 0; i < selectedBlocks.length; i++) {
				block = selectedBlocks[i];
				block.highlight(color);
			}
		},

		// redraw lines indicating selected blocks
		redrawSelectedLines: function(selectedBlocks) {
			this._selectedLinesNode.clear();

			if(!selectedBlocks)
				return;
			
			var i;

			var currSum = 0;
			var color;
			var first, second;
			for(i = 0; i < selectedBlocks.length - 1; i++) {
				first = selectedBlocks[i];
				second = selectedBlocks[i + 1];

				currSum += first.val;

				color = NJ.getColor(NJ.gameState.getJumbo().blockColorString, currSum - 1);

				this._selectedLinesNode.drawSegment(convertLevelCoordsToPoint(first.col, first.row),
					convertLevelCoordsToPoint(second.col, second.row), 3, color);
			}
		}
	});
}());