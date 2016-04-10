var CurtainLayer = cc.Layer.extend({

    drawNode: null,
    levelOverLabel: null,
    continueButton: null,
    readyToContinue: null,
    _levelBounds: null,

    ctor: function(levelBounds) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._levelBounds = levelBounds;

        this.animate();
    },

    animate: function() {
        this.removeAllChildren();

        this.drawNode = cc.DrawNode.create();
        this.drawNode.drawRect(cc.p(this._levelBounds.x, this._levelBounds.y-this._levelBounds.height),
            cc.p(this._levelBounds.x+this._levelBounds.width, this._levelBounds.y),
            cc.color(255, 0, 0, 230), 2, cc.color(255, 255, 255, 255));

        var moveAction = cc.moveTo(1, cc.p(0, this._levelBounds.height));
        this.drawNode.runAction(moveAction);
        this.addChild(this.drawNode, 5);

        this.levelOverLabel = cc.LabelTTF.create("Level "+NJ.gameState.getLevel()+" Complete!", b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
        this.levelOverLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height
        });
        //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelOverLabel.setColor(cc.color("#ffffff"));
        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4));
        this.levelOverLabel.runAction(moveAction2);
        this.addChild(this.levelOverLabel, 6);
    }
});