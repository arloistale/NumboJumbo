/**
 * Created by jonathanlu on 3/8/16.
 *
 * The Tutorial Layer is a state machine that takes input and responds according
 * to its various slides
 */

var TutorialLayer = (function() {

    var slides = {
        intro: 0,
        diagonal: 1,
        womboCombo: 2
    };

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.Layer.extend({

        // UI Data
        _menu: null,

        // Callbacks Data
        onAdvanceCallback: null,
        onCloseCallback: null,

        // Data
        _currSlide: null,

////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this.initUI();
        },

        initUI: function() {
            var that = this;

            this._menu = new cc.Menu();
            this.addChild(this._menu, 100);

            this._currSlide = slides.intro;
        },

        drawSlide: function() {

            var that = this;

            this._menu.clear();

            var backButton = new NJMenuButton("Skip", function () {
                that.onBack();
            }, this);

            backButton.setImageRes(res.buttonImage);

            switch(this._currSlide) {
                case slides.intro:
                    var titleLabel = this.generateLabel("This is a Combo.");
                    this._menu.addChild(titleLabel);

                    this._menu.addChild(backButton);

                    this._menu.alignItemsVerticallyWithPadding(10);
                    break;

                case slides.diagonal:

                    break;
            }
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
        }
    });
}());