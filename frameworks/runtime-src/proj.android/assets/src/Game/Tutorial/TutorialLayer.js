/**
 * Created by jonathanlu on 3/8/16.
 *
 * The Tutorial Layer is a state machine that takes input and responds according
 * to its various slides
 */

var TutorialLayer = (function() {

    var onBack = function() {
        NJ.audio.playSound(res.clickSound);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.Layer.extend({

        // definition of possible tutorial slides
        slides: {
            intro: 1,
            practice1: 2,
            teach2: 3,
            practice2: 4,
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

            this._titleMenuItem = new NumboMenuItem(cc.size(cc.visibleRect.width, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)));
            this._helperMenuItem = new NumboMenuItem(cc.size(cc.visibleRect.width, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)));
            this._titleMenuItem.setLabelColor(NJ.themes.defaultLabelColor);
            this._helperMenuItem.setLabelColor(NJ.themes.defaultLabelColor);

            this._menu.addChild(this._titleMenuItem);
            this._menu.addChild(this._helperMenuItem);

            this._currSlide = 0;
        },

        // note that the stuff that happens as a result as advancing
        // is called asynchronously (we have to fade out old slide before doing other stuff)
        advanceSlide: function() {
            this._currSlide++;

            var that = this;

            this.fadeOutSlide();

            this.runAction(cc.sequence(cc.delayTime(0.25), cc.callFunc(function() {
                var slides = that.slides;

                switch(that._currSlide) {
                    case slides.intro:
                        that._titleMenuItem.setLabelTitle("\"I don't believe in mathematics.\"");
                        that._helperMenuItem.setLabelTitle("- Albert Einstein");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(4), cc.fadeTo(0.25, 0)));
                        that._helperMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(3), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(6), cc.callFunc(function() {
                            that._helperMenuItem.setLabelTitle("Swipe numbers that make sums.\nFor example: 2 + 1 = 3");
                            that._menu.alignItemsVerticallyWithPadding(10);
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.practice1:

                        that._titleMenuItem.setLabelTitle("Right, because 2 + 1 = 3!");
                        that._helperMenuItem.setLabelTitle("Longer sums are even better.");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;
                    case slides.teach2:

                        that._titleMenuItem.setLabelTitle("Great!");
                        that._helperMenuItem.setLabelTitle("You can even move diagonally.");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.practice2:

                        that._titleMenuItem.setLabelTitle("Cool!");
                        that._helperMenuItem.setLabelTitle("");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        that.runAction(cc.sequence(cc.delayTime(4.75), cc.callFunc(function() {
                            that._helperMenuItem.setChildrenOpacity(0);
                            that._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 255)));
                        })));

                        break;

                    case slides.end:

                        that._titleMenuItem.setLabelTitle("Welcome to Numbo Jumbo.");
                        that._helperMenuItem.setLabelTitle("");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

                        break;
                }
            })));

            return this._currSlide;
        },

        fadeOutHelperLabel: function() {
            this._helperMenuItem.stopAllActionsOnChildren();
            this._helperMenuItem.runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 0)));
        },

        getCurrSlide: function() {
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
        fadeOutSlide: function() {
            this.stopAllActions();

            // we assume here that all children of the menu are instances of NumboMenuItem
            var children = this._menu.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].stopAllActionsOnChildren();
                children[i].runActionOnChildren(cc.sequence(cc.fadeTo(0.25, 0)));
            }
        }
    });
}());