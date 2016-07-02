/**
 * Created by jonathanlu on 4/26/16.
 */

var NJMenuButton = NJMenuItem.extend({

    // UI Data
    _uiButton: null,

    _touchMoveThreshold: -1,

    ctor: function(size, callback, target) {
        this._super(size, callback, target);

        var that = this;

        this._uiButton = new ccui.Button();
        this._uiButton.setTouchEnabled(true);
        this._uiButton.setColor(cc.color(255, 255, 255));
        this._uiButton.setOpacity(0);
        this._uiButton.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
        this._uiButton.setSwallowTouches(false);
        this._uiButton.addTouchEventListener(function(sender, type) {
            switch(type) {
                case ccui.Widget.TOUCH_BEGAN:
                    that._uiButton.setOpacity(64);
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    if(!that._uiButton.isHighlighted()) {
                        that._uiButton.setOpacity(0);
                    }

                    break;
                case ccui.Widget.TOUCH_ENDED:
                    that._uiButton.setOpacity(0);
                    //var dist = cc.pDistance(sender._touchBeganPosition, sender._touchEndPosition);
                    //if((dist <= NJ.calculateScreenDimensionFromRatio(that._touchMoveThreshold) || that._touchMoveThreshold < 0) && callback)
                    if(callback)
                        callback();
                    break;
            }
        }, this);

        if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large)) {
            this.setBackgroundImage(res.blockImage2x);
        } else {
            this.setBackgroundImage(res.blockImage);
        }

        this.addChild(this._uiButton, 70);
    },

    setEnabled: function(flag) {
        this._super(flag);

        if(this._uiButton)
            this._uiButton.setEnabled(flag);
    },

    setBackgroundImage: function(res) {
        this._super(res);

        if(this._uiButton) {
            this._uiButton.loadTextures(res, res, res);
            this._uiButton.setScale(this.getContentSize().width / this._uiButton.getContentSize().width, this.getContentSize().height / this._uiButton.getContentSize().height);
        }
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