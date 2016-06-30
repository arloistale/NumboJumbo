/**
 * Created by jonathanlu on 4/26/16.
 */

var NJMenuButton = NJMenuItem.extend({

    // Highlight Data
    _highlightSprite: null,
    _highlightScale: null,

    _isHighlightEnabled: false,

    _touchMoveThreshold: -1,

    ctor: function(size, callback, target) {
        this._super(size, callback, target);

        var that = this;

        if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large)) {
            this.setBackgroundImage(res.blockImage2x);
        } else {
            this.setBackgroundImage(res.blockImage);
        }

        var buyCoinsButton = new ccui.Button();
        buyCoinsButton.loadTextures(res.alertImage, res.alertImage, res.alertImage);
        buyCoinsButton.setTouchEnabled(true);
        buyCoinsButton.setScale(this.getContentSize().width / buyCoinsButton.getContentSize().width, this.getContentSize().height / buyCoinsButton.getContentSize().height);
        //buyCoinsButton.setContentSize(this.getContentSize());
        buyCoinsButton.setColor(cc.color(255, 255, 255));
        buyCoinsButton.setOpacity(0);
        buyCoinsButton.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
        buyCoinsButton.setSwallowTouches(false);
        buyCoinsButton.addTouchEventListener(function(sender, type) {
            switch(type) {
                case ccui.Widget.TOUCH_ENDED:
                    var dist = cc.pDistance(sender._touchBeganPosition, sender._touchEndPosition);
                    if((dist <= NJ.calculateScreenDimensionFromRatio(that._touchMoveThreshold) || that._touchMoveThreshold < 0) && callback)
                        callback();
                    break;
            }
        }, this);

        this.addChild(buyCoinsButton, 70);
    },

    setImageRes: function(res) {
        this._super(res);

        this.setImageColor(NJ.themes.defaultButtonForegroundColor);
    },

    updateTheme: function() {
        this._super();

        this.setImageColor(NJ.themes.defaultButtonForegroundColor);
    },

    setTouchMoveThreshold: function(threshold) {
        this._touchMoveThreshold = threshold;
    }
});