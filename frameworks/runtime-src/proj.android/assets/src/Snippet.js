/**
 * Created by jonathanlu on 2/11/16.
 */

var Snippet = cc.Sprite.extend({
    _label: null,

    // the size determines the bounding area for the snippet
    ctor: function() {
        this._super();

        this.setName("Feedback");
        this.setTag(NJ.tags.PAUSABLE);

        this.setCascadeOpacityEnabled(true);

        // initialize feedback children
        this._label = new cc.LabelBMFont("Default Text", b_getFontName(res.mainFont), 0);
        var imageSize = this._label.getContentSize();
        this._label.setColor(cc.color(255, 255, 255, 255));

        this.addChild(this._label, 1);

        this.reset();
    },

    reset: function() {
        this.attr({
            opacity: 255
        });

        this._label.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
    },

    setLabelSize: function(size) {
        if(typeof size === 'number')
            size = cc.size(cc.visibleRect.width, size);

        var imageSize = this.getContentSize();
        this._label.setScale(size.height / imageSize.height, size.height / imageSize.height);

        this.setContentSize(this._label.getContentSize());

        this.reset();
    },

    setColor: function(color) {
        this._label.setColor(color);
    },

    setText: function(text) {
        this._label.setString(text);
    },

    clearText: function(){
        this._label.setString("");
    }
});