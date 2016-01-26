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

        this.attr({
            scale: 1.2
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

	
        this.valueLabel = new cc.LabelTTF("label test", b_getFontName(res.markerFontTTF), 32);
        this.valueLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });

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
        var fadeAction = cc.FadeTo.create(0.2);
        var removeAction = cc.CallFunc.create(function() {
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