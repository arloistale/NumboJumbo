/**
 * Created by jonathanlu on 3/8/16.
 *
 * The Tutorial Layer is a state machine that takes input and responds according
 * to its various slides
 */

var TutorialLayer = (function() {

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.Layer.extend({

        // definition of possible tutorial slides
        slides: {
            intro: 1,
            subtraction: 2,
            more: 3,
            wombo: 4,
            end: 5
        },

        // UI Data
        _menu: null,

        _titleLabel: null,
        _helperLabel: null,

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
            this._menu = new cc.Menu();
            this.addChild(this._menu, 100);

            this._titleLabel = this._generateLabel(" ");
            this._helperLabel = this._generateLabel(" ");
            this._titleLabel.setOpacity(0);
            this._helperLabel.setOpacity(0);

            this._menu.addChild(this._titleLabel);
            this._menu.addChild(this._helperLabel);

            this._currSlide = 0;
        },

        // note that the stuff that happens as a result as advancing
        // is called asynchronously (we have to fade out old slide before doing other stuff)
        advanceSlide: function() {
            this._currSlide++;

            var that = this;

            this._fadeOutSlide();

            this.runAction(cc.sequence(cc.delayTime(0.25), cc.callFunc(function() {
                var slides = that.slides;

                switch(that._currSlide) {
                    case slides.intro:
                        that._titleLabel.setString("Welcome to Numbo Jumbo.");
                        that._helperLabel.setString("Swipe something!");

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(8), cc.callFunc(function() {
                            that._helperLabel.setOpacity(0);
                            that._helperLabel.runAction(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.subtraction:

                        that._titleLabel.setString("Nice. You made something!");
                        that._helperLabel.setString("This works too.");

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperLabel.setOpacity(0);
                            that._helperLabel.runAction(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;
                    case slides.more:

                        that._titleLabel.setString("Awesome. You made another thing!");
                        that._helperLabel.setString("Try something cooler.");

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperLabel.setOpacity(0);
                            that._helperLabel.runAction(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.wombo:

                        that._titleLabel.setString("Beautiful. You made many things!");
                        that._helperLabel.setString("One last thing.");

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperLabel.setOpacity(0);
                            that._helperLabel.runAction(cc.fadeTo(0.25, 255));
                        })));

                        break;

                    case slides.end:

                        that._titleLabel.setString("Wombo Combo!");
                        that._helperLabel.setString("Welcome to Numbo Jumbo.");

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));
                        that._helperLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        break;
                }
            })));

            return this._currSlide;
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

        // helper function to fade out the old slide
        // to make room for the new one
        _fadeOutSlide: function() {
            this.stopAllActions();

            var children = this._menu.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].stopAllActions();
                children[i].runAction(cc.sequence(cc.fadeTo(0.25, 0)));
            }
        },

        _generateLabel: function(title) {
            cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
            cc.MenuItemFont.setFontSize( NJ.fontSizes.sub);

            var toggleLabel = new cc.MenuItemFont(title);

            toggleLabel.setEnabled(false);
            toggleLabel.setColor(cc.color(255, 255, 255, 255));
            return toggleLabel;
        }
    });
}());