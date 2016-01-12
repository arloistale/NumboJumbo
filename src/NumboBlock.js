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

        this.highlightSprite = cc.Sprite.createWithTexture(cc.textureCache.addImage(res.glowImage));
        this.highlightSprite.attr({
            visible: false
        });
        this.addChild(this.highlightSprite, -1);

        this.valueLabel = new cc.LabelTTF("label test", res.markerFontTTF, 32);
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
        this.runAction(
            cc.sequence(
                cc.fade(0.2),
                cc.callFunc(function() {
                    this.removeFromParentAndCleanup(true);
                })
            )
        );
    },

    // highlight the sprite indicating selection
    highlight: function(color) {
        highlightSprite.setColor(color);
        if(!highlightSprite.isVisible())
            highlightSprite.setVisible(true);
    },

    // clear sprite highlight
    clearHighlight: function() {
        highlightSprite.setVisible(false);
    }
});