
var MainGameLayer = cc.Layer.extend({
    // UI Data
    _uiHeader: null,

    // Sprite Data
    _backgroundSprite: null,

    // Level Data
    _numboLevel: null,
    _selectedBlocks: null,

    _levelBounds: null,
    _levelCellSize: null,

    // Scoring Data
    _comboManager: null,

    ctor: function () {
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        
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

        this.initUI();
        this.initLevel();
        this.initComboManager();

        // begin scheduling block drops
        this.schedule(this.spawnDropRandomBlock, 1.5);

        return true;
    },

    // initialize UI elements into the scene
    initUI: function() {

    },

    // initialize the empty level into the scene
    initLevel: function() {
        this._numboLevel = new NumboLevel();
        this._numboLevel.init();

        var size = cc.winSize;
        var levelPadding = Math.min(size.width, size.height) * 0.1;
        var levelOrigin = cc.p(levelPadding, levelPadding);
        var levelDims = cc.size(size.width - levelPadding * 2, size.height - levelPadding * 2);
        this._levelCellSize = cc.size(levelDims.width / NJ.NUM_COLS, levelDims.height / NJ.NUM_ROWS);
        this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

        var levelNode = cc.DrawNode.create();
        levelNode.drawRect(levelOrigin, cc.p(levelOrigin.x + levelDims.width, levelOrigin.y + levelDims.height), cc.color.white);
        this.addChild(levelNode);
    },

    // initialize combo manager into the scene
    initComboManager: function() {

    },

    // make a block start falling into place
    // NOTE: only call directly to drop a shifted block (this function is not for to spawn blocks, use spawnDropRandomBlock instead)
    dropBlock: function(block) {
        var blockTargetY = this._levelBounds.y + this._levelCellSize.height * (block.row + 0.5);

        var duration = 0.5;
        var moveAction = cc.MoveTo.create(duration, cc.p(block.x, blockTargetY));
        var dropAction = cc.CallFunc.create(function() {
            block.bHasDropped = true;
            console.log(block.bHasDropped);
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

        var block = this._numboLevel.dropRandomBlock();
        var blockX = this._levelBounds.x + this._levelCellSize.width * (block.col + 0.5);
        block.setPosition(blockX, cc.winSize.height + this._levelCellSize.height / 2);
        this.addChild(block);

        dropBlock(block);
    },

    selectBlock: function() {

    },

    deselectBlock: function() {

    },

    deselectAllBlocks: function() {

    },

    activateSelectedBlocks: function() {

    },

    isSelectedClearable: function() {

    },

    convertPointToLevelCoords: function() {

    }
});

var MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainGameLayer();
        this.addChild(layer);
    }
});

