var CurtainLayer = cc.Layer.extend({
    levelOverLabel: null,
    totalLabel: null,
    lastScore: null,
    _levelBounds: null,

    ctor: function(levelBounds) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._levelBounds = levelBounds;
        this.lastScore = 0;

        this.animate();
    },

    animate: function() {
        this.removeAllChildren();

        this.levelOverLabel = cc.LabelTTF.create("Level "+(NJ.gameState.getLevel()-1)+" Complete!", b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
        this.levelOverLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height + 60
        });
        //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelOverLabel.setColor(cc.color("#ffffff"));
        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 60));
        this.levelOverLabel.runAction(moveAction2);
        this.addChild(this.levelOverLabel, 6);

        this.totalLabel = cc.LabelTTF.create("Total Score: "+NJ.gameState.getScore(), b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
        this.totalLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height + 30
        });
        //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.totalLabel.setColor(cc.color("#ffffff"));
        var moveAction3 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 30));
        this.totalLabel.runAction(moveAction3);
        this.addChild(this.totalLabel, 6);

        this.roundLabel = cc.LabelTTF.create("Round Score: "+(NJ.gameState.getScore()-this.lastScore), b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);
        this.roundLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height
        });
        //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.roundLabel.setColor(cc.color("#ffffff"));
        var moveAction4 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4));
        this.roundLabel.runAction(moveAction4);
        this.addChild(this.roundLabel, 6);

        this.lastScore = NJ.gameState.getScore();
    }
});