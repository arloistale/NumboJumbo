/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = cc.Layer.extend({
    // UI Data
    _numboHeader: null,
    _settingsMenuLayer: null,
    _gameOverMenuLayer: null,

    // Sprite Data
    _backgroundSprite: null,

    // Level Data
    _numboLevel: null,
    _selectedBlocks: [],

    _levelBounds: null,
    _levelCellSize: null,

    // Scoring Data
    _comboManager: null,
    _difficultyManager: null,

////////////////////
// Initialization //
////////////////////

    ctor: function () {
        this._super();

        this.initBackground();
        this.initInput();
        this.initUI();
        this.initLevel();
        this.initComboManager();
        this.initDifficultyManager();
        this.initAudio();

        // begin scheduling block drops
        this.schedule(this.spawnDropRandomBlock, this._difficultyManager.getSpawnTime());
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
                        return;

                    event.getCurrentTarget().onTouchBegan(event.getLocation());
                },
                onMouseMove: function (event) {
                    if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
                        return;

                    event.getCurrentTarget().onTouchMoved(event.getLocation());
                },
                onMouseUp: function (event) {
                    if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
                        return;

                    event.getCurrentTarget().onTouchEnded(event.getLocation());
                }
            }, this);
        }

        if (cc.sys.capabilities.hasOwnProperty('touches')) {
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event) {
                    event.getCurrentTarget().onTouchBegan(event.getLocation());
                },
                onTouchMoved: function(touch, event) {
                    event.getCurrentTarget().onTouchMoved(event.getLocation());
                },
                onTouchEnded: function(touch, event) {
                    event.getCurrentTarget().onTouchEnded(event.getLocation());
                }
            }, this);
        }
    },

    // initialize UI elements into the scene
    initUI: function() {

        var that = this;

        this._numboHeader = new NumboHeaderLayer();
        this._numboHeader.setOnPauseCallback(function() {
            that.onPause();
        });
        this.addChild(this._numboHeader, 999);
    },

    // initialize the empty level into the scene
    initLevel: function() {
        this._numboLevel = new NumboLevel();
        this._numboLevel.init();

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

    // initialize combo manager into the scene
    initComboManager: function() {
        this._comboManager = new ComboManager();
        this._comboManager.init();
    },

	// initialize difficulty manager into the scene
	initDifficultyManager: function() {
		this._difficultyManager = new DifficultyManager();
		this._difficultyManager.init();
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

	// make a block start falling into place
	// NOTE: only call directly to drop a shifted block (this function is not for to spawn blocks, use spawnDropRandomBlock instead)
	dropBlock: function(block) {
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

	dropBlocksInColumn: function(col) {
		cc.assert(0 <= col && col < NJ.NUM_COLS, "Invalid coords");
		for (row in this._numboLevel.blocks[col])
			this.dropBlock(this._numboLevel.blocks[col][row]);
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

	    var block = this._numboLevel.dropRandomBlock(this._difficultyManager);
	    var blockX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);
	    block.setPosition(blockX, cc.winSize.height + this._levelCellSize.height / 2);
	    this.addChild(block);
		if(this._difficultyManager.recordDrop()) {
			this.unschedule(this.spawnDropRandomBlock);
			this.schedule(this.spawnDropRandomBlock, this._difficultyManager.getSpawnTime());
		}

		this.dropBlock(block);
	},

/////////////////////
// Block Selection //
/////////////////////

	// select a block, giving it a highlight
	selectBlock: function(col, row) {
		cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

		var block = this._numboLevel.getBlock(col, row);

		if(!block)
			return;

		// TODO: possible optimization
		if(!block.bHasDropped || this._selectedBlocks.indexOf(block) >= 0)
			return;

		// we make this block green, make the last selected block red
		if(this._selectedBlocks.length > 0) {
			var lastBlock = this._selectedBlocks[this._selectedBlocks.length - 1];
			lastBlock.highlight(cc.color(255, 0, 0, 255));
		}

		block.highlight(cc.color(0, 255, 0, 255));
		this._selectedBlocks.push(block);

		if(NJ.settings.sounds)
			cc.audioEngine.playEffect(res.successTrack);
	},

	// deselect a single block, removing its highlight
	deselectBlock: function(col, row) {
		cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

		var block = this._numboLevel.getBlock(col, row);

		if(!block || !block.bHasDropped)
			return;

		block.clearHighlight();

		var index = this._selectedBlocks.indexOf(block);
		if(index >= 0)
			this._selectedBlocks.splice(index, 1);
	},

	// deselect all currently selected blocks, removing their highlights
	deselectAllBlocks: function() {
		for (var i = 0; i < this._selectedBlocks.length; ++i)
			this._selectedBlocks[i].clearHighlight();

		this._selectedBlocks = [];
	},

	// activate currently selected blocks
	// awards player score depending on blocks selected
	// shifts all blocks down to remove gaps and drops them accordingly
	activateSelectedBlocks: function() {
		if(this.isSelectedClearable()) {
			var selectedBlockCount = this._selectedBlocks.length;

            NJ.analytics.blocksCleared += selectedBlockCount;
            if(selectedBlockCount > NJ.analytics.maxComboLength)
                NJ.analytics.maxComboLength = selectedBlockCount;

			var lastCol = this._selectedBlocks[selectedBlockCount - 1].col;

			this._comboManager.addScoreForCombo(selectedBlockCount);
            this._difficultyManager.recordScore(this._selectedBlocks);
            console.log(this._difficultyManager.getBlocksToLevel());
			this._numboHeader.setScoreValue(this._comboManager.getScore());

			// new boolean array [0, 1, ..., NUM_COLS - 1]; all = false:
			affectedColumns = Array.apply(null, new Array(NJ.NUM_COLS)).map(function() { return false; });
			// set each affected column to true:
			for (var block in this._selectedBlocks)
			    affectedColumns[this._selectedBlocks[block].col] = true;
			// remove any affected block sprite objects:
			for(var i = 0; i < this._selectedBlocks.length; ++i)
			    this._numboLevel.killBlock(this._selectedBlocks[i]);
			// shift blocks in affected columns down:
			for (var col in affectedColumns) {
				if (affectedColumns[col]) {
					this._numboLevel.shiftBlocksInColumn(col);
				}
				this.dropBlocksInColumn(col);
			}

			this._numboLevel.collapseColumnsToward(lastCol);
			this.shiftAllBlocks();
		}

		this.deselectAllBlocks();
	},

	// calls dropBlock on every block sprite, which moves each sprite
	// to its correct (x,y) coordinates.
	// useful blocks have been removed and need to fall or collapse.
	shiftAllBlocks: function(){
		this._numboLevel.updateBlockRowsAndCols();
		for (var i = 0; i < NJ.NUM_COLS; ++i){
			for (var j = 0; j < this._numboLevel.blocks[i].length; ++j){
				this.dropBlock(this._numboLevel.blocks[i][j]);
			}
		}
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

        // save stats
        NJ.analytics.sessionLength = this._difficultyManager.timeElapsed;
        NJ.analytics.blocksPerMinute = NJ.analytics.blocksCleared / NJ.analytics.sessionLength * 60;

        NJ.analytics.send();

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
        this._settingsMenuLayer = new SettingsMenuLayer();
        this._settingsMenuLayer.setOnCloseCallback(function() {
            that.onResume();
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

        if(touchCoords)
            this.selectBlock(touchCoords.col, touchCoords.row);
    },

    // on touch moved, selects additional blocks as the touch is held and moved
    onTouchMoved: function(touchPosition) {
        var touchCoords = this.convertPointToLevelCoords(touchPosition);

        if(touchCoords)
            this.selectBlock(touchCoords.col, touchCoords.row);
    },

    // on touch ended, activates all selected blocks once touch is released
    onTouchEnded: function(touchPosition) {
        this.activateSelectedBlocks();
    },

/////////////
// Helpers //
/////////////

    // check if game over state has been reached (level has filled up)
    isGameOver: function() {
        return this._numboLevel.isFull();
    },

	// checks if the current selected blocks can be activated (their equation is valid)
	isSelectedClearable: function() {
		if(!this._selectedBlocks.length)
			return false;

		var selectedBlocksLength = this._selectedBlocks.length;

		// all blocks must be sequentially adjacent

		var sum = 0;

		for(var i = 0; i < selectedBlocksLength - 1; ++i) {
			if(!this._numboLevel.isAdjBlocks(this._selectedBlocks[i], this._selectedBlocks[i + 1]))
				return false;

			sum += this._selectedBlocks[i].val;
		}

		return sum == this._selectedBlocks[selectedBlocksLength - 1].val;
	},

	// attempt to convert point to location on grid
	convertPointToLevelCoords: function(point) {
		if (point.x >= this._levelBounds.x && point.x < this._levelBounds.x + this._levelBounds.width &&
			point.y >= this._levelBounds.y && point.y < this._levelBounds.y + this._levelBounds.height) {

			var col = Math.floor((point.x - this._levelBounds.x) / this._levelCellSize.width);
			var row = Math.floor((point.y - this._levelBounds.y) / this._levelCellSize.height);

			// return only if coordinates in certain radius of the block.
			var radius = 0.65;
			if(Math.abs(point.x - this._levelBounds.x - (this._levelCellSize.width/2 + (col * this._levelCellSize.width))) < radius*this._levelCellSize.width/2 &&
				point.y - this._levelBounds.y - (this._levelCellSize.height/2 + (row * this._levelCellSize.height)) < radius*this._levelCellSize.height/2)
				return {col: col, row: row};

			return null;
		}

		return null;
	}
});