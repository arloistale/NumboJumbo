/**
 * Created by jonathanlu on 1/18/16.
 */

var NumboGameLayer = cc.Layer.extend({
    // UI Data
    _numboHeader: null,

    // Sprite Data
    _backgroundSprite: null,

    // Level Data
    _numboLevel: null,
    _selectedBlocks: [],

    _levelBounds: null,
    _levelCellSize: null,

    // Scoring Data
    _comboManager: null,

    // Difficulty Data
    _difficultyManager: null,

    ctor: function () {
        this._super();

        this.initBackground();
        this.initInput();
        this.initUI();
        this.initLevel();
        this.initComboManager();
        this.initAudio();

        return true;
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

        // start the music
        cc.audioEngine.playMusic(res.backgroundTrack);

        this.initInput();
        this.initUI();
        this.initLevel();
        this.initComboManager();
        this.initDifficultyManager();

        // begin scheduling block drops
        this.schedule(this.spawnDropRandomBlock, this._difficultyManager.getSpawnTime(), "spawn-block");

        return true;
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
        this._numboHeader = new NumboHeader();
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

    // make a block start falling into place
    // NOTE: only call directly to drop a shifted block (this function is not for to spawn blocks, use spawnDropRandomBlock instead)
    dropBlock: function(block) {
        var blockTargetY = this._levelBounds.y + this._levelCellSize.height * (block.row + 0.5);

        var duration = 0.5;
        var moveAction = cc.MoveTo.create(duration, cc.p(block.x, blockTargetY));
        var dropAction = cc.CallFunc.create(function() {
            block.bHasDropped = true;
        });
        block.stopAllActions();
        block.runAction(cc.sequence(moveAction, dropAction));
    },

    // spawns a block at a random column in the level
    // drops the spawned block into place
    // NOTE: This is the function you should be using to put new blocks into the game
    spawnDropRandomBlock: function() {
        if(this._numboLevel.isFull())
            return;

        var block = this._numboLevel.dropRandomBlock(this._difficultyManager);
        var blockX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);
        block.setPosition(blockX, cc.winSize.height + this._levelCellSize.height / 2);
        this.addChild(block);

        this.dropBlock(block);
        // Check for difficulty
        if(this._difficultyManager.recordDrop()) {
            this.unschedule(this.spawnDropRandomBlock);
            this.schedule(this.spawnDropRandomBlock, this._difficultyManager.getSpawnTime());
        }
    },

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

            this._comboManager.addScoreForCombo(selectedBlockCount);
            this._difficultyManager.recordScore(this._selectedBlocks);
            this._numboHeader.writePrimaryValue(this._comboManager.getScore(), this._difficultyManager.getBlocksToLevel());

            var i = 0;
            for(; i < this._selectedBlocks.length; ++i)
                this._numboLevel.killBlock(this._selectedBlocks[i]);


            var shiftedBlocks = this._numboLevel.shiftBlocks();
            for(i = 0; i < shiftedBlocks.length; ++i)
                this.dropBlock(shiftedBlocks[i]);
        }

        this.deselectAllBlocks();
    },

    // touch events

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

var MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainGameLayer();
        this.addChild(layer);
    }
});