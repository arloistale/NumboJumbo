/**
 * Created by jonathanlu on 1/19/16.
 */

var JumboMenuLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,

    // Callbacks Data
    onCloseCallback: null,
    
////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.init(cc.color(0, 0, 0, 255));

        this.initUI();
    },

    initUI: function() {
        var sp = new cc.Sprite(res.loading_png);
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = NJ.SCALE;
        this.addChild(sp, 0, 1);

        /*
        var cacheImage = cc.textureCache.addImage(res.buttonImage);
        var title = new cc.Sprite(cacheImage);
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height - 120;
        this.addChild(title);
*/

        var that = this;

        this._menu = new cc.Menu();

        var jumboTitleLabel = this.generateLabel("Pick your Jumbo...");
        this._menu.addChild(jumboTitleLabel);

        // get possible jumbos
        var jumboButton = null;
        var jumboName = "";
        var jumboDifficulty = "";
        for(var key in NJ.jumbos.data.jumbos) {
            jumboName = NJ.jumbos.data.jumbos[key].name;
            jumboDifficulty = NJ.jumbos.data.jumbos[key].difficulty;

            // here we create a callback for each button and bind the associated jumbo id to the callback
            jumboButton = this.generateJumboButton(jumboName, jumboDifficulty, (function(jumboId) {
                return function() { that.onChoose(jumboId) };
            })(key));

            this._menu.addChild(jumboButton);
        }

        var backButton = this.generateTitleButton("Back", function () {
            that.onBack();
        });

        this._menu.addChild(backButton);

        this._menu.alignItemsVerticallyWithPadding(10);

        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onChoose: function(jumboId) {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        NJ.chooseJumbo(jumboId);

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new cc.Scene();
            scene.addChild(new NumboGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    },

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    },
    
//////////////////
// UI Callbacks //
//////////////////
    
    setOnCloseCallback: function(callback) {
        this.onCloseCallback = callback;
    },

////////////////
// UI Helpers //
////////////////

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(46);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateJumboButton: function(title, difficulty, callback) {
        var label = new cc.LabelTTF(title + "  (" + difficulty + ")", b_getFontName(res.markerFont), 30);
        label.setColor(cc.color(255, 255, 255, 255));

        return new cc.MenuItemLabel(label, callback);
    },

    generateTitleButton: function(title, callback) {
        var label = new cc.LabelTTF(title, b_getFontName(res.markerFont), 42);
        label.setColor(cc.color(255, 255, 255, 255));

        return new cc.MenuItemLabel(label, callback);
    }
});