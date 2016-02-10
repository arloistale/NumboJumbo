/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = cc.Sprite.extend({
    highlightSprite: null,
    valueLabel: null,

    col: -1,
    row: -1,

    val: -1,

    bHasDropped: false,

    ctor: function() {
        this._super(res.blockImage);

        this.setTag(NJ.tags.BLOCK);

        this.attr({
            scale: 1.5
        });

        this.highlightSprite = cc.Sprite.createWithTexture(cc.textureCache.addImage(res.glowImage));
        this.highlightSprite.attr({
            scale: 1.8,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2,
            visible: false
        });
        this.addChild(this.highlightSprite, -1);
	
        this.valueLabel = cc.LabelTTF.create("label test", b_getFontName(res.markerFont), 32);
        this.valueLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
	this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 2);
        this.valueLabel.setColor(cc.color(255, 255, 255, 255));

        this.addChild(this.valueLabel);
    },

    // initialize block values
    init: function(col, row, val) {
        this.col = col;
        this.row = row;
        this.val = val;

        this.bHasDropped = false;

        this.valueLabel.setString(val + "");
    },

    // kill the block
    // NOTE: DO NOT call directly, call kill block in NumboLevel instead
    kill: function() {
        var block = this;
        var fadeAction = cc.fadeTo(0.2, 0);
        var removeAction = cc.callFunc(function() {
            block.removeFromParent(true);
        });
        this.stopAllActions();
        this.runAction(cc.sequence(fadeAction, removeAction));
    },

    // highlight the sprite indicating selection
    highlight: function(color) {
        this.highlightSprite.setColor(color);
        if(!this.highlightSprite.isVisible())
            this.highlightSprite.setVisible(true);
    },

    // clear sprite highlight
    clearHighlight: function() {
        this.highlightSprite.setVisible(false);
    }
});