/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = cc.Sprite.extend({
    backgroundSprite: null,
    highlightSprite: null,
    valueLabel: null,

    col: -1,
    row: -1,

    val: -1,

    powerup: false,

    ctor: function(blockSize) {
        this._super();

        this.setContentSize(blockSize.width, blockSize.height);

        this.setTag(NJ.tags.PAUSABLE);

        this.backgroundSprite = new cc.Sprite(res.blockImage);
        this.backgroundSprite.setScale(blockSize.width / this.backgroundSprite.getContentSize().width, blockSize.height / this.backgroundSprite.getContentSize().height);
        this.backgroundSprite.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: blockSize.width / 2,
            y: blockSize.height / 2
        });
        this.addChild(this.backgroundSprite, -2);

        this.highlightSprite = new cc.Sprite(res.glowImage);
        this.highlightSprite.setScale(blockSize.width / this.highlightSprite.getContentSize().width * 1.1, blockSize.height / this.highlightSprite.getContentSize().height * 1.1);
        this.highlightSprite.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: blockSize.width / 2,
            y: blockSize.height / 2,
            visible: false
        });
        this.addChild(this.highlightSprite, -1);
	
        this.valueLabel = cc.LabelTTF.create("label test", b_getFontName(res.markerFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
        this.valueLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: blockSize.width / 2,
            y: blockSize.height / 2
        });
	    this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.valueLabel.setColor(cc.color(255, 255, 255, 255));

        this.addChild(this.valueLabel);
    },

    // initialize block values
    init: function(col, row, val, powerup) {
        this.col = col;
        this.row = row;
        this.val = val;
        this.powerup = powerup;

        this.valueLabel.setString(val + "");

        if (this.powerup){
            this.backgroundSprite.setTexture(res.powerupImage);
            this.schedule(this.removePowerUp, 5);
        }
    },

    removePowerUp: function(){
        this.powerup = false;
        this.backgroundSprite.setTexture(res.blockImage);
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