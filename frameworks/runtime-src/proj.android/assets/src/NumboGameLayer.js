/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = cc.Layer.extend({
	// UI Data
	_numboHeaderLayer: null,
	_settingsMenuLayer: null,
	_gameOverMenuLayer: null,

	// Sprite Data
	_backgroundSprite: null,

	// Level Data
	_levelBounds: null,
	_levelCellSize: null,

	// Controller Data
	_numboController: null,

	_distributionsData: null,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function () {
	    this._super();

	    NJ.resetStats();

	    // init time
	    NJ.stats.startTime = Date.now();
	    
	    this.initBackground();
	    this.initInput();
	    this.initUI();
	    this.initLevel();
	    this.initNumboController();
	    this.initDistributions();
	    this.initAudio();


	    this._numboHeaderLayer.setScoreValue(NJ.stats.score, this._numboController.getBlocksToLevelString(), NJ.stats.level );

	    // begin scheduling block drops
	    this.schedule(this.spawnDropRandomBlock, 0.1, 20);
	    this.schedule(this.scheduleSpawn, 0.1*20);
	},

	// initialize background for game
	initBackground: function() {
	    var size = cc.winSize;

	    // add the background
	    // TODO: Move this to a separate layer to be more organized
	    this._backgroundSprite = new cc.Sprite(res.backgroundImage);
	    this._backgroundSprite.attr({
		    x: size.width / 2,
			y: size.height / 2,
			anchorX: 0.5,
			anchorY: 0.5,
			scale: 1,
			rotation: 0
			});
	    this.addChild(this._backgroundSprite, 0);
	},

	// initialize input for the game
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

	// initialize UI elements into the scene
	initUI: function() {

	    var that = this;

	    this._numboHeaderLayer = new NumboHeaderLayer();
	    this._numboHeaderLayer.setOnPauseCallback(function() {
		    that.onPause();
		});
	    this.addChild(this._numboHeaderLayer, 999);
	},

	// initialize the empty level into the scene
	initLevel: function() {
	    var size = cc.winSize;
	    var refDim = Math.min(size.width, size.height);
	    var levelPadding = refDim * 0.02;
	    var levelDims = cc.size(refDim - levelPadding * 2, refDim - levelPadding * 2);
	    var levelOrigin = cc.p(size.width / 2 - levelDims.width / 2, size.height / 2 - levelDims.height / 2);
	    var cellPadding = refDim * 0.02;
	    this._levelCellSize = cc.size(levelDims.width / NJ.NUM_COLS, levelDims.height / NJ.NUM_ROWS);
	    this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

	    var levelNode = cc.DrawNode.create();
	    levelNode.drawRect(levelOrigin, cc.p(levelOrigin.x + levelDims.width, levelOrigin.y + levelDims.height), cc.color.white);
	    this.addChild(levelNode);
	},

	initDistributions: function() {
	    this._distributionsData = cc.loader.getRes(res.jumboDistributionsJSON);
	},

	// initialize numbo controller (formerly the difficulty manager)
	// into the scene
	initNumboController: function() {
	    this._numboController = new NumboController();
	    this._numboController.init();

	    this._numboController.setDistribution(cc.loader.getRes(res.jumboDistributionsJSON)["one-mania"]);
	},

	// initialize game audio
	initAudio: function() {
	    if(!NJ.settings.music)
		return;

	    // start the music
	    cc.audioEngine.playMusic(res.backgroundTrack, true);
	},

	////////////////////
	// Block Spawning //
	////////////////////

	// move scene block sprite into place
	moveBlockSprite: function(block) {
	    var blockTargetY = this._levelBounds.y + this._levelCellSize.height * (block.row + 0.5);
	    var blockTargetX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);

	    var duration = 0.5;
	    var moveAction = cc.MoveTo.create(duration, cc.p(blockTargetX, blockTargetY));
	    var dropAction = cc.CallFunc.create(function() {
		    block.bHasDropped = true;
		});
	    block.stopAllActions();
	    block.runAction(cc.sequence(moveAction, dropAction));
	},

	scheduleSpawn: function() {
	    this.spawnDropRandomBlock();
	    this.unschedule(this.scheduleSpawn);
	    this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());
	},

	// spawns a block at a random column in the level
	// drops the spawned block into place
	// NOTE: This is the function you should be using to put new blocks into the game
	// TODO: Improve structure (don't check game over state here for improved separation of concerns)
	spawnDropRandomBlock: function() {
	    if(this.isGameOver()) {
		this.onGameOver();

		return;
	    }
	    
	    var block = this._numboController.dropRandomBlock();
	    var blockX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);
	    block.setPosition(blockX, cc.winSize.height + this._levelCellSize.height / 2);
	    this.addChild(block);

	    this.moveBlockSprite(block);
	},

	///////////////////////
	// Game State Events //
	///////////////////////

	onGameOver: function() {
	    var that = this;

	    cc.audioEngine.stopMusic();
	    cc.audioEngine.stopAllEffects();
	    cc.director.pause();
	    cc.eventManager.pauseTarget(this, true);

	    this._gameOverMenuLayer = new GameOverMenuLayer();
	    this._gameOverMenuLayer.setOnMenuCallback(function() {
		    that.onMenu();
		});
	    this.addChild(this._gameOverMenuLayer, 999);
	},

	///////////////
	// UI Events //
	///////////////

	// on pause, opens up the settings menu
	onPause: function() {
	    var that = this;
        
	    cc.director.pause();
	    cc.eventManager.pauseTarget(this, true);
	    this._settingsMenuLayer = new SettingsMenuLayer(true);
	    this._settingsMenuLayer.setOnCloseCallback(function() {
		    that.onResume();
		});
		this._settingsMenuLayer.setOnMenuCallback(function() {
			that.onMenu();
		});
	    this.addChild(this._settingsMenuLayer, 999);
	},

	// on closing previously opened settings menu we resume
	onResume: function() {
	    cc.director.resume();
	    cc.eventManager.resumeTarget(this, true);
	    this.removeChild(this._settingsMenuLayer);

	    // play music again if music settings turned on
	    if(NJ.settings.music)
		cc.audioEngine.playMusic(res.backgroundTrack);
	},

	// on game over when player chooses to go to menu we return to menu
	onMenu: function() {
		// first send the analytics for the current game session
		NJ.sendAnalytics();

	    cc.director.resume();
	    cc.eventManager.resumeTarget(this, true);
	    this.removeChild(this._gameOverMenuLayer);

	    //load resources
	    cc.LoaderScene.preload(g_menu, function () {
		    cc.audioEngine.stopMusic();
		    cc.audioEngine.stopAllEffects();
		    var scene = new cc.Scene();
		    scene.addChild(new NumboMenuLayer());
		    cc.director.runScene(new cc.TransitionFade(0.5, scene));
		}, this);
	},

	//////////////////
	// Touch Events //
	//////////////////

	// on touch began, tries to find level coordinates for the touch and selects block accordingly
	onTouchBegan: function(touchPosition) {
	    var touchCoords = this.convertPointToLevelCoords(touchPosition);

	    if (touchCoords)
		this._numboController.selectBlock(touchCoords.col, touchCoords.row);
	},

	// on touch moved, selects additional blocks as the touch is held and moved
	onTouchMoved: function(touchPosition) {
	    var touchCoords = this.convertPointToLevelCoords(touchPosition);

	    if (touchCoords)
		this._numboController.selectBlock(touchCoords.col, touchCoords.row);
	},

	// on touch ended, activates all selected blocks once touch is released
	onTouchEnded: function(touchPosition) {
	    this._numboController.activateSelectedBlocks();

	    for (var col = 0; col < NJ.NUM_COLS; ++col) {
		for (var row = 0; row < this._numboController.getColLength(col); ++row){
		    this.moveBlockSprite(this._numboController.getBlock(col, row));
		}
	    }

	    this._numboHeaderLayer.setScoreValue(NJ.stats.score, this._numboController.getBlocksToLevelString(), NJ.stats.level );
	},

	/////////////
	// Helpers //
	/////////////

	// check if game over state has been reached (level has filled up)
	isGameOver: function() {
	    return this._numboController.isGameOver();
	},

	// attempt to convert point to location on grid
	convertPointToLevelCoords: function(point) {
	    if (point.x >= this._levelBounds.x && point.x < this._levelBounds.x + this._levelBounds.width &&
		point.y >= this._levelBounds.y && point.y < this._levelBounds.y + this._levelBounds.height) {

		var col = Math.floor((point.x - this._levelBounds.x) / this._levelCellSize.width);
		var row = Math.floor((point.y - this._levelBounds.y) / this._levelCellSize.height);

		// return only if coordinates in certain radius of the block.
		var radius = 0.65;
		if (Math.abs(point.x - this._levelBounds.x - (this._levelCellSize.width/2 + (col * this._levelCellSize.width))) < radius*this._levelCellSize.width/2 &&
		    point.y - this._levelBounds.y - (this._levelCellSize.height/2 + (row * this._levelCellSize.height)) < radius*this._levelCellSize.height/2) {

		    return {col: col, row: row};
		}
	    }

	    return null;
	}
    });
