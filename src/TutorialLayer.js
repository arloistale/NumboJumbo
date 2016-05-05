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

        _titleMenuItem: null,
        _helperMenuItem: null,

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

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            this._titleMenuItem = new NJMenuItem(cc.size(cc.visibleRect.width, refDim * 0.05));
            this._helperMenuItem = new NJMenuItem(cc.size(cc.visibleRect.width, refDim * 0.05));

            this._menu.addChild(this._titleMenuItem);
            this._menu.addChild(this._helperMenuItem);

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
                        that._titleMenuItem.setTitle("\"I don't believe in mathematics.\"");
                        that._helperMenuItem.setTitle("- Albert Einstein");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(4), cc.fadeTo(0.25, 0)));
                        that._helperMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(3), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(7), cc.callFunc(function() {
                            that._helperMenuItem.setTitle("Try adding 2 + 1 = 3!");
                            that._menu.alignItemsVerticallyWithPadding(10);
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.subtraction:

                        that._titleMenuItem.setTitle("Nice! You added to 3.");
                        that._helperMenuItem.setTitle("There are many possible Combos.");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;
                    case slides.more:

                        that._titleMenuItem.setTitle("Great!");
                        that._helperMenuItem.setTitle("You can even move diagonally.");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.wombo:

                        that._titleMenuItem.setTitle("Beautiful.");
                        that._helperMenuItem.setTitle("Longer combos can explode more blocks!");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.fadeTo(0.25, 255));
                        })));

                        break;

                    case slides.end:

                        that._titleMenuItem.setTitle("Wombo Combo!");
                        that._helperMenuItem.setTitle("Welcome to Numbo Jumbo.");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));
                        that._helperMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

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

            // we assume here that all children of the menu are instances of NJMenuItem
            var children = this._menu.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].stopAllActionsOnChildren();
                children[i].runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 0)));
            }
        }
    });
}());