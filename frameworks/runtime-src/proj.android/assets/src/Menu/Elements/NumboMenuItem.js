/**
 * Created by jonathanlu on 2/22/16.
 */

var NumboMenuItem = (function() {

    var generateTitleStates = function(title, size, pos) {
        var scale = 1;

        if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large)) {
            scale = 3;
        } else if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)) {
            scale = 2;
        }

        var normalLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        var imageSize = normalLabel.getContentSize();
        normalLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        normalLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
        normalLabel.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        var selectedLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        selectedLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        selectedLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
        selectedLabel.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: pos.x,
            y: pos.y
        });

        var disabledLabel = new cc.LabelBMFont(title, b_getFontName(res.mainFont, scale));
        disabledLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
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

        selectedImage.setColor(cc.color(255, 255, 255, 255));
        disabledImage.setColor(cc.color(255, 255, 255, 255));

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

        mType: "NumboMenuItem",

        _spriteStates: null,
        _backgroundStates: null,
        _titleStates: null,
        _imageStates: null,

        _rawImageSize: null,

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

            var children, i;

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

            if(this._imageStates) {
                for (key in this._imageStates) {
                    if (this._imageStates.hasOwnProperty(key)) {
                        this._imageStates[key].runAction(action.clone());
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

            if(this._imageStates) {
                for (key in this._imageStates) {
                    if (this._imageStates.hasOwnProperty(key)) {
                        this._imageStates[key].stopAllActions();
                    }
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

            if(this._imageStates) {
                for (key in this._imageStates) {
                    if (this._imageStates.hasOwnProperty(key)) {
                        this._imageStates[key].setOpacity(opacity);
                    }
                }
            }
        },

        //////////////////////
        // Background Logic //
        //////////////////////

        setBackgroundImage: function(res) {

            var contentSize = this.getContentSize();

            if(this._backgroundStates) {
                this._spriteStates.normal.removeChild(this._backgroundStates.normal);
                this._spriteStates.selected.removeChild(this._backgroundStates.selected);
                this._spriteStates.disabled.removeChild(this._backgroundStates.disabled);
            }

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
            if(!this._backgroundStates)
                return;

            var normalColor = color;
            var pressedColor = NJ.colorWithBrightness(color, 0.75);

            this._backgroundStates.normal.setColor(normalColor);
            this._backgroundStates.selected.setColor(pressedColor);
            this._backgroundStates.disabled.setColor(normalColor);
        },

        /////////////////
        // Title Logic //
        /////////////////

        setLabelTitle: function(title) {
            // only initialize the labels when we need it
            if(!this._titleStates) {
                this._makeTitleStates();
            }

            this._titleStates.normal.setString(title);
            this._titleStates.selected.setString(title);
            this._titleStates.disabled.setString(title);
        },

        // Assumes sizes is a dimension value
        setLabelSize: function(size) {
            // only initialize the labels when we need it
            if(!this._titleStates) {
                this._makeTitleStates();
            }

            var spriteSize;
            for (var key in this._titleStates) {
                if (this._titleStates.hasOwnProperty(key)) {
                    spriteSize = this._titleStates[key].getContentSize();
                    this._titleStates[key].setScale(size / spriteSize.height, size / spriteSize.height);
                }
            }
        },

        offsetLabel: function(offset) {
            // only initialize the labels when we need it
            if(!this._titleStates) {
                this._makeTitleStates();
            }

            var statePos;
            for (var key in this._titleStates) {
                if (this._titleStates.hasOwnProperty(key)) {
                    statePos = this._titleStates[key].getPosition();
                    this._titleStates[key].setPosition(statePos.x + offset.x, statePos.y + offset.y);
                }
            }
        },

        // sets the color of the label of the menu item
        setLabelColor: function(color) {
            var key;

            // only initialize the labels when we need it
            if(!this._titleStates) {
                this._makeTitleStates();
            }

            for (key in this._titleStates) {
                if (this._titleStates.hasOwnProperty(key)) {
                    this._titleStates[key].setColor(color);
                }
            }

        },

        /////////////////
        // Image Logic //
        /////////////////

        // set the image file shown in the foreground of the menu item
        setImageRes: function(res) {
            if(this._spriteStates.normal.getChildByTag(117))
                this._spriteStates.normal.removeChildByTag(117);

            if(this._spriteStates.selected.getChildByTag(117))
                this._spriteStates.selected.removeChildByTag(117);

            if(this._spriteStates.disabled.getChildByTag(117))
                this._spriteStates.disabled.removeChildByTag(117);

            var contentSize = this.getContentSize();
            this._imageStates = generateImageStates(res, cc.size(contentSize.width * 0.75, contentSize.height * 0.75), cc.p(contentSize.width / 2, contentSize.height / 2));

            this._rawImageSize = this._imageStates.normal.getContentSize();

            this._spriteStates.normal.addChild(this._imageStates.normal, 1, 117);
            this._spriteStates.selected.addChild(this._imageStates.selected, 1, 117);
            this._spriteStates.disabled.addChild(this._imageStates.disabled, 1, 117);
        },

        // changes the color of the menu item foreground image
        setImageColor: function(color) {
            for(var key in this._imageStates) {
                if(!this._imageStates.hasOwnProperty(key))
                    continue;

                this._imageStates[key].setColor(color);
            }
        },

        // Assumes sizes is a cc.Size
        // also assumes image states have been initialized with setImageRes
        setImageSize: function(size) {
            var contentSize = this.getContentSize();
            var spriteSize;
            for (var key in this._spriteStates) {
                if (this._spriteStates.hasOwnProperty(key)) {
                    spriteSize = this._spriteStates[key].getContentSize();
                    this._spriteStates[key].setScale(size.width / spriteSize.width, size.height / spriteSize.height);
                    this._spriteStates[key].attr({
                        anchorX: 0.5,
                        anchorY: 0.5,
                        x: contentSize.width / 2,
                        y: contentSize.height / 2
                    })
                }
            }
        },

        // DO NOT call this before initializing image states
        getRawImageSize: function() {
            return this._rawImageSize;
        },

        updateTheme: function() {
            this.setLabelColor(NJ.themes.defaultLabelColor);
            this.setBackgroundColor(NJ.themes.defaultButtonColor);
        },

        /////////////
        // Helpers //
        /////////////

        _makeTitleStates: function() {
            var contentSize = this.getContentSize();
            this._titleStates = generateTitleStates(" ", contentSize, cc.p(contentSize.width / 2, contentSize.height / 2));
            this._spriteStates.normal.addChild(this._titleStates.normal, 2);
            this._spriteStates.selected.addChild(this._titleStates.selected, 2);
            this._spriteStates.disabled.addChild(this._titleStates.disabled, 2);

            this.setLabelColor(NJ.themes.defaultLabelColor);
        }
    });
}());