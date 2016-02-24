/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = cc.Layer.extend({
	// UI Data
	_numboHeaderLayer: null,
	_settingsMenuLayer: null,
	_gameOverMenuLayer: null,
	_feedbackLayer: null,

	// Geometry Data
	_selectedLinesNode: null,

	// Sprite Data
	_backgroundLayer: null,

	// Level Data
	_levelBounds: null,
	_levelCellSize: null,

	// Controller Data
	_numboController: null,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function () {
	    this._super();

        this.setTag(NJ.tags.PAUSABLE);

		// Init stats data.
        NJ.resetGameState();
	    NJ.resetStats();

	    NJ.stats.startTime = Date.now();

		// Init game logic
	    this.initNumboController();
	    this.initInput();

		// Init game visuals and audio
	    this.initUI();
		this.initGeometry();
	    this.initAudio();

		this.initPowerups();
        this.updateMultiplier();
                                     
	    // Begin scheduling block drops.
	    this.schedule(this.spawnDropRandomBlock, 0.1, 20);
	    this.schedule(this.scheduleSpawn, 0.1*20);
	},

	// initialize the powerup mode variable
	initPowerups: function() {
		if (NJ.gameState.currentJumboId == "powerup-mode")
			NJ.gameState.powerupMode = true;
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
		this.addChild(this._backgroundLayer);

        // header
	    this._numboHeaderLayer = new NumboHeaderLayer();
	    this._numboHeaderLayer.setOnPauseCallback(function() {
		    that.onPause();
		});
	    this.addChild(this._numboHeaderLayer, 999);
	    this._numboHeaderLayer.setScoreValue(NJ.stats.score, NJ.getBlocksLeftForLevelUp(), NJ.stats.level);

        // feedback overlay
	    this._feedbackLayer = new FeedbackLayer();
	    this.addChild(this._feedbackLayer, 800);

		this._feedbackLayer.launchFallingBanner({
			title: "Level " + NJ.stats.level
		});
	},

	// Initialize dimensions and geometry
	initGeometry: function() {
		var origin = cc.director.getVisibleOrigin();
		var size = cc.director.getVisibleSize();
		var headerHeight = this._numboHeaderLayer.getContentSize().height;
		var playableSize = cc.size(size.width, size.height - headerHeight);
		var refDim = Math.min(playableSize.width, playableSize.height);

		var levelPadding = refDim * 0.02;
		var levelDims = cc.size(refDim - levelPadding * 2, refDim - levelPadding * 2);
		var levelOrigin = cc.p(origin.x + playableSize.width / 2 - levelDims.width / 2, origin.y + playableSize.height / 2 - levelDims.height / 2);
		this._levelCellSize = cc.size(levelDims.width / NJ.NUM_COLS, levelDims.height / NJ.NUM_ROWS);
		this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

		// initialize rectangle around level
		var levelNode = cc.DrawNode.create();
		levelNode.drawRect(cc.p(this._levelBounds.x, this._levelBounds.y), cc.p(this._levelBounds.x + this._levelBounds.width, this._levelBounds.y + this._levelBounds.height), cc.color.white, 2, cc.color(173, 216, 230, 0.4*255));
		this.addChild(levelNode);

		// initialize selection lines for selected nodes
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

	    //cc.audioEngine.setMusicVolume(0.5);

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
	moveBlockIntoPlace: function(block) {
	    var blockTargetY = this._levelBounds.y + this._levelCellSize.height * (block.row + 0.5);
	    var blockTargetX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);

	    var duration = 0.5;
	    var moveAction = cc.MoveTo.create(duration, cc.p(blockTargetX, blockTargetY));
	    var dropAction = cc.callFunc(function() {
		    // extra functionality for when block has finished dropping
		});
	    block.stopAllActions();
	    block.runAction(cc.sequence(moveAction, dropAction));
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
			this.onGameOver();
			return;
	    }

		if(!this._feedbackLayer.isDoomsayerLaunched()) {
			if(this._numboController.isInDanger())
				this._feedbackLayer.launchDoomsayer();
		} else {
			if(!this._numboController.isInDanger())
				this._feedbackLayer.clearDoomsayer();
		}

		var blockSize = cc.size(this._levelCellSize.width * 0.75, this._levelCellSize.height * 0.75);
	    var block = this._numboController.spawnDropRandomBlock(blockSize);
	    var blockX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);
	    block.setPosition(blockX, cc.director.getVisibleOrigin().y + cc.director.getVisibleSize().height + this._levelCellSize.height / 2);
	    this.addChild(block);

	    this.moveBlockIntoPlace(block);
	},

	spawnNBlocks: function(N){
		this.schedule(this.spawnDropRandomBlock, 0.1, N);
	},

	clearBlocks: function(){
		this._numboController._numboLevel.killAllBlocks();
	},

	///////////////////////
	//     Multiplier    //
	///////////////////////

	updateMultiplier: function() {
		this._numboHeaderLayer.setMultiplierValue(NJ.gameState.multiplier);
		if(NJ.gameState.multiplier > 1) {
			this.unschedule(this.checkMultiplier);
			this.schedule(this.checkMultiplier, 5, 1);
		}
	},

	checkMultiplier: function() {
		this._numboController.checkMultiplier();
		if(this._numboController.comboTimes.length == 0)
			this._numboHeaderLayer.setMultiplierValue(NJ.gameState.multiplier);
	},

	///////////////////////
	// Game State Events //
	///////////////////////

	// Halts game, switches to game over, sends data.
	onGameOver: function() {
	    // first send the analytics for the current game session
	    NJ.sendAnalytics();
                                     
	    var that = this;

	    cc.audioEngine.stopMusic();
                                     
	    this.pauseGame();

	    this._gameOverMenuLayer = new GameOverMenuLayer();
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

	    if(NJ.settings.sounds)
		    cc.audioEngine.playEffect(res.clickSound, false);

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
	    var touchCoords = this.convertPointToLevelCoords(touchPosition);

	    if (touchCoords) {
			var data = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

			if(data) {
				var currBlock = data.currBlock, lastBlock = data.lastBlock;
				if (currBlock) currBlock.highlight(cc.color(0, 255, 0, 255));
				if (lastBlock) lastBlock.highlight(cc.color(255, 0, 0, 255));

				this.redrawSelectedLines();
			}
		}
	},

	// On touch moved, selects additional blocks as the touch is held and moved.
	onTouchMoved: function(touchPosition) {
	    var touchCoords = this.convertPointToLevelCoords(touchPosition);

	    if (touchCoords) {
			var data = this._numboController.selectBlock(touchCoords.col, touchCoords.row);

			if(data) {
				var currBlock = data.currBlock, lastBlock = data.lastBlock;
				if (currBlock) currBlock.highlight(cc.color(0, 255, 0, 255));
				if (lastBlock) lastBlock.highlight(cc.color(255, 0, 0, 255));

				this.redrawSelectedLines();
			}
		}
	},

	// On touch ended, activates all selected blocks once touch is released.
	onTouchEnded: function(touchPosition) {
	    // Activate any selected blocks.
	    var data = this._numboController.activateSelectedBlocks();

		this.redrawSelectedLines();

        // make sure something actually happened
        if(data.cleared > 0) {
            // Gaps may be created; shift all affected blocks down.
            for (var col = 0; col < NJ.NUM_COLS; ++col) {
                for (var row = 0; row < this._numboController.getColLength(col); ++row)
                    this.moveBlockIntoPlace(this._numboController.getBlock(col, row));
            }

            var scoreDifference = NJ.addScoreForCombo(data.cleared, data.blockSum);

            // launch feedback for combo
            this._feedbackLayer.launchSnippet({
                title: "+" + scoreDifference,
                x: touchPosition.x,
                y: touchPosition.y,
                targetX: touchPosition.x,
                targetY: touchPosition.y + this._levelBounds.height / 6
            });

			if (data.powerupValue){
				var jumboString = NJ.jumbos.jumboMap[data.powerupValue];
				if (jumboString) {
					this._numboController.updateJumboTo(jumboString);
				}
			}

            // Level up with feedback if needed
            if (NJ.levelUpIfNeeded()) {

				if (NJ.gameState.randomJumbos || NJ.gameState.currentJumboId == "random-jumbos") {
					NJ.gameState.randomJumbos = true;
					this._numboController.updateRandomJumbo();
					this.clearBlocks();
					this.spawnNBlocks(20);
				}

				                // Check for Jumbo Swap
                if (NJ.gameState.currentJumboId == "multiple-progression")
                    this._numboController.updateMultipleProgression();

                // give feedback for leveling up

                // Display "LEVEL x"
                this._feedbackLayer.launchFallingBanner({
                    title: "Level " + NJ.stats.level
                });

                // Speed up background for a bit.
                this._backgroundLayer.initRush(180);
            } else if (data.cleared > 3) {
                this._feedbackLayer.launchFallingBanner();
            }

			// Update multiplier if needed.
			if (parseFloat(this._numboHeaderLayer.getMultiplier()) != NJ.gameState.multiplier)
				this.updateMultiplier();

            this._numboHeaderLayer.setScoreValue(NJ.stats.score, NJ.getBlocksLeftForLevelUp(), NJ.stats.level);
        }
	},

/////////////
// Drawing //
/////////////

	// redraw lines indicating selected blocks
	redrawSelectedLines: function() {
		this._selectedLinesNode.clear();

		var selectedBlocks = this._numboController.getSelectedBlocks();

		for(var i = 0; i < selectedBlocks.length - 1; i++) {
			this._selectedLinesNode.drawSegment(cc.p(selectedBlocks[i].x, selectedBlocks[i].y),
				cc.p(selectedBlocks[i + 1].x, selectedBlocks[i + 1].y), 2, cc.color.white);
		}
	},

/////////////
// Helpers //
/////////////

	// Attempt to convert point to location on grid.
	convertPointToLevelCoords: function(point) {
	    if (point.x >= this._levelBounds.x && point.x < this._levelBounds.x + this._levelBounds.width &&
		point.y >= this._levelBounds.y && point.y < this._levelBounds.y + this._levelBounds.height) {

            var col = Math.floor((point.x - this._levelBounds.x) / this._levelCellSize.width);
            var row = Math.floor((point.y - this._levelBounds.y) / this._levelCellSize.height);

            // return only if coordinates in certain radius of the block.
            var radius = 0.75 * this._levelCellSize.width / 2;

			var cellWidth = this._levelCellSize.width;
			var cellCenterX = this._levelBounds.x + (col + 0.5) * cellWidth;
			var cellHeight = this._levelCellSize.height;
			var cellCenterY = this._levelBounds.y + (row + 0.5) * cellHeight;

			var dist = (cellCenterX - point.x) * (cellCenterX - point.x) + (cellCenterY - point.y) * (cellCenterY - point.y);

			// check distance
            if (dist < radius * radius)
                return { col: col, row: row };
	    }

	    return null;
	}
});
