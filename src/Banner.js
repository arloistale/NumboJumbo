/**
 * Created by jonathanlu on 2/11/16.
 */

var Banner = cc.Sprite.extend({
    feedbackText: [],
    bannerLabel: null,

    ctor: function() {
        this._super();

        this.setCascadeOpacityEnabled(true);

        this.bannerLabel = new cc.LabelTTF("", b_getFontName(res.markerFont), 72);
        this.bannerLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });

        this.bannerLabel.enableStroke(cc.color(0, 0, 255, 0.75*255), 1);
        this.bannerLabel.setColor(cc.color(255, 255, 255, 0.75*255));

        this.addChild(this.bannerLabel);
    },

    launchWithText: function(text) {
        this.bannerLabel.setString(text);
    },

    clearText: function(){
        this.bannerLabel.setString("");
    }
});

Banner.presentations = {
    NORMAL: 0,
    EXPLODE: 1
};