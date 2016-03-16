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
        sp.anchorY = 0 + NJ.anchorOffsetY;

        this.addChild(sp, 0, 1);

        var that = this;

        this._menu = new cc.Menu();

        var jumboTitleLabel = this.generateLabel("Pick your Jumbo...");
        this._menu.addChild(jumboTitleLabel);

        // get possible jumbos
        var jumbosList = NJ.jumbos.getJumbosList();
        var jumbo;
        var jumboButton = null;
        var jumboName = "";
        var jumboDifficulty = "";
        for(var i = 0; i < jumbosList.length; i++) {
            jumbo = jumbosList[i];

            // here we create a callback for each button and bind the associated jumbo id to the callback
            jumboButton = this.generateJumboButton(jumbo, (function(jumboId) {
                return function() { that.onChoose(jumboId) };
            })(jumbo.key));

            this._menu.addChild(jumboButton);
        }

        var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
        var buttonSize = cc.size(refDim * NJ.buttonSizes.back, refDim * NJ.buttonSizes.back);

        var backButton = new NJButton(buttonSize, function () {
            that.onBack();
        }, this);

        backButton.setImageRes(res.buttonImage);

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

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            // Init stats data.
            NJ.gameState.chooseJumbo(jumboId);

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
        cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
        cc.MenuItemFont.setFontSize( NJ.fontSizes.header);

        var toggleLabel = new cc.MenuItemFont(title);

        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    // TODO: for some reason, the increase font size / decrease scale trick does not work here
    generateJumboButton: function(jumbo, callback) {
        var title = jumbo.name;
        var color = jumbo.color;
        var highscoreThreshold = jumbo.highscoreThreshold;
        var currencyThreshold = jumbo.currencyThreshold;

        var label = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontSizes.buttonSmall);

        //label.setFontSize (NJ.fontScalingFactor * NJ.fontSizes.buttonSmall);
        //label.setScale(1.0 / NJ.fontScalingFactor);

        var jumboMenuItem;

        if(NJ.stats.getHighscore() < highscoreThreshold && NJ.stats.getCurrency() < currencyThreshold) {
            label.setString(title + " (" + NJ.prettifier.formatNumber(highscoreThreshold) + " best or " +
                NJ.prettifier.formatNumber(currencyThreshold) + " gold)");

            label.setColor(cc.color("#ffffff"));
            jumboMenuItem = new cc.MenuItemLabel(label, callback);
            jumboMenuItem.setEnabled(false);
        } else {
            label.setColor(cc.color(color));
            jumboMenuItem = new cc.MenuItemLabel(label, callback);
        }

        return jumboMenuItem;
    }
});