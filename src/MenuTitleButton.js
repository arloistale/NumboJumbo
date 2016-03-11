/**
 * Created by jonathanlu on 2/22/16.
 */

var MenuTitleButton = cc.MenuItemSprite.extend({
    normalLabel: null,
    selectedLabel: null,
    disabledLabel: null,

    normalSprite: null,
    selectedSprite: null,
    disabledSprite: null,

    // assumes title is defined
    ctor: function(title, callback, target) {
        cc.assert(title && title.length, "Menu Button must have a title");

        var size = cc.size(NJ.fontSizes.buttonMedium / NJ.fontScalingFactor * title.length + 10, NJ.fontSizes.buttonMedium + 10);

        this.normalSprite = new cc.Sprite();
        this.selectedSprite = new cc.Sprite();
        this.disabledSprite = new cc.Sprite();

        this.normalSprite.setContentSize(size.width, size.height);
        this.selectedSprite.setContentSize(size.width, size.height);
        this.disabledSprite.setContentSize(size.width, size.height);

        this.normalLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
        this.normalLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        this.selectedLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
        this.selectedLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        this.disabledLabel = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontScalingFactor*NJ.fontSizes.buttonMedium);
        this.disabledLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: size.width / 2,
            y: size.height / 2
        });

        this.normalSprite.addChild(this.normalLabel, 1);
        this.selectedSprite.addChild(this.selectedLabel, 1);
        this.disabledSprite.addChild(this.disabledLabel, 1);

        this._super(this.normalSprite, this.selectedSprite, this.disabledSprite, callback, target);
    },

    setTitle: function(title) {
        this.normalLabel.setString(title);
        this.selectedLabel.setString(title);
        this.disabledLabel.setString(title);
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