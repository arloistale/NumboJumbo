/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = (function() {

    var blink = function() {
        this._colorIndex += 1;
        this._colorIndex %= NJ.purpleColors.length;
        this._backgroundSprite.setColor(NJ.purpleColors[this._colorIndex]);
    };

    return cc.Sprite.extend({
        // exposed public properties

        // Display
        _circleNode: null,
        _highlightSprite: null,
        _valueLabel: null,

        // block properties
        _colorIndex: 0,

        powerup: false,

        col: -1,
        row: -1,
        val: -1,

        ctor: function(blockSize) {
            this._super();

            this.setContentSize(blockSize.width, blockSize.height);

            this.setTag(NJ.tags.PAUSABLE);

            /*
            this._backgroundSprite = new cc.Sprite(res.blockImage);
            this._backgroundSprite.setScale(blockSize.width / backgroundSize.width, blockSize.height / backgroundSize.height);
            this._backgroundSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this.addChild(this._backgroundSprite, -2);
*/
            this._circleNode = cc.DrawNode.create();
            this._circleNode.drawCircle(cc.p(blockSize.width / 2, blockSize.height / 2), blockSize.width / 2, 0, 100, false, 2, cc.color("#ffffff"));
            this.addChild(this._circleNode, -2);

            // initialize highlight
            this._highlightSprite = new cc.Sprite(res.glowImage);
            var highlightSize = this._highlightSprite.getContentSize();
            this._highlightSprite.setScale(blockSize.width / highlightSize.width * 1.1, blockSize.height / highlightSize.height * 1.1);
            this._highlightSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2,
                visible: false
            });
            this.addChild(this._highlightSprite, -1);

            // initialize number label
            this._valueLabel = cc.LabelTTF.create("label test", b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
            this._valueLabel.attr({
                scale: 1.0 / NJ.fontScalingFactor,
                anchorX: 0.5,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            this._valueLabel.setColor(cc.color("#ffffff"));

            this.addChild(this._valueLabel);
        },

        // initialize block values
        init: function(colVal, rowVal, valVal, powerupVal) {
            this.col = colVal;
            this.row = rowVal;
            this.val = valVal;
            this.powerup = powerupVal;

            this._valueLabel.setString(this.val + "");

            if (this.powerup) {
                this.schedule(blink.bind(this), 0.05);
            }

            if (this.powerup == 'clearAndSpawn'){
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(0, 255, 255, 255), 1);
                this._valueLabel.setColor(cc.color(255, 0, 0));
            }
            if (this.powerup == 'changeJumbo'){
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(0, 255, 255), 1);
                this._valueLabel.setColor(cc.color(0, 255, 255));
            }
            if (this.powerup == 'bonusOneMania') {
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(255, 255, 255), 1);
                this._valueLabel.setColor(cc.color(0, 255, 0));
            }

            var colors = [
                cc.color("#228DFF"),
                cc.color("#FF0092"),
                cc.color("#BA01FF"),
                cc.color("#FFCA1B")
            ];

            var size = this.getContentSize();
            //var chosen = NJ.getColor(NJ.gameState.getJumbo().highscoreThreshold, 1);
            var chosen = NJ.getColor(NJ.gameState.getJumbo().blockColorString, this.val);
            //var chosen = colors[Math.floor(Math.max(0, (this.val - 1)) % colors.length)];
            this._circleNode.clear();
            this._circleNode.drawCircle(cc.p(size.width / 2, size.height / 2), size.width / 2 * 0.7, 0, 8, false, 5, chosen);
        },

        removePowerUp: function() {
            this.powerup = false;
            this.unschedule(this.blink);
            this.clearHighlight();
            this._valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            this._valueLabel.setColor(cc.color(255, 255, 255));
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
            this._highlightSprite.setColor(color);
            if(!this._highlightSprite.isVisible())
                this._highlightSprite.setVisible(true);
        },

        // clear sprite highlight
        clearHighlight: function() {
            this._highlightSprite.setVisible(false);
        },

        jiggleSprite: function() {
            var scaleDownAction = cc.scaleTo(0.2, 0.5);
            var scaleUpAction = cc.scaleTo(0.2, 1.0);

            this.runAction(cc.sequence(scaleDownAction, scaleUpAction, scaleDownAction, scaleUpAction));
        }
    });
}());