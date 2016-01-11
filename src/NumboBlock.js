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
        this.highlightSprite = new cc.Sprite(res.blockImage);
        this.highlightSprite.attr({
            visible: false
        });
        this.addChild(highlightSprite, -1);

        this.valueLabel = new cc.LabelTTF("label test", "Arial", 10);
        this.valueLabel.attr({

        });
        this.addChild(valueLabel);
    },

    init: function(col, row, val) {
        this.col = col;
        this.row = row;
        this.val = val;

        this.bHasDropped = false;

        valueLabel.setString(val + "");
    }

    kill: function() {
        this.runAction(
            cc.sequence(
                cc.fade(0.2),
                cc.callFunc(function() {
                    this.removeFromParentAndCleanup(true);
                }
            )
        );
    },

    highlight: function(color) {
        highlightSprite.setColor(color);
        if(!highlightSprite.isVisible())
            highlightSprite.setVisible(true);
    },

    clearHighlight: function() {
        highlightSprite.setVisible(false);
    }
});