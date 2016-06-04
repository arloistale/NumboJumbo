/**
 * Created by jonathanlu on 3/8/16.
 *
 * The Tutorial Layer is a state machine that takes input and responds according
 * to its various slides
 */

var PrepLayer = (function() {

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.Layer.extend({

        // UI Data
        _menu: null,

        _titleMenuItem: null,
        _helperMenuItem: null,

        // Callbacks Data
        onAdvanceCallback: null,

        // Data
        _titleStr: "",
        _helperStr: "",

////////////////////
// Initialization //
////////////////////

        ctor: function(titleStr, helperStr) {
            this._super();

            this._titleStr = titleStr;
            this._helperStr = helperStr;

            this.initUI();
        },

        initUI: function() {
            this._menu = new cc.Menu();
            this.addChild(this._menu, 100);

            this._titleMenuItem = new NJMenuItem(cc.size(cc.visibleRect.width, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)));
            this._helperMenuItem = new NJMenuItem(cc.size(cc.visibleRect.width, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)));
            this._titleMenuItem.setLabelColor(NJ.themes.defaultLabelColor);
            this._helperMenuItem.setLabelColor(NJ.themes.defaultLabelColor);

            that._titleMenuItem.setLabelTitle(this._titleStr);
            that._helperMenuItem.setLabelTitle(this._helperStr);

            this._menu.addChild(this._titleMenuItem);
            this._menu.addChild(this._helperMenuItem);
        },

        // note that the stuff that happens as a result as advancing
        // is called asynchronously (we have to fade out old slide before doing other stuff)
        advanceSlide: function() {
            this._currSlide++;

            var that = this;

            this._fadeOutSlide();

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                var slides = that.slides;

                        that._titleMenuItem.setLabelTitle("\"I don't believe in mathematics.\"");
                        that._helperMenuItem.setLabelTitle("- Albert Einstein");

                        that._titleMenuItem.setChildrenOpacity(0);
                        that._helperMenuItem.setChildrenOpacity(0);

                        that._menu.alignItemsVerticallyWithPadding(10);

                        that._titleMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(1), cc.fadeTo(0.25, 255), cc.delayTime(4), cc.fadeTo(0.25, 0)));
                        that._helperMenuItem.runActionOnChildren(cc.sequence(cc.delayTime(3), cc.fadeTo(0.25, 255), cc.delayTime(2), cc.fadeTo(0.25, 0)));

        },

//////////////////
// UI Callbacks //
//////////////////

        setAdvanceCallback: function(callback) {
            this.onCloseCallback = callback;
        }

////////////////
// UI Helpers //
////////////////
    });
}());