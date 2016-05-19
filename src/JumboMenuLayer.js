/**
 * Created by jonathanlu on 1/19/16.
 */

var JumboMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onChooseMinuteMadness = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new MinuteMadnessLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    };

    var onChooseMoves = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new MovesLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    };

    var onChooseTurnBased = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new TurnBasedFillUpGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    };

    var onChooseSurvival = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new SurvivalGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    };

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.LayerColor.extend({

        // UI Data
        _menu: null,

        // Callbacks Data
        onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this.initUI();
        },

        initUI: function() {
            /*
            var sp = new cc.Sprite(res.loading_png);
            sp.anchorX = 0;
            sp.anchorY = 0 + NJ.anchorOffsetY;
*/
            //this.addChild(sp, 0, 1);

            var that = this;

            this._menu = new cc.Menu();

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);

            this._menu.addChild(this.generateLabel("Game Modes", refDim * NJ.uiSizes.header));

            // here we create a callback for each button and bind the associated jumbo id to the callback
            var minuteMadnessButton = this.generateJumboButton("Minute Madness", cc.color(NJ.themes.blockColors[0]), onChooseMinuteMadness.bind(this));
            var movesButton = this.generateJumboButton("Moves", cc.color(NJ.themes.blockColors[1]), onChooseMoves.bind(this));
            var turnBasedButton = this.generateJumboButton("Turn Based", cc.color(NJ.themes.blockColors[2]), onChooseTurnBased.bind(this));
            var survivalButton = this.generateJumboButton("Infinite", cc.color(NJ.themes.blockColors[3]), onChooseSurvival.bind(this));

            this._menu.addChild(minuteMadnessButton);
            this._menu.addChild(movesButton);
            this._menu.addChild(turnBasedButton);
            this._menu.addChild(survivalButton);

            var buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.backImage);
            this._menu.addChild(backButton);

            this._menu.alignItemsVerticallyWithPadding(10);

            this.addChild(this._menu, 100);
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

        generateLabel: function(title, size) {
            var toggleLabel = new NJMenuItem(size);
            toggleLabel.setTitle(title);
            toggleLabel.setLabelColor(NJ.themes.defaultLabelColor);

            return toggleLabel;
        },

        // TODO: for some reason, the increase font size / decrease scale trick does not work here
        generateJumboButton: function(title, color, callback) {
            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var elementSize = cc.size(refDim * 0.75, refDim * NJ.uiSizes.header2 * 1.1);

            var button = new NJMenuButton(elementSize, callback, this);
            button.setEnabled(true);
            button.setTitle(title);

            button.setBackgroundColor(color);

            return button;
        }
    });
}());