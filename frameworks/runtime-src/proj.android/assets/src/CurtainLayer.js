var CurtainLayer = cc.Layer.extend({

    // UI Data
    levelOverLabel: null,
    totalLabel: null,
    roundLabel: null,

    lastScore: null,
    _levelBounds: null,
    drainingComplete: null,
    drainingPoints: null,
    _drainAmount: 0,
    timePerDrain: null,

    ctor: function(levelBounds) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._levelBounds = levelBounds;
        this.lastScore = 0;
        this.drainingComplete = false;
        this.drainingPoints = 0;
        this.timePerDrain = 0;

        this.animate();
    },

    animate: function() {
        this.removeAllChildren();

        var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
        var elementSize = cc.size(cc.visibleRect.width, refDim * NJ.uiSizes.sub);

        this.levelOverLabel = new cc.LabelBMFont("Level "+(NJ.gameState.getLevel()-1)+" Complete!", b_getFontName(res.mainFont));
        var spriteSize = this.levelOverLabel.getContentSize();
        this.levelOverLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
        this.levelOverLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height + 60
        });
        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 60));
        this.levelOverLabel.runAction(moveAction2);
        this.addChild(this.levelOverLabel, 6);

        this.totalLabel = new cc.LabelBMFont("Total Score: "+this.lastScore, b_getFontName(res.mainFont));
        this.totalLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
        this.totalLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height
        });
        var moveAction3 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4));
        this.totalLabel.runAction(moveAction3);
        this.addChild(this.totalLabel, 6);

        this.roundLabel = new cc.LabelBMFont("Round Score: "+(NJ.gameState.getScore()-this.lastScore), b_getFontName(res.mainFont));
        this.roundLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
        this.roundLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 - this._levelBounds.height + 30
        });
        var moveAction4 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 30));
        this.roundLabel.runAction(moveAction4);
        this.addChild(this.roundLabel, 6);

        //this.lastScore = NJ.gameState.getScore();
    },

    initDrain: function() {
        this.drainingPoints = NJ.gameState.getScore() - this.lastScore;
        this._drainAmount = Math.ceil(this.drainingPoints * 0.025);
        this.drainingComplete = false;
        this.timePerDrain = 0.025;
    },

    drainPoints: function() {
        this.drainingPoints = Math.max(0, this.drainingPoints - this._drainAmount);
        this.lastScore = Math.min(NJ.gameState.getScore(), this.lastScore + this._drainAmount);
        this.totalLabel.setString("Total Score: " + this.lastScore);
        this.roundLabel.setString("Round Score: " + this.drainingPoints);

        if (NJ.settings.sounds)
            cc.audioEngine.playEffect(res.coinSound);

        if (this.drainingPoints == 0)
            this.drainingComplete = true;
    },

    isDrainingComplete: function() {
        return this.drainingComplete;
    },

    getTimePerDrain: function() {
        return this.timePerDrain;
    }
});