/**
 * Created by jonathanlu on 1/18/16.
 */

var BaseGameLayer = cc.Layer.extend({

	// Level Data
	_levelBounds: null,
	_levelCellSize: null,

	_headerSize: null,
	_toolBarSize: null,

	_blockSize: null,

    // Hint Data
    // Number of times a hint is jiggled.
    _jiggleCount: 0,

	// UI Data
	_numboHeaderLayer: null,
	_toolbarLayer: null,
	_settingsMenuLayer: null,
	_gameOverMenuLayer: null,
	_effectsLayer: null,
	_feedbackLayer: null,

    // Audio Data
    _backgroundTrack: null,

	// Geometry Data
	_backgroundLayer: null,

	_levelSprite: null,
	_selectedLinesNode: null,

	// Controller Data
	_numboController: null,

	// Selection Data
	_lastTouchPosition: null,

	// amount of time to wait before destroying bonus blocks
	_killDelay: null,
	// amount of time to wait before spawning blocks in turn-based moves
	// (must be strictly greater than _killDelay!)
	_spawnDelay: null,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function () {
		this._super();

		this.unscheduleAllCallbacks();
		this.stopAllActions();

		this.setTag(NJ.tags.PAUSABLE);

		// Init game logic
		this._initInput();
		this._initController();

		// Init game visuals and audio
		this._initGeometry();
		this._initAudio();
		this._initParticles();

        this._initUI();

		this._killDelay = 0.35;
		this._spawnDelay = this._killDelay + 0.1;

		// extranneous initialization
		this._reset();
	},

	onExit: function() {
		this._super();
	},

	// Override this for extranneous
	_reset: function() {
		var that = this;
        NJ.gameState.init();

        this.unscheduleAllCallbacks();
        this.stopAllActions();

        this._selectedLinesNode.clear();

        this._numboHeaderLayer.reset();
        this._numboHeaderLayer.setScoreValue(0);
		this._numboHeaderLayer.setConditionValue(0);

        this._numboController.reset();
        this._feedbackLayer.reset();
        this._effectsLayer.reset();

        if(NJ.settings.music)
            cc.audioEngine.playMusic(this._backgroundTrack, true);


		this.schedule(function(){
			that._numboController.findHint();
		}, 0.1);
	},

	_initParticles: function(){
		for (var col = 0; col < NJ.NUM_COLS; ++col){
			for (var row = 0; row < NJ.NUM_ROWS; ++row) {
				var coords = this._convertLevelCoordsToPoint(col, row);
				this._effectsLayer.initializeParticleSystemAt({
					x: coords.x,
					y: coords.y,
					col: col,
					row: row
				});
			}
		}
	},

	// Initialize input depending on the device.
	_initInput: function() {
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
	_initUI: function() {
		var that = this;

		// header
		this._numboHeaderLayer = new NumboHeaderLayer(this._headerSize);
		this._numboHeaderLayer.setOnPauseCallback(function() {
			that.onPause();
		});
		this.addChild(this._numboHeaderLayer, 999);
		this._numboHeaderLayer.setScoreValue(0);
		this._numboHeaderLayer.setConditionValue(0);

		// toolbar
		this._toolbarLayer = new ToolbarLayer( this._toolBarSize);
		this._toolbarLayer.setOnToggleThemeCallback(function() {
			that.onToggleTheme();
		});
		this.addChild(this._toolbarLayer, 999);
	},

	// Initialize dimensions and geometry
	_initGeometry: function() {
		// background
		this._backgroundLayer = new BackgroundLayer();
		this.addChild(this._backgroundLayer, -3);

		// level geometry

		// first we must calculate header and toolbar sizes (even though we are not in UI) in order to make space
		 this._headerSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar);
		 this._toolBarSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar);

		var playableRect = cc.rect({
			x: cc.visibleRect.bottomLeft.x,
			y: cc.visibleRect.bottomLeft.y +  this._toolBarSize.height,
			width: cc.visibleRect.width,
			height: cc.visibleRect.height -  this._headerSize.height -  this._toolBarSize.height
		});

		var refDim = Math.min(playableRect.width, playableRect.height);
		var levelPadding = refDim * 0.02;
		var safeDim = refDim - levelPadding * 2;
		var cellSize = Math.min(safeDim / NJ.NUM_COLS, safeDim / NJ.NUM_ROWS);

		var levelDims = cc.size(cellSize * NJ.NUM_COLS, cellSize * NJ.NUM_ROWS);
		var levelOrigin = cc.p(playableRect.x + playableRect.width / 2 - levelDims.width / 2, playableRect.y + playableRect.height / 2 - levelDims.height / 2);
		this._levelCellSize = cc.size(cellSize, cellSize);
		this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

		this._blockSize = cc.size( this._levelCellSize.width * NJ.blockCellSize,  this._levelCellSize.height * NJ.blockCellSize);

		// initialize rectangle around level
		this._levelSprite = new cc.Sprite(res.levelImage);
		var spriteSize = this._levelSprite.getContentSize();
		this._levelSprite.setColor(NJ.themes.levelColor);
		this._levelSprite.setScale(levelDims.width / spriteSize.width, levelDims.height / spriteSize.height);
		this._levelSprite.attr({
			anchorX: 0.5,
			anchorY: 0.5,
			x: cc.visibleRect.center.x,
			y: cc.visibleRect.center.y
		});
		//this.addChild(this._levelSprite, -1);

		// selected lines
		this._selectedLinesNode = cc.DrawNode.create();
		this.addChild(this._selectedLinesNode, 2);

		this.redrawSelectedLines(null);

		// feedback overlay
		this._feedbackLayer = new FeedbackLayer();
		this.addChild(this._feedbackLayer, 800);

		// effects middle layer between background and game elements
		this._effectsLayer = new EffectsLayer();
		this.addChild(this._effectsLayer, 24);
	},

	// Initialize the Numbo Controller, which controls the level.
	_initController: function() {
		this._numboController = new NumboController();
		this._numboController.init();
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
        this._backgroundTrack = res.backgroundTrack;
	},

	/////////////////////////
	// Game State Handling //
	/////////////////////////

    // checks whether the game has ended and performs actions appropriately
	// this function also triggers the doom sayer if in danger
	// returns whether the game is over
    checkGameOver: function() {
        if (this.isGameOver() ) {
            this.onGameOver();
			return true;
        }

		return false;
    },

    // IMPORTANT: You must override this function for all children
    // Determines whether the game session has ended
    isGameOver: function() {
        cc.assert(false, "isGameOver: abstract function");

        return true;
    },

	pauseInput: function() {
		cc.eventManager.pauseTarget(this, true);
	},

	resumeInput: function() {
		cc.eventManager.resumeTarget(this, true);
	},

	// Pauses the game, halting all actions and schedulers.
	pauseGame: function() {
		// halt the doomsayer
		this._feedbackLayer.clearDoomsayer();

		// use breadth first search to pause all valid children
		var children = [this];
		var visited = [this];

		this.pauseInput();
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
		// use breadth first search to resume all valid children
		var children = [this];
		var visited = [this];

		this.resume();
		this.resumeInput();

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
	moveBlockIntoPlace: function(moveBlock, shouldOverride) {

		var blockTargetY = this._levelBounds.y +  this._levelCellSize.height * (moveBlock.row + 0.5);
		var blockTargetX = this._levelBounds.x +  this._levelCellSize.width * (moveBlock.col + 0.5);
		var duration = 0.7;
		var easing = cc.easeQuinticActionInOut();
		var moveAction = cc.moveTo(duration, cc.p(blockTargetX, blockTargetY)).easing(easing);
		moveAction.setTag(42);

		//if(!moveBlock.isFalling || shouldOverride) {
		//	moveBlock.isFalling = true;

			moveBlock.stopAllActions();
			moveBlock.runAction(cc.sequence(moveAction, cc.callFunc(function() {
				moveBlock.isFalling = false;
			})));
		//}
	},

	// spawns and drops a block with random col and val.
	// plays appropriate sound
	spawnDropBlock: function(col, val) {
		var spawnBlock = new NumboBlock( this._blockSize);
		this._numboController.spawnDropBlock(spawnBlock, col, val);
		this._instantiateBlock(spawnBlock);
		this.moveBlockIntoPlace(spawnBlock);

		if(NJ.settings.sounds) {
			cc.audioEngine.playEffect(res.clickSound);
		}
	},

	// Spawns a block with random col and val and drops the spawned block into place.
	// plays appropriate sound
	spawnDropRandomBlock: function() {
		var spawnBlock = new NumboBlock( this._blockSize);
		this._numboController.spawnDropRandomBlock(spawnBlock);
		this._instantiateBlock(spawnBlock);
		this.moveBlockIntoPlace(spawnBlock);

		if(NJ.settings.sounds) {
			cc.audioEngine.playEffect(res.clickSound);
		}
	},

	// spawns a specified amount of blocks randomly
	// plays the drop random blocks sound
	spawnDropRandomBlocks: function(amount) {
		var spawnBlock;

		for(var i = 0; i < amount; i++) {
			spawnBlock = new NumboBlock( this._blockSize);
			this._numboController.spawnDropRandomBlock(spawnBlock);
			this._instantiateBlock(spawnBlock);
			this.moveBlockIntoPlace(spawnBlock);
		}

		if(NJ.settings.sounds) {
			cc.audioEngine.playEffect(res.plipSound);
		}
	},

	// helper function to move a spawned block into place, shifting its position based on column
	_instantiateBlock: function(block) {
		var blockX = this._levelBounds.x +  this._levelCellSize.width * (block.col + 0.5);
		block.setPosition(blockX, cc.visibleRect.top.y +  this._levelCellSize.height / 2);
		this.addChild(block, 42, 42);
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

	// Halts game, children must handle what to do afterwards in terms of going to game over screen
	// also increments number of times played overall
	onGameOver: function() {
		this._selectedLinesNode.clear();
		this._feedbackLayer.clearDoomsayer();
		this.pauseInput();
		this.unscheduleAllCallbacks();

		if(NJ.settings.sounds)
			cc.audioEngine.playEffect(res.overSound);

		cc.audioEngine.stopMusic();

		// achievements

		var numGames = NJ.stats.incrementNumGamesCompleted();

		if(numGames == 1) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.played1);
		} else if(numGames == 5) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.played2);
		} else if(numGames == 10) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.played3);
		} else if(numGames == 25) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.played4);
		} else if(numGames == 50) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.played5);
		}
	},

	///////////////
	// UI Events //
	///////////////

	// on toggle theme, change errthang
	onToggleTheme: function() {
		NJ.themes.toggle();

		this._backgroundLayer.setBackgroundColor(NJ.themes.backgroundColor);
		//this._levelSprite.setColor(NJ.themes.levelColor);

		this._numboHeaderLayer.updateTheme();

		this._numboController.updateTheme();
	},

	// On pause, pauses game and opens up the settings menu.
	onPause: function() {
		var that = this;

		this._feedbackLayer.clearDoomsayer();

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
		// resume doomsayer if needed
		if(this.isInDanger())
			this._feedbackLayer.launchDoomsayer();

		this.resumeGame();

		this.removeChild(this._settingsMenuLayer);

		// play music again if music settings turned on
		if(NJ.settings.music)
			cc.audioEngine.playMusic(res.backgroundTrack);
	},

	// On game over when player chooses to go to menu we return to menu.
	onRetry: function() {
        this.removeChild(this._gameOverMenuLayer);

        this.unscheduleAllCallbacks();
        this.stopAllActions();
        this.resumeGame();

		this._reset();
	},

	// On game over when player chooses to go to menu we return to menu.
	onMenu: function() {
		// reset necessary modules
		this._feedbackLayer.reset();

		//load resources
		cc.audioEngine.stopMusic();
		var scene = new cc.Scene();
		scene.addChild(new NumboMenuLayer());
		cc.director.runScene(new cc.TransitionFade(0.5, scene));
	},

//////////////////
// Touch Events //
//////////////////

	// On touch began, tries to find level coordinates for the touch and selects block accordingly.
	onTouchBegan: function(touchPosition) {
		if(!this.levelTransition) {
			this._lastTouchPosition = touchPosition;

			var touchCoords = this._convertPointToLevelCoords(touchPosition);

			if (touchCoords && this._isPointWithinCoordsDistanceThreshold(touchPosition, touchCoords.col, touchCoords.row)) {
				var selectedBlock = this._numboController.selectBlock(touchCoords.col, touchCoords.row);
				var selectedBlocks = this._numboController.getSelectedBlocks();

				// we know there is at least 1 selected block
				if (selectedBlocks.length) {
					var selectedBlockSum = 0;
					var block;
					for (i = 0; i < selectedBlocks.length; i++) {
						block = selectedBlocks[i];
						selectedBlockSum += block.val;
					}

					// if selected block was returned then we have a new selected block deal with
					if(selectedBlock) {
						selectedBlock.highlight();

						// gotta update the equation
						var selectedNums = selectedBlocks.map(function(b) {
							return b.val;
						});
						this._numboHeaderLayer.setEquation(selectedNums);
					}

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
			var testLength =  this._levelCellSize.width * 0.25;
			var currLength = 0;
			var currPosition = null;

			var touchCoords, touchBlock, selectedBlock, deselectedBlock;

			var penultimate = this._numboController.getPenultimateSelectedBlock();

			for (var i = 0; currLength <= touchDistance; i++) {
				currPosition = cc.pAdd(this._lastTouchPosition, cc.pMult(touchDirection, currLength));

				touchCoords = this._convertPointToLevelCoords(currPosition);

				// if we have valid touch coordinates then we either select or deselect the block based on
				// whether it is already selected and is the last selected block
				if (touchCoords && this._isPointWithinCoordsDistanceThreshold(currPosition, touchCoords.col, touchCoords.row)) {
					touchBlock = this._numboController.getBlock(touchCoords.col, touchCoords.row);
					if(touchBlock === penultimate) {
						deselectedBlock = this._numboController.deselectLastBlock();
					} else {
						selectedBlock = this._numboController.selectBlock(touchCoords.col, touchCoords.row);
					}
				}

				currLength = testLength * (i + 1);
			}

			var selectedBlocks = this._numboController.getSelectedBlocks();

			if(selectedBlock || deselectedBlock) {
				// also update the equation
				var selectedNums = selectedBlocks.map(function (b) {
					return b.val;
				});
				this._numboHeaderLayer.setEquation(selectedNums);
			}

			// update graphics for selected blocks
			if (selectedBlocks.length) {
				var selectedBlockSum = 0;
				var block;
				for (i = 0; i < selectedBlocks.length; i++) {
					block = selectedBlocks[i];
					selectedBlockSum += block.val;
				}

				var currColor = NJ.getColor(selectedBlockSum - 1);

				// if selected block was returned then we have a new selected block deal with
				if(selectedBlock) {
					var highlightBlocks = [selectedBlock];

					var isCombo = this._numboController.isSelectedClearable();

					if(isCombo) {
						highlightBlocks = highlightBlocks.concat(selectedBlocks.slice(0));

						this._effectsLayer.launchComboOverlay();
						selectedBlock.highlight();
					}

					// remove duplicates
					for (i = 0; i < highlightBlocks.length; ++i) {
						for (var j = i + 1; j < highlightBlocks.length; ++j) {
							if (highlightBlocks[i] === highlightBlocks[j])
								highlightBlocks.splice(j--, 1);
						}
					}

					// highlight all blocks to be potentially cleared
					for (i = 0; i < highlightBlocks.length; ++i) {
						highlightBlocks[i].highlight();
					}
				} else {
					if(selectedBlocks.length < 5)
						this._effectsLayer.clearComboOverlay();
				}

				this.redrawSelectedLines(selectedBlocks);

				// draw a line from last selected to our finger if we are outside of the range of the block
				var lastBlockPos = this._convertLevelCoordsToPoint(block.col, block.row);
				var diff = cc.pSub(touchPosition, lastBlockPos);
				var radius = 0.5 *  this._blockSize.width;
				if (cc.pDot(diff, diff) >= radius * radius) {
					this._selectedLinesNode.drawSegment(this._convertLevelCoordsToPoint(block.col, block.row),
						touchPosition, 3, currColor);
				}
			}

			this._lastTouchPosition = touchPosition;
		}
	},

	// On touch ended, activates all selected blocks once touch is released.
    // Returns the cleared blocks.
	onTouchEnded: function(touchPosition) {
		// Activate any selected blocks.
		var clearedAndBonusBlocks = this._numboController.activateSelectedBlocks();
		var clearedBlocks = clearedAndBonusBlocks.clearedBlocks;
		var bonusBlocks = clearedAndBonusBlocks.bonusBlocks;

		this.redrawSelectedLines();

		this._numboHeaderLayer.setEquation([]);

		this._effectsLayer.clearComboOverlay();

		var comboLength = clearedBlocks.length;

		// make sure something actually happened
		if(!comboLength)
			return clearedBlocks;

		this.scoreBlocksMakeParticles(clearedBlocks, comboLength);

		this.relocateBlocks();

		//if(bonusBlocks.length > 0)
			//this.killBlocksAfterDelay(bonusBlocks, this._killDelay);

		// Allow controller to look for new hint.
		this._numboController.resetKnownPath();
		this.jiggleCount = 0;

		// schedule a hint
		this.schedule(this.jiggleHintBlocks, 7);

		return clearedBlocks;
	},

	scoreBlocksMakeParticles: function(blocks, comboLength){
		// initiate iterator variables here because we use them a lot
		var i, block, color;
		var sumPos = cc.p(0, 0);

		var scoreDifference = 0;

		// loop through the blocks, giving each one a particle explosion and also computing some values
		for(i = 0; i < blocks.length; i++) {
			block = blocks[i];
			// we need to find the target value which will be the maximum value in the cleared blocks
			scoreDifference += block.val;

			// also count how many extra of the target we cleared
			sumPos.x += block.x;
			sumPos.y += block.y;

			color = NJ.getColor(block.val - 1) || cc.color("#ffffff");
			if (block) {
				var coords = this._convertPointToLevelCoords({x: block.x, y: block.y});
				if (coords) {
					this._effectsLayer.launchExplosion(coords.col, coords.row, color);
				}
			}
		}

		// add to number of blocks cleared
		NJ.gameState.addBlocksCleared(comboLength);

		// add to score
		NJ.gameState.addScore(scoreDifference);

		// add moves made
		NJ.gameState.addMovesMade();

		this._numboHeaderLayer.setScoreValue(NJ.gameState.getScore());

	},

	killBlocksAfterDelay: function(blocks, delay) {
		var that = this;

		this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
			that.scoreBlocksMakeParticles(blocks, 0);
			for (var i = 0; i < blocks.length; ++i){
				that._numboController.killBlock(blocks[i]);
			}
			that._numboController._numboLevel.updateRowsAndColumns();

			that.relocateBlocks();
		})));
	},

	// spawns N blocks after a certain amount of time, then executes the callback (if given).
	// ensures that there will also be at least one move present on the board.
	// do accomplish this, we spawn (n-2) blocks. at this point, there are 3 cases:
	//	 	case 1: all blocks within t spaces of the frontier have the same value X. here, we must
	//			generate 2 more blocks that add up to X, and place them next to each-other
	//		case 2: not all blocks have the same value, but there still isn't an equation
	//			(eg, board is all 3's and 5's). here the strategy is simple. grab a random
	//			block A, and a random one of its neigbhoring blocks B.
	//			if the sum of their values is legal, use that.
	//			if the difference of their values is legal, use that.
	//			if neither, try a different block pair.
	// 			(note that b/c not all blocks have the same value, this will work eventually)
	//		case 3: there is a known hint, so we just spawn more random blocks
	//			(this is the most common & easiest case by far!)
	spawnBlocksAfterDelay: function(count, delay, callback){
		var that = this;
		this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
			that.spawnDropRandomBlocks(count-2);

			// case 1
			if (that._numboController.areAllBlocksTheSameValue()){
				colsAndVals = that._numboController.findLocationAndValueForTwoNewBlocks();
				if (colsAndVals) {
					that.spawnDropBlock(colsAndVals[0].col, colsAndVals[0].val);
					that.spawnDropBlock(colsAndVals[1].col, colsAndVals[1].val);
				}
				else {
					that.spawnDropRandomBlocks(2);
				}

			}
			else {
				that.spawnDropRandomBlock();

				// case 2
				if (that._numboController.findHint().length == 0) {
					var colAndVal = that._numboController.findLocationAndValueForNewBlock();
					that.spawnDropBlock (colAndVal.col, colAndVal.val);
				}

				// case 3
				else {
					that.spawnDropRandomBlock();
				}
			}


			that.relocateBlocks();
			if (callback) {
				callback();
			}
		})));
	},



	relocateBlocks: function (){
		// Gaps may be created; shift all affected blocks down.
		var blocks = this._numboController.getBlocksList();
		for (var i = 0; i < blocks.length; ++i){
			this.moveBlockIntoPlace(blocks[i], true);
		}
	},

/////////////
// Drawing //
/////////////

	// redraw lines indicating selected blocks
	redrawSelectedLines: function(selectedBlocks) {
		this._selectedLinesNode.clear();

		// TODO: again drawing the dummy rect
		this._selectedLinesNode.drawRect(cc.p(this._levelBounds.x, this._levelBounds.y), cc.p(this._levelBounds.x, this._levelBounds.y), cc.color(255, 255, 255, 0), 0, cc.color(255, 255, 255, 0));

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

			color = NJ.getColor(currSum - 1);

			this._selectedLinesNode.drawSegment(this._convertLevelCoordsToPoint(first.col, first.row),
				this._convertLevelCoordsToPoint(second.col, second.row), 3, color);
		}
	},

	/////////////
	// Virtual //
	/////////////

	isInDanger: function() {
		return true;
	},

	/////////////
	// Helpers //
	/////////////

	_isPointWithinCoordsDistanceThreshold: function(point, col, row) {
		// return only if coordinates in certain radius of the block.
		var radius = 0.5 *  this._blockSize.width;

		var cellCenter = cc.p(this._levelBounds.x + (col + 0.5) *  this._levelCellSize.width,
			this._levelBounds.y + (row + 0.5) *  this._levelCellSize.height);

		var diff = cc.pSub(point, cellCenter);
		var distSq = cc.pDot(diff, diff);

		// check distance
		return distSq <= radius * radius;
	},

	// Attempt to convert point to location on grid.
	_convertPointToLevelCoords: function(point) {
		if (point.x >= this._levelBounds.x && point.x < this._levelBounds.x + this._levelBounds.width &&
			point.y >= this._levelBounds.y && point.y < this._levelBounds.y + this._levelBounds.height) {

			var col = Math.floor((point.x - this._levelBounds.x) /  this._levelCellSize.width);
			var row = Math.floor((point.y - this._levelBounds.y) /  this._levelCellSize.height);

			return { col: col, row: row };
		}

		return null;
	},

	// attempt to convert level coords to point
	_convertLevelCoordsToPoint: function(col, row) {
		return cc.p(this._levelBounds.x + (col + 0.5) *  this._levelCellSize.width,
			this._levelBounds.y + (row + 0.5) *  this._levelCellSize.height);
	}
});