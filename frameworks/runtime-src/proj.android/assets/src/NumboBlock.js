/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = (function() {

    var _backgroundScale = null;
    var _labelScale = null;

    return cc.Sprite.extend({
        // exposed public properties

        // Display
        _backgroundSprite: null,
        _highlightSprite: null,
        _valueLabel: null,

        // block properties
        col: -1,
        row: -1,
        val: -1,

        isFalling: false,

        ////////////////////
        // Initialization //
        ////////////////////

        ctor: function(blockSize) {
            this._super();

            this.setContentSize(blockSize.width, blockSize.height);

            this.setTag(NJ.tags.PAUSABLE);

            this._backgroundSprite = new cc.Sprite(res.blockImage);

            // if first block initialize backgroundSize
            if(!_backgroundScale) {
                var _backgroundSize = this._backgroundSprite.getContentSize();
                _backgroundScale = {
                    x: blockSize.width / _backgroundSize.width,
                    y: blockSize.height / _backgroundSize.height
                }
            }

            this._backgroundSprite.setScale(_backgroundScale.x, _backgroundScale.y);
            this._backgroundSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this.addChild(this._backgroundSprite, -2);

            // initialize highlight
            this._highlightSprite = new cc.Sprite(res.blockImage);
            this._highlightSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2,
                visible: false
            });
            this.addChild(this._highlightSprite, -1);

            // initialize number label
            this._valueLabel = new cc.LabelBMFont("label test", b_getFontName(res.mainFont));
            this._valueLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
            if(!_labelScale) {
                var imageSize = this._valueLabel.getContentSize();
                _labelScale = {
                    x: blockSize.height * 0.75 / imageSize.height,
                    y: blockSize.height * 0.75 / imageSize.height
                }
            }
            this._valueLabel.setScale(_labelScale.x, _labelScale.y);
            this._valueLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this._valueLabel.setColor(cc.color("#ffffff"));
            this.addChild(this._valueLabel, 1);
        },

        // initialize block values
        init: function(colVal, rowVal, valVal) {
            this.col = colVal;
            this.row = rowVal;
            this.val = valVal;

            this._valueLabel.setString(this.val + '');

            this.updateTheme();
        },

        unuse: function () {
            this.col = 0;
            this.row = 0;
            this.val = 0;

            this.retain();//if in jsb

            this.setVisible(false);
            this.removeFromParent(true);
        },

        reuse: function () {
            this._backgroundSprite.setScale(_backgroundScale.x, _backgroundScale.y);
            this._valueLabel.setScale(_labelScale.x, _labelScale.y);
            this.setVisible(true);
        },

        //////////////////
        // Manipulation //
        //////////////////

        // immediatley removes the block
        // DO NOT call directly, use killblock in NumboLevel instead
        remove: function() {
            this.unuse();
        },

        // fade kill the block
        // mainly used for when killing the block no big deal
        // NOTE: DO NOT call directly
        fadeKill: function(clean) {
            var block = this;

            var delayAction = cc.delayTime(1.25);

            var removeAction = cc.callFunc(function() {
                cc.pool.putInPool(block);
            });

            this._highlightSprite.stopAllActions();
            this._highlightSprite.setVisible(false);

            this._backgroundSprite.runAction(cc.scaleBy(0.1, 0, 0));
            this._valueLabel.runAction(cc.scaleBy(0.1, 0, 0));
            this.runAction(cc.sequence(delayAction, removeAction));
        },

        // popKill the block
        // NOTE: DO NOT call directly, call kill block in NumboLevel instead
        popKill: function(clean) {
            var block = this;

            var delayAction = cc.delayTime(1.25);

            var removeAction = cc.callFunc(function() {
                cc.pool.putInPool(block);
            });

            this._highlightSprite.stopAllActions();
            this._highlightSprite.setVisible(false);

            this._backgroundSprite.runAction(cc.sequence(cc.scaleBy(0.15, 1.5, 1.5), cc.scaleBy(0.05, 0, 0)));
            this._valueLabel.runAction(cc.sequence(cc.scaleBy(0.15, 1.5, 1.5), cc.scaleBy(0.05, 0, 0)));
            this.runAction(cc.sequence(delayAction, removeAction));
        },

        // highlight the sprite indicating selection
        highlight: function(color) {
            var that = this;

            if(color)
                this._highlightSprite.setColor(color);

            this._highlightSprite.setVisible(true);
            this._highlightSprite.setOpacity(255);

            this._highlightSprite.setScale(_backgroundScale.x, _backgroundScale.y);

            this._highlightSprite.stopAllActions();
            this._highlightSprite.runAction(cc.scaleBy(0.3, 2, 2));
            this._highlightSprite.runAction(cc.sequence(cc.fadeTo(0.3, 0), cc.callFunc(function() {
                that._highlightSprite.setVisible(false);
            })));
        },

        jiggleSprite: function() {
            var upAction = cc.moveBy(0.1, cc.p(0, 10));
            var downAction = cc.moveBy(0.1, cc.p(0, -10));

            this.runAction(cc.sequence(upAction, downAction));
        },

        updateTheme: function() {
            var chosen = NJ.getColor(this.val - 1);
            chosen = chosen || cc.color("#ffffff");

            this._highlightSprite.setColor(chosen);

            this._backgroundSprite.setColor(chosen);
        }
    });
}());

NumboBlock.create = function (blockSize) {
    return new NumboBlock(blockSize);
};

NumboBlock.recreate = function (blockSize) {
    if (cc.pool.hasObject(NumboBlock)) {
        return cc.pool.getFromPool(NumboBlock);
    }

    return NumboBlock.create(blockSize);
};