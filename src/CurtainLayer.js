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
    drawNode: null,
    boxProg: 0,
    curtainComplete: null,

    ctor: function(levelBounds) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._levelBounds = levelBounds;
        this.lastScore = 0;
        this.drainingComplete = false;
        this.drainingPoints = 0;
        this.timePerDrain = 0;

        this.curtainComplete = false;

        this.boxProg = 0;
        this.drawNode = new cc.DrawNode.create();
        this.addChild(this.drawNode, 0);

        this.initLabels();
    },

    initLabels: function() {

        //this.lastScore = 0;
        this.drainingComplete = false;
        this.drainingPoints = 0;
        this.timePerDrain = 0;

        this.curtainComplete = false;

        this.boxProg = 0;

        //this.levelOverLabel = cc.LabelTTF.create("Level "+(NJ.gameState.getLevel()-1)+" Complete!", b_getFontName(res.mainFont), NJ.fontScalingFactor * NJ.fontSizes.numbo);

        var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
        var elementSize = cc.size(cc.visibleRect.width, refDim * NJ.uiSizes.sub);

        this.levelOverLabel = new cc.LabelBMFont("Level "+(NJ.gameState.getLevel()-1)+" Complete!", b_getFontName(res.mainFont));
        var spriteSize = this.levelOverLabel.getContentSize();
        this.levelOverLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);

        this.levelOverLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 + this._levelBounds.height + 60
        });

        this.levelOverLabel.setColor(cc.color("#ffffff"));

        //var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 60));
        //this.levelOverLabel.runAction(moveAction2);

        this.addChild(this.levelOverLabel, 6);

        this.totalLabel = new cc.LabelBMFont("Total Score: "+this.lastScore, b_getFontName(res.mainFont));
        this.totalLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
        this.totalLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 + this._levelBounds.height
        });

        this.totalLabel.setColor(cc.color("#ffffff"));
        //var moveAction3 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4));
        //this.totalLabel.runAction(moveAction3);

        //var moveAction3 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4));
        //this.totalLabel.runAction(moveAction3);

        this.addChild(this.totalLabel, 6);

        this.roundLabel = new cc.LabelBMFont("Round Score: "+(NJ.gameState.getScore()-this.lastScore), b_getFontName(res.mainFont));
        this.roundLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
        this.roundLabel.attr({
            anchorX: .5,
            anchorY: .5,
            x: this._levelBounds.x + this._levelBounds.width/2,
            y: this._levelBounds.y + this._levelBounds.height/4 + this._levelBounds.height + 30
        });

        //this.valueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.roundLabel.setColor(cc.color("#ffffff"));
        //var moveAction4 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 30));
        //this.roundLabel.runAction(moveAction4);

        //var moveAction4 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/4 + 30));
        //this.roundLabel.runAction(moveAction4);

        this.addChild(this.roundLabel, 6);
    },

    animate: function() {
        this.lastScore = NJ.gameState.getScore();
        this.schedule(this.incrementBox,.5);
    },

    initDrain: function() {
        this.drainingPoints = NJ.gameState.getScore() - this.lastScore;
        this._drainAmount = Math.ceil(this.drainingPoints * 0.025);
        this.drainingComplete = false;
        this.timePerDrain = 0.025;
    },

    incrementBox: function() {cc.log("increment");
        this.boxProg = Math.min(this.boxProg +.02, 1);
        this.unschedule(this.incrementBox);
        if(this.boxProg == 1) {
            this.schedule(this.showLevelComplete, 1);
        }
        else {
            this.schedule(this.incrementBox,0.01);
        }
        this.drawBox();
    },

    decrementBox: function() {
        this.boxProg = Math.max(this.boxProg -.02, 0);
        this.unschedule(this.decrementBox);
        if(this.boxProg == 0) {
            this.schedule(this.readySpawn,.01);
        }
        else {
            this.schedule(this.decrementBox,.01);
        }
        this.drawBox();
    },

    readySpawn: function() {
        this.curtainComplete = true;
    },

    isCurtainComplete: function() {
        return this.curtainComplete;
    },


    showLevelComplete: function() {
        var moveAction = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/2 ));
        var delayAction = cc.delayTime(1.2);
        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y - this._levelBounds.height/4));
        var transAction = cc.callFunc(this.showScore, this);
        this.levelOverLabel.runAction(cc.sequence(moveAction, delayAction, moveAction2, transAction));
    },

    showScore: function() {
        this.levelOverLabel.removeFromParent(true);

        var moveAction = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/2));
        var transAction = cc.callFunc(this.initCurtainDrain, this);
        var pauseAction = cc.delayTime(1);
        var transAction2 = cc.callFunc(this.removeScore, this);
        var decBoxAction = cc.callFunc(this.decrementBox, this);
        this.totalLabel.runAction(cc.sequence(moveAction, pauseAction, transAction, pauseAction, transAction2, pauseAction, decBoxAction));

        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y + this._levelBounds.height/2 + 30));
        this.roundLabel.runAction(moveAction2);
    },

    removeScore: function() {
        var moveAction = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y - 2*this._levelBounds.height/4));
        this.totalLabel.runAction(moveAction);
        var moveAction2 = cc.moveTo(1, cc.p(this._levelBounds.x+this._levelBounds.width/2, this._levelBounds.y - 2*this._levelBounds.height/4));
        this.roundLabel.runAction(moveAction2);
    },

    initCurtainDrain: function() {
        this.initDrain();
        this.unschedule(this.initCurtainDrain);
        this.schedule(this.drainCurtainPoints, this.getTimePerDrain());
    },

    drainCurtainPoints: function() {cc.log("drainCurtainPoints");
        this.unschedule(this.drainCurtainPoints);
        this.drainPoints();
        /*
        if(this.isDrainingComplete()) {
            this.unschedule(this.drainCurtainPoints);
            this.schedule(this.decrementBox, 1);
        }
        else this.schedule(this.drainCurtainPoints, this._curtainLayer.getTimePerDrain());
        */
    },

    drawBox: function() {
        this.drawNode.clear();

        this.drawNode.drawPoly([cc.p(this._levelBounds.x, this._levelBounds.y), cc.p(this._levelBounds.x + this._levelBounds.width, this._levelBounds.y),
                cc.p(this._levelBounds.x + this._levelBounds.width, this._levelBounds.y + this.boxProg*this._levelBounds.height), cc.p(this._levelBounds.x, this._levelBounds.y + this.boxProg*this._levelBounds.height)],
            cc.color(0, 0, 0, 200), 0, cc.color(255, 255, 255, 255));

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