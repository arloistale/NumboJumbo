/**
 * Created by jonathanlu on 2/22/16.
 */

var NJButton = (function() {

    var generateTitleStates = function(title) {

    };

    var generateImageStates = function(imageRes, size) {
        size = size || cc.size(100, 100);

        var normalImage, selectedImage, disabledImage;

        // initialize button background
        normalImage = new cc.Sprite(res.buttonImage);
        selectedImage = new cc.Sprite(res.buttonImage);
        disabledImage = new cc.Sprite(res.buttonImage);

        var imageSize = normalImage.getContentSize();
        normalImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
        selectedImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
        disabledImage.setScale(size.width / imageSize.width, size.height / imageSize.height);

        selectedImage.setColor(cc.color(192, 192, 192, 255));
        disabledImage.setColor(cc.color(64, 64, 64, 255));

        normalImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2
        });

        selectedImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2
        });

        disabledImage.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2
        });

        return {
            normal: normalImage,
            selected: selectedImage,
            disabled: disabledImage
        };
    };

    return cc.Sprite.extend({

        _spriteStates: null,
        _titleStates: null,

        // assumes title is defined
        ctor: function(size, callback, target) {

            // initialize the container sprite
            var normalSprite = new cc.Sprite();
            var selectedSprite = new cc.Sprite();
            var disabledSprite = new cc.Sprite();

            normalSprite.setContentSize(size.width, size.height);
            selectedSprite.setContentSize(size.width, size.height);
            disabledSprite.setContentSize(size.width, size.height);

            this._spriteStates = {
                normal: normalSprite,
                selected: selectedSprite,
                disabled: disabledSprite
            };

            this._super(normalSprite, selectedSprite, disabledSprite, callback, target);

            this.setBackgroundImage();
        },

        setBackgroundImage: function() {
            var backgroundStates = generateImageStates(res.buttonImage, this.getContentSize());
            backgroundStates.normal.setColor(cc.color("#424242"));
            backgroundStates.selected.setColor(cc.color("#212121"));
            backgroundStates.disabled.setColor(cc.color("#212121"));

            this._spriteStates.normal.addChild(backgroundStates.normal, -5);
            this._spriteStates.selected.addChild(backgroundStates.selected, -5);
            this._spriteStates.disabled.addChild(backgroundStates.disabled, -5);
        },

        setTitle: function(title) {
            /*
            // only initialize the labels when we need it
            if(!this._titleStates) {
                var normalLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
                normalLabel.attr({
                    scale: 1.0 / NJ.fontScalingFactor,
                    anchorX: 0.5,
                    anchorY: 0.5 + NJ.anchorOffsetY,
                    x: size.width / 2,
                    y: size.height / 2
                });

                var selectedLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
                selectedLabel.attr({
                    scale: 1.0 / NJ.fontScalingFactor,
                    anchorX: 0.5,
                    anchorY: 0.5 + NJ.anchorOffsetY,
                    x: size.width / 2,
                    y: size.height / 2
                });

                var disabledLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
                disabledLabel.attr({
                    scale: 1.0 / NJ.fontScalingFactor,
                    anchorX: 0.5,
                    anchorY: 0.5 + NJ.anchorOffsetY,
                    x: size.width / 2,
                    y: size.height / 2
                });

                this._spriteStates.normal.addChild(normalLabel, 1);
                this._spriteStates.selected.addChild(selectedLabel, 1);
                this._spriteStates.disabled.addChild(disabledLabel, 1);
            }

            this._titleStates.normal.setString(title);
            this._titleStates.selected.setString(title);
            this._titleStates.disabled.setString(title);
            */
        },

        setImageRes: function(res) {
            /*
            var size = this.normalSprite.getContentSize();

            var normalImage = new cc.Sprite(res);
            var imageSize = normalImage.getContentSize();
            normalImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
            var selectedImage = new cc.Sprite(res);
            selectedImage.setScale(size.width / imageSize.width, size.height / imageSize.height);
            var disabledImage = new cc.Sprite(res);
            disabledImage.setScale(size.width / imageSize.width, size.height / imageSize.height);

            selectedImage.setColor(cc.color(192, 192, 192, 255));
            disabledImage.setColor(cc.color(64, 64, 64, 255));

            normalImage.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: size.width / 2,
                y: size.height / 2
            });

            selectedImage.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: size.width / 2,
                y: size.height / 2
            });

            disabledImage.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: size.width / 2,
                y: size.height / 2
            });

            this.normalSprite.addChild(normalImage, -1);
            this.selectedSprite.addChild(selectedImage, -1);
            this.disabledSprite.addChild(disabledImage, -1);
            */
        }
    });
}());