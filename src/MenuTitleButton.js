/**
 * Created by jonathanlu on 2/22/16.
 */

var MenuTitleButton = cc.MenuItemSprite.extend({
    normalSprite: null,
    selectedSprite: null,
    disabledSprite: null,

    // assumes title is defined
    ctor: function(title, callback, target) {
        var size = cc.size((NJ.fontSizes.buttonMedium + 10) * 2.875, NJ.fontSizes.buttonMedium + 10);

        this.normalSprite = new cc.Sprite();
        this.selectedSprite = new cc.Sprite();
        this.disabledSprite = new cc.Sprite();

        this.normalSprite.setContentSize(size.width, size.height);
        this.selectedSprite.setContentSize(size.width, size.height);
        this.disabledSprite.setContentSize(size.width, size.height);

        var normalLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), NJ.fontSizes.buttonMedium);
        normalLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        var selectedLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), NJ.fontSizes.buttonMedium);
        selectedLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        var disabledLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), NJ.fontSizes.buttonMedium);
        disabledLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        this.normalSprite.addChild(normalLabel, 1);
        this.selectedSprite.addChild(selectedLabel, 1);
        this.disabledSprite.addChild(disabledLabel, 1);

        this._super(this.normalSprite, this.selectedSprite, this.disabledSprite, callback, target);
    },

    setImageRes: function(res) {
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
    }
});