
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

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        /*
        var helloLabel = new cc.LabelTTF("Yep", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );*/
        
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

/*
        this._backgroundSprite.runAction(
            cc.sequence(
                cc.repeatForever(0),
                cc.rotateTo(2, 0)
            )
        );
*/
        // start the music
        cc.audioEngine.playMusic(res.backgroundTrack);

        this.initUI();
        this.initLevel();
        this.initComboManager();

        return true;
    },

    initUI: function() {

    },

    initLevel: function() {
        _numboLevel = new NumboLevel();
        _numboLevel.init();

        console.log("hi");

        var size = cc.winSize;
        var padding = 4;
        var levelOrigin = new cc.Vec2(levelPadding, levelPadding);
        var levelDims = new cc.Size(size.width - padding * 2, size.height - padding * 2);
        levelCellSize = new cc.Size(levelDims.width / NJ.NUM_COLS, levelDims.height / NJ.NUM_ROWS);
        levelBounds = new cc.Rect(levelOrigin, levelDims);

        var levelNode = cc.DrawNode.create();
        levelNode.drawRect(levelBounds.origin, levelBounds.origin + levelDims, C4B(255, 255, 255, 255));
        this.addChild(levelNode);
    },

    initComboManager: function() {

    },

    dropBlock: function() {

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

