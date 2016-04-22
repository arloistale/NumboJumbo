/**

Created by jonathanlu on 1/10/16.

Definition for falling blocks.

*/

var NumboBlock = (function() {

    var _backgroundScale = null;

    var blink = function() {
        this._colorIndex += 1;
        var blockSize = this.getContentSize();
        this._colorIndex %= NJ.purpleColors.length;
        // TODO: Use shaders here!!!!
        this._circleNode.setDrawColor(NJ.purpleColors[this._colorIndex]);
        this._circleNode.drawCircle(cc.p(blockSize.width / 2, blockSize.height / 2), blockSize.width / 2, 0, 8, false, 1);
    };

    return cc.Sprite.extend({
        // exposed public properties

        // Display
        _backgroundSprite: null,
        _circleNode: null,
        _highlightSprite: null,
        _valueLabel: null,

        // internal particle system
        _particleSystem: null,

        // block properties
        _colorIndex: 0,

        powerup: false,

        col: -1,
        row: -1,
        val: -1,

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
                _backgroundSize = this._backgroundSprite.getContentSize();
                _backgroundScale = {
                    x: blockSize.width / _backgroundSize.width * 1.2,
                    y:blockSize.height / _backgroundSize.height * 1.2
                }
            }

            this._backgroundSprite.setScale(_backgroundScale.x, _backgroundScale.y);
            this._backgroundSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this._backgroundSprite.retain();

            this._circleNode = cc.DrawNode.create();
            this._circleNode.retain();

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
            this._valueLabel = cc.LabelTTF.create("label test", b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
            this._valueLabel.attr({
                scale: 1.0 / NJ.fontScalingFactor,
                anchorX: 0.5,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: blockSize.width / 2,
                y: blockSize.height / 2
            });
            this._valueLabel.setColor(cc.color("#ffffff"));
            this.addChild(this._valueLabel, 1);
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

            if (this.powerup == 'clearAndSpawn') {
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(0, 255, 255, 255), 1);
                this._valueLabel.setColor(cc.color(255, 0, 0));
            }
            if (this.powerup == 'changeJumbo') {
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(0, 255, 255), 1);
                this._valueLabel.setColor(cc.color(0, 255, 255));
            }
            if (this.powerup == 'bonusOneMania') {
                this.schedule(this.removePowerUp, 10);
                this._valueLabel.enableStroke(cc.color(255, 255, 255), 1);
                this._valueLabel.setColor(cc.color(0, 255, 0));
            }

            this.updateTheme();

            this._particleSystem = new cc.ParticleExplosion();
            this.addChild(this._particleSystem, -3); // behind UI elements
            this.initParticleSystem();
        },

        //////////////////////////////////////
        // block's internal particle system //
        //////////////////////////////////////
        initParticleSystem:function(){
            var texture = cc.textureCache.addImage(res.blockImage);
            this._particleSystem.setTexture(texture);
            //this._particleSystem.setParticleCount(10);
            this._particleSystem.setStartSize(10);
            this._particleSystem.setEmissionRate(100);
            this._particleSystem.setEndSize(3);
            this._particleSystem.setPosition(this.width/2, this.height/2);
            this._particleSystem.setStartColor(this._backgroundSprite.getColor());
            this._particleSystem.setStartColorVar(this._backgroundSprite.getColor());
            this._particleSystem.setEndColor(this._backgroundSprite.getColor());
            this._particleSystem.setEndColorVar(this._backgroundSprite.getColor());
            this._particleSystem.setPositionType(1);
            this._particleSystem.setRadialAccel(-60);
            this._particleSystem.setLife(0.5);
            this._particleSystem.setLifeVar(0.1);

            this._particleSystem.stopSystem();
            this._particleSystem.setVisible(false);
        },

        //////////////////
        // Manipulation //
        //////////////////

        removePowerUp: function() {
            this.powerup = false;
            this.unschedule(this.blink);
            this.clearHighlight();
            this._valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            this._valueLabel.setColor(cc.color(255, 255, 255));
        },

        updateParticleSystem: function(){
            this._particleSystem.setPosition (this.x, this.y);
        },

        // kill the block
        // NOTE: DO NOT call directly, call kill block in NumboLevel instead
        kill: function() {
            var block = this;

            var delayAction = cc.delayTime(1.25);

            var removeAction = cc.callFunc(function() {
                block.removeFromParent(true);
            });

            var startParticleAction = cc.callFunc(function() {
                block._particleSystem.setVisible(true);
                block._particleSystem.resetSystem();
            });

            this._highlightSprite.stopAllActions();
            this._highlightSprite.setVisible(false);

            this._backgroundSprite.runAction(cc.sequence(cc.scaleBy(0.15, 1.5, 1.5), cc.scaleBy(0.05, 0, 0)));
            this._valueLabel.runAction(cc.sequence(cc.scaleBy(0.15, 1.5, 1.5), cc.scaleBy(0.05, 0, 0)));
            this.runAction(cc.sequence(startParticleAction, delayAction, removeAction));
        },

        // highlight the sprite indicating selection
        highlight: function(color) {

            var that = this;

            if(color)
                this._highlightSprite.setColor(color);

            this._highlightSprite.setVisible(true);
            this._highlightSprite.setOpacity(212);

            this._highlightSprite.setScale(_backgroundScale.x, _backgroundScale.y);

            this._highlightSprite.runAction(cc.scaleBy(0.25, 2, 2));
            this._highlightSprite.runAction(cc.sequence(cc.fadeTo(0.25, 0), cc.callFunc(function() {
                that._highlightSprite.setVisible(false);
            })));
        },

        jiggleSprite: function() {
            var scaleDownAction = cc.scaleTo(0.2, 0.5);
            var scaleUpAction = cc.scaleTo(0.2, 1);

            this.runAction(cc.sequence(scaleDownAction, scaleUpAction, scaleDownAction, scaleUpAction));
        },

        updateTheme: function() {
            var blockSize = this.getContentSize();

            var isFilled = NJ.themes.isBlocksFilled;
            var strokeType = NJ.themes.strokeType;

            var chosen = NJ.getColor(NJ.gameState.getJumbo().blockColorString, this.val - 1);
            chosen = chosen || cc.color("#ffffff");

            this._highlightSprite.setColor(chosen);

            if(isFilled) {
                if(this.children.indexOf(this._backgroundSprite) < 0)
                    this.addChild(this._backgroundSprite, -2);

                this._backgroundSprite.setColor(chosen);
            } else {
                this.removeChild(this._backgroundSprite);
            }

            if(strokeType != NJ.themes.strokeTypes.none) {
                if(this.children.indexOf(this._circleNode) < 0)
                    this.addChild(this._circleNode, -1);

            } else {
                this.removeChild(this._circleNode);
            }

            this._circleNode.clear();

            switch(strokeType) {
                case NJ.themes.strokeTypes.circle:
                    this._circleNode.drawCircle(cc.p(blockSize.width / 2, blockSize.height / 2), blockSize.width / 2, 0, 100, false, 5, chosen);
                    break;
                case NJ.themes.strokeTypes.geometric:
                    this._circleNode.drawCircle(cc.p(blockSize.width / 2, blockSize.height / 2), blockSize.width / 2, 0, 8, false, 5, chosen);
                    break;
            }
        }
    });
}());