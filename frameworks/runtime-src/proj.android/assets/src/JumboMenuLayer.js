/**
 * Created by jonathanlu on 1/19/16.
 */

var JumboMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onChoose = function(jumboId) {
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

            var jumboTitleLabel = this.generateLabel("Game Modes", refDim * NJ.uiSizes.header);
            this._menu.addChild(jumboTitleLabel);

            // get possible jumbos
            var jumbosList = NJ.jumbos.getJumbosList();
            var jumbo;
            var jumboButton = null;
            for(var i = 0; i < jumbosList.length; i++) {
                jumbo = jumbosList[i];

                // here we create a callback for each button and bind the associated jumbo id to the callback
                jumboButton = this.generateJumboButton(jumbo, (function(jumboId) {
                    return function() { onChoose.bind(this)(jumboId) };
                })(jumbo.key));

                this._menu.addChild(jumboButton);
            }

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
        generateJumboButton: function(jumbo, callback) {
            var contentSize = this.getContentSize();

            var title = jumbo.name;
            var color = jumbo.color;
            var highscoreThreshold = jumbo.highscoreThreshold;
            var currencyThreshold = jumbo.currencyThreshold;

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var elementSize = cc.size(refDim * 0.75, refDim * NJ.uiSizes.header2 * 1.1);

            var button = new NJMenuItem(elementSize, callback, this);
            button.setEnabled(true);
            button.setTitle(title);

            if(NJ.stats.getHighscore() < highscoreThreshold && NJ.stats.getCurrency() < currencyThreshold) {
                //button.setTitle(title + " (" + NJ.prettifier.formatNumber(highscoreThreshold) + " best or " +
                    //NJ.prettifier.formatNumber(currencyThreshold) + " gold)");

                button.setLabelColor(cc.color("#424242"));
                button.setEnabled(false);
            } else {
                button.setLabelColor(cc.color(color));
            }

            return button;
        }
    });
}());