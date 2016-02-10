/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = cc.Layer.extend({
	// UI Data
	_numboHeaderLayer: null,
	_settingsMenuLayer: null,
	_gameOverMenuLayer: null,

	// Sprite Data
	_backgroundSpriteBottom: null,
	_backgroundSpriteMiddle: null,
	_backgroundSpriteMiddleTwo: null,
	_backgroundSpriteTop: null,
	_backgroundSpriteTopTwo: null,

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
        
	    NJ.resetStats();

	    // init time
	    NJ.stats.startTime = Date.now();
	    
	    this.initBackground();
        this.initNumboController();
	    this.initInput();
	    this.initUI();
	    this.initLevel();
	    this.initAudio();
                                     
	    // begin scheduling block drops
	    this.schedule(this.spawnDropRandomBlock, 0.1, 20);
	    this.schedule(this.scheduleSpawn, 0.1*20);
	},

	// initialize background for game
	initBackground: function() {
	    var size = cc.winSize;

	    // add the background
	    // TODO: Move this to a separate layer to be more organized
	    this._backgroundSpriteBottom = new cc.Sprite(res.backBottom);
	    this._backgroundSpriteBottom.attr({
		    x: size.width / 2,
			y: size.height / 2,
			anchorX: 0.5,
			anchorY: 0.5,
			scale: 1,
			rotation: 0
			});
	    this.addChild(this._backgroundSpriteBottom, 0);

		this._backgroundSpriteMiddle = new cc.Sprite(res.backMiddle);
		this._backgroundSpriteMiddle.attr({
			x: size.width / 2,
			y: size.height,
			anchorX: 0.5,
			anchorY: 1,
			scale: 1,
			rotation: 0
		});
		this.addChild(this._backgroundSpriteMiddle, 0);

		this._backgroundSpriteMiddleTwo = new cc.Sprite(res.backMiddle);
		this._backgroundSpriteMiddleTwo.attr({
			x: size.width / 2,
			y: size.height * 2,
			anchorX: 0.5,
			anchorY: 1,
			scale: 1,
			rotation: 0
		});

		this.addChild(this._backgroundSpriteMiddleTwo, 0);

		this._backgroundSpriteTop = new cc.Sprite(res.backTop);
		this._backgroundSpriteTop.attr({
			x: size.width / 2,
			y: size.height,
			anchorX: 0.5,
			anchorY: 1,
			scale: 1,
			rotation: 0
		});
		this.addChild(this._backgroundSpriteTop, 0);

		this._backgroundSpriteTopTwo = new cc.Sprite(res.backTop);
		this._backgroundSpriteTopTwo.attr({
			x: size.width / 2,
			y: size.height * 2,
			anchorX: 0.5,
			anchorY: 1,
			scale: 1,
			rotation: 0
		});
		this.addChild(this._backgroundSpriteTopTwo, 0);

		this.schedule(this.moveBackground,.01);

	},

	moveBackground: function() {
		this._backgroundSpriteMiddle.y += 1;
		this._backgroundSpriteMiddleTwo.y += 1;
		this._backgroundSpriteTop.y += 2;
		this._backgroundSpriteTopTwo.y += 2;

		if(this._backgroundSpriteMiddle.y > this._backgroundSpriteMiddleTwo.y) {
			if(this._backgroundSpriteMiddleTwo.y > cc.winSize.height)
				this._backgroundSpriteMiddle.y = this._backgroundSpriteMiddleTwo.y - this._backgroundSpriteMiddle.height;
		}
		else {
			if(this._backgroundSpriteMiddle.y > cc.winSize.height)
				this._backgroundSpriteMiddleTwo.y = this._backgroundSpriteMiddle.y - this._backgroundSpriteMiddleTwo.height;
		}

		if(this._backgroundSpriteTop.y > this._backgroundSpriteTopTwo.y) {
			if(this._backgroundSpriteTopTwo.y > cc.winSize.height)
				this._backgroundSpriteTop.y = this._backgroundSpriteTopTwo.y - this._backgroundSpriteTop.height;
		}
		else {
			if(this._backgroundSpriteTop.y > cc.winSize.height)
				this._backgroundSpriteTopTwo.y = this._backgroundSpriteTop.y - this._backgroundSpriteTopTwo.height;
		}

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
                                     
        this._numboHeaderLayer.setScoreValue(NJ.stats.score, this._numboController.getBlocksToLevelString(), NJ.stats.level );

	},

	// initialize the empty level into the scene
	initLevel: function() {
	    var size = cc.winSize;
	    var refDim = Math.min(size.width, size.height, 900);
	    var levelPadding = refDim * 0.02;
	    var levelDims = cc.size(refDim - levelPadding * 2, refDim - levelPadding * 2);
	    var levelOrigin = cc.p(size.width / 2 - levelDims.width / 2, size.height / 2 - levelDims.height / 2);
	    var cellPadding = refDim * 0.02;
	    this._levelCellSize = cc.size(levelDims.width / NJ.NUM_COLS, levelDims.height / NJ.NUM_ROWS);
	    this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

	    var levelNode = cc.DrawNode.create();
	    levelNode.drawRect(levelOrigin, cc.p(levelOrigin.x + levelDims.width, levelOrigin.y + levelDims.height), cc.color.white, 6, cc.color(173, 216, 230, 0.4*255));
	    this.addChild(levelNode);
	},

	// initialize numbo controller (formerly the difficulty manager)
	// into the scene
	initNumboController: function() {
	    this._numboController = new NumboController();
	    this._numboController.init();
	},

	// initialize game audio
	initAudio: function() {
	    if(!NJ.settings.music)
		return;

	    // start the music
	    cc.audioEngine.playMusic(res.backgroundTrack, true);
	},
                                     
 /////////////////////////////
 // GAME STATE MANIPULATION //
 /////////////////////////////

	// pauses the game, halting all actions and schedulers
	pauseGame: function() {
        cc.eventManager.pauseTarget(this, true);
                                   
        this.pause();

        var children = this.getChildren();

        for(var i = 0; i < children.length; ++i) {
            if(children[i].getTag() == NJ.tags.BLOCK)
                children[i].pause();
        }
	},

	// resumes all actions and schedulers
	resumeGame: function() {
        cc.eventManager.resumeTarget(this, true);

        this.resume();

        var children = this.getChildren();

        for(var i = 0; i < children.length; ++i) {
            if(children[i].getTag() == NJ.tags.BLOCK)
                children[i].resume();
        }
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
        // TODO: Order matters when scheduling, must schedule before spawning WHY?
        // PROBABLY because we pause, but then it schedules another one after
        this.unschedule(this.scheduleSpawn);
        this.schedule(this.scheduleSpawn, this._numboController.getSpawnTime());
                                     
	    this.spawnDropRandomBlock();
	},

	// spawns a block at a random column in the level
	// drops the spawned block into place
	// NOTE: This is the function you should be using to put new blocks into the game
	// TODO: Improve structure (don't check game over state here for improved separation of concerns)
	spawnDropRandomBlock: function() {
	    if(this._numboController.isGameOver()) {
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

	// on pause, pauses game and opens up the settings menu
	onPause: function() {
	    var that = this;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.tongue_click, false);

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

	// on closing previously opened settings menu we resume
	onResume: function() {
	    this.resumeGame();

	    this.removeChild(this._settingsMenuLayer);

	    // play music again if music settings turned on
	    if(NJ.settings.music)
		    cc.audioEngine.playMusic(res.backgroundTrack);
	},

	// on game over when player chooses to go to menu we return to menu
	onMenu: function() {
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
		// first activate any selected blocks
	    this._numboController.activateSelectedBlocks();

		// gaps may be created; shift all affected blocks down
	    for (var col = 0; col < NJ.NUM_COLS; ++col) {
			for (var row = 0; row < this._numboController.getColLength(col); ++row){
				this.moveBlockSprite(this._numboController.getBlock(col, row));
			}
	    }

		// level up if needed
		if(this._numboController.levelUp()) {
			this._numboHeaderLayer.giveFeedback("FUCK YEAH");
		}

	    this._numboHeaderLayer.setScoreValue(NJ.stats.score, this._numboController.getBlocksToLevelString(), NJ.stats.level );
	},

/////////////
// Helpers //
/////////////

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
