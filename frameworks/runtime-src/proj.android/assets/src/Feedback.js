/**
 * Created by jonathanlu on 2/16/16.
 */

var Feedback = cc.Sprite.extend({

    label: null,

    ctor: function() {
        this._super();

        this.setName("Feedback");
        this.setTag(NJ.tags.PAUSABLE);

        this.setCascadeOpacityEnabled(true);

        // initialize feedback children
        this.label = new cc.LabelTTF("", b_getFontName(res.markerFont), 0);

        this.label.enableStroke(cc.color(0, 0, 0, 255), 1);
        this.label.setColor(cc.color(255, 255, 255, 255));

        this.addChild(this.label);

        this.reset();
    },

    reset: function() {
        this.attr({
            scale: 1.0,
            opacity: 255
        });
                                
        this.label.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
    },

    setText: function(text) {
        this.label.setString(text);
    },

    clearText: function(){
        this.label.setString("");
    }
});