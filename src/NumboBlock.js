/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = (function() {

    var selectionColors = [
        cc.color("#0D0511"),
        cc.color("#000000"),
        cc.color("#1A0A22"),
        cc.color("#270F33"),
        cc.color("#351445"),
        cc.color("#421A56"),
        cc.color("#4F1F67"),
        cc.color("#5D2479"),
        cc.color("#6A298A"),
        cc.color("#772E9B"),
        cc.color("#8534AD"),
        cc.color("#9148B5"),
        cc.color("#9D5CBD"),
        cc.color("#A970C5"),
        cc.color("#B585CD"),
        cc.color("#C299D6"),
        cc.color("#CEADDE"),
        cc.color("#DAC2E6"),
        cc.color("#E6D6EE"),
        cc.color("#F2EAF6"),
        cc.color("#FFFFFF")
    ];

    var blink = function() {
        this._colorIndex += 1;
        this._colorIndex %= selectionColors.length;
        this._backgroundSprite.setColor(selectionColors[this._colorIndex]);
    };

    return cc.Sprite.extend({
        // exposed public properties

        // UI properties
        _backgroundSprite: null,
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

            this._backgroundSprite = new cc.Sprite(res.blockImage);
            var backgroundSize = this._backgroundSprite.getContentSize();
            this._backgroundSprite.setScale(blockSize.width / backgroundSize.width, blockSize.height / backgroundSize.height);
            this._backgroundSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this.addChild(this._backgroundSprite, -2);

            var outlineSprite = new cc.Sprite(res.blockImage);
            outlineSprite.setScale(blockSize.width / backgroundSize.width * 1.1, blockSize.height / backgroundSize.height * 1.1);
            outlineSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            //this.addChild(outlineSprite, -3);

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
                //this.backgroundSprite.setTexture(res.powerupImage);
                this.schedule(this.removePowerUp, 10);
                //this.valueLabel.enableStroke(cc.color(0, 255, 255, 255), 1);
                this._valueLabel.setColor(cc.color(255, 0, 0));
            }
            if (this.powerup == 'changeJumbo'){
                //this.backgroundSprite.setTexture(res.powerupImage);
                this.schedule(this.removePowerUp, 10);
                //this.valueLabel.enableStroke(cc.color(0, 255, 255), 1);
                this._valueLabel.setColor(cc.color(0, 255, 255));
            }

            var colors = [
                cc.color("#228DFF"),
                cc.color("#FF0092"),
                cc.color("#BA01FF"),
                cc.color("#FFCA1B")
            ];

            var chosen = colors[Math.floor(Math.max(0, (this.val - 1)) % colors.length)];
            this._backgroundSprite.setColor(chosen);
        },

        removePowerUp: function() {
            powerup = false;
            this.unschedule(blink.bind(this));
            this.clearHighlight();
            backgroundSprite.setTexture(res.blockImage);
            //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            valueLabel.setColor(cc.color(255, 255, 255));
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