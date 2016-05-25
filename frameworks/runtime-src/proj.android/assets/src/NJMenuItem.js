/**
 * Created by jonathanlu on 2/22/16.
 */

var NJMenuItem = (function() {

    var generateTitleStates = function(title, size, pos) {
        var scale = 1;

        var refDim = Math.min(cc.visibleRect.height, cc.visibleRect.width);

        if(size.height > refDim * NJ.uiSizes.header2)
            scale = 2;

        // TODO: Figure out when to set scale to 2 (when it gets blurry)

        var normalLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        var imageSize = normalLabel.getContentSize();
        normalLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
        normalLabel.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        var selectedLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        selectedLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
        selectedLabel.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        var disabledLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        disabledLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
        disabledLabel.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        return {
            normal: normalLabel,
            selected: selectedLabel,
            disabled: disabledLabel
        }
    };

    var generateImageStates = function(imageRes, size, pos) {
        size = size || cc.size(100, 100);
        pos = pos || cc.p(size.width / 2, size.height / 2);

        var normalImage, selectedImage, disabledImage;

        // initialize button background
        normalImage = new cc.Sprite(imageRes);
        selectedImage = new cc.Sprite(imageRes);
        disabledImage = new cc.Sprite(imageRes);

        var imageSize = normalImage.getContentSize();
        normalImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
        selectedImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
        disabledImage.setScale(size.width / imageSize.width, size.height / imageSize.height);

        selectedImage.setColor(cc.color(192, 192, 192, 255));
        disabledImage.setColor(cc.color(64, 64, 64, 255));

        normalImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        selectedImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        disabledImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        return {
            normal: normalImage,
            selected: selectedImage,
            disabled: disabledImage
        };
    };

    var generateScale9States = function(imageRes, size, pos) {
        size = size || cc.size(100, 100);
        pos = pos || cc.p(size.width / 2, size.height / 2);

        var normalImage, selectedImage, disabledImage;

        var insets = cc.rect(0, 0, 0, 0);

        // initialize button background
        normalImage = new cc.Scale9Sprite(imageRes);
        selectedImage = new cc.Scale9Sprite(imageRes);
        disabledImage = new cc.Scale9Sprite(imageRes);
// try not doing this
        normalImage.setContentSize(size);
        selectedImage.setContentSize(size);
        disabledImage.setContentSize(size);

        selectedImage.setColor(cc.color(192, 192, 192, 255));
        disabledImage.setColor(cc.color(64, 64, 64, 255));

        normalImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        selectedImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        disabledImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        return {
            normal: normalImage,
            selected: selectedImage,
            disabled: disabledImage
        };
    };

    return cc.MenuItemSprite.extend({

        _spriteStates: null,
        _backgroundStates: null,
        _titleStates: null,

        _shouldResizeWithText: false,

        // assumes title is defined
        ctor: function(size, callback, target) {

            callback = callback || function() {};
            target = target || this;

            // initialize the container sprite
            var normalSprite = new cc.Sprite();
            var selectedSprite = new cc.Sprite();
            var disabledSprite = new cc.Sprite();

            if(typeof size === 'number') {
                size = cc.size(cc.visibleRect.width, size);
            }

            normalSprite.setContentSize(size.width, size.height);
            selectedSprite.setContentSize(size.width, size.height);
            disabledSprite.setContentSize(size.width, size.height);

            this._spriteStates = {
                normal: normalSprite,
                selected: selectedSprite,
                disabled: disabledSprite
            };

            this._super(normalSprite, selectedSprite, disabledSprite, callback, target);

            this.setEnabled(false);
        },

        runActionOnChildren: function(action) {
            var key;

            if(this._backgroundStates) {
                for (key in this._backgroundStates) {
                    if (this._backgroundStates.hasOwnProperty(key)) {
                        this._backgroundStates[key].runAction(action.clone());
                    }
                }
            }

            if(this._titleStates) {
                for (key in this._titleStates) {
                    if (this._titleStates.hasOwnProperty(key)) {
                        this._titleStates[key].runAction(action.clone());
                    }
                }
            }
        },

        // stop all actions on the visible children of the menu item
        stopAllActionsOnChildren: function(action) {
            var key;

            if(this._backgroundStates) {
                for (key in this._backgroundStates) {
                    if (this._backgroundStates.hasOwnProperty(key)) {
                        this._backgroundStates[key].stopAllActions();
                    }
                }
            }

            if(this._titleStates) {
                for (key in this._titleStates) {
                    if (this._titleStates.hasOwnProperty(key)) {
                        this._titleStates[key].stopAllActions();
                    }
                }
            }
        },

        // sets the color of the label of the menu item
        setLabelColor: function(color) {
            var key;

            // only initialize the labels when we need it
            if(!this._titleStates) {
                var contentSize = this.getContentSize();
                this._titleStates = generateTitleStates(" ", contentSize, cc.p(contentSize.width / 2, contentSize.height / 2));
                this._spriteStates.normal.addChild(this._titleStates.normal, 2);
                this._spriteStates.selected.addChild(this._titleStates.selected, 2);
                this._spriteStates.disabled.addChild(this._titleStates.disabled, 2);
            }

            for (key in this._titleStates) {
                if (this._titleStates.hasOwnProperty(key)) {
                    this._titleStates[key].setColor(color);
                }
            }
        },

        // sets the opacity of the children of the menu item
        setChildrenOpacity: function(opacity) {
            var key;

            if(this._backgroundStates) {
                for (key in this._backgroundStates) {
                    if (this._backgroundStates.hasOwnProperty(key)) {
                        this._backgroundStates[key].setOpacity(opacity);
                    }
                }
            }

            if(this._titleStates) {
                for (key in this._titleStates) {
                    if (this._titleStates.hasOwnProperty(key)) {
                        this._titleStates[key].setOpacity(opacity);
                    }
                }
            }
        },

        setBackgroundImage: function(res) {
            var contentSize = this.getContentSize();

            this._backgroundStates = generateImageStates(res, contentSize,
                cc.p(contentSize.width / 2, contentSize.height / 2));

            this.setBackgroundColor(NJ.themes.defaultButtonColor);

            this._spriteStates.normal.addChild(this._backgroundStates.normal, -5);
            this._spriteStates.selected.addChild(this._backgroundStates.selected, -5);
            this._spriteStates.disabled.addChild(this._backgroundStates.disabled, -5);
        },

        // sets the background color for the the button
        // parameters can consist of a single col
        setBackgroundColor: function(color) {
            var normalColor = color;
            var pressedColor = NJ.colorWithBrightness(color, 0.5);

            this._backgroundStates.normal.setColor(normalColor);
            this._backgroundStates.selected.setColor(pressedColor);
            this._backgroundStates.disabled.setColor(pressedColor);
        },

        setTitle: function(title) {
            // only initialize the labels when we need it
            if(!this._titleStates) {
                var contentSize = this.getContentSize();
                this._titleStates = generateTitleStates(title, contentSize, cc.p(contentSize.width / 2, contentSize.height / 2));
                this._spriteStates.normal.addChild(this._titleStates.normal, 2);
                this._spriteStates.selected.addChild(this._titleStates.selected, 2);
                this._spriteStates.disabled.addChild(this._titleStates.disabled, 2);
            }

            this._titleStates.normal.setString(title);
            this._titleStates.selected.setString(title);
            this._titleStates.disabled.setString(title);
        },

        setImageRes: function(res) {
            var contentSize = this.getContentSize();
            var imageStates = generateImageStates(res, cc.size(contentSize.width * 0.75, contentSize.height * 0.75), cc.p(contentSize.width / 2, contentSize.height / 2));

            this._spriteStates.normal.addChild(imageStates.normal, 1);
            this._spriteStates.selected.addChild(imageStates.selected, 1);
            this._spriteStates.disabled.addChild(imageStates.disabled, 1);
        }
    });
}());