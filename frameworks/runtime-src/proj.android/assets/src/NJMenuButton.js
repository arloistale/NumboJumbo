/**
 * Created by jonathanlu on 4/26/16.
 */

var NJMenuButton = NJMenuItem.extend({


    // Highlight Data
    _highlightSprite: null,
    _highlightScale: null,

    _isHighlightEnabled: false,

    ctor: function(size, callback, target) {
        this._super(size, callback, target);

        this.setBackgroundImage(res.blockImage);

        this.setEnabled(true);

        this._highlightSprite = new cc.Sprite(res.blockImage);
        // initialize highlight scales
        var highlightSize = this._highlightSprite.getContentSize();
        this._highlightScale = {
            x: size.width / highlightSize.width,
            y: size.height / highlightSize.height
        };

        this._highlightSprite.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2,
            visible: false
        });

        this.addChild(this._highlightSprite, -1);
    },

    /////////////////////
    // Highlight Logic //
    /////////////////////

    // Assumes that we get a boolean for the flag
    enableHighlight: function(flag) {
        this._isHighlightEnabled = flag;
    },

    setHighlightColor: function(color) {
        if(color)
            this._highlightSprite.setColor(color);
    },

    // highlight the sprite indicating selection
    highlight: function() {
        var that = this;

        this._highlightSprite.setVisible(true);
        this._highlightSprite.setOpacity(255);

        this._highlightSprite.setScale(this._highlightScale.x, this._highlightScale.y);

        this._highlightSprite.stopAllActions();
        this._highlightSprite.runAction(cc.scaleBy(0.3, 2, 2));
        this._highlightSprite.runAction(cc.sequence(cc.fadeTo(0.3, 0), cc.callFunc(function() {
            that._highlightSprite.setVisible(false);
        })));
    },

    ///////////////
    // Overrides //
    ///////////////

    selected: function() {
        this._super();

        if(this._isHighlightEnabled)
            this.highlight(cc.color(255, 255, 255, 255));
    }
});