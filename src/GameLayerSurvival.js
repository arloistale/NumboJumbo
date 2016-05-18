/**
 * Created by jonathanlu on 1/18/16.
 */

var SurvivalGameLayer = BaseGameLayer.extend({

    // time limit for minute madness
    _elapsedTimeLimit: 60,
    _spawnTime: 1.0,
    _curtainLayer: null,

    // domain of spawning
    _numberList: [
        { key: 1, weight: 100 },
        { key: 2, weight: 75 },
        { key: 3, weight: 50 },
        { key: 4, weight: 50 },
        { key: 5, weight: 50 }
    ],

    _thresholdNumbers: {
        "2": [{"key": 6, "weight": 20}],
        "3": [{"key": 7, "weight": 20}],
        "4": [{"key": 8, "weight": 20}],
        "5": [{"key": 9, "weight": 20}],
        "6": [{"key": 10, "weight": 20}],
        "7": [{"key": 11, "weight": 20}],
        "8": [{"key": 12, "weight": 20}],
        "9": [{"key": 13, "weight": 20}],
        "10": [{"key": 14, "weight": 20}],
        "11": [{"key": 15, "weight": 20}],
        "12": [{"key": 16, "weight": 20}],
        "13": [{"key": 17, "weight": 10}],
        "14": [{"key": 18, "weight": 10}],
        "15": [{"key": 19, "weight": 10}],
        "16": [{"key": 20, "weight": 10}],
        "17": [{"key": 21, "weight": 10}],
        "18": [{"key": 22, "weight": 10}],
        "19": [{"key": 23, "weight": 10}],
        "20": [{"key": 24, "weight": 10}],
        "21": [{"key": 25, "weight": 10}],
        "22": [{"key": 26, "weight": 10}],
        "23": [{"key": 27, "weight": 10}],
        "24": [{"key": 28, "weight": 10}],
        "25": [{"key": 29, "weight": 10}],
        "26": [{"key": 30, "weight": 10}]
    },

    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        var that = this;

        this._numboController.initDistribution(this._numberList, this._thresholdNumbers);

        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
            // cause UI elements to fall in
            that._numboHeaderLayer.enter();
            that._toolbarLayer.enter();
        }), cc.delayTime(0.5), cc.callFunc(function() {

            // spawn blocks until the board is 1/3 full initially fill the board with blocks initially
            that.spawnInitialBlocks();
        })));
    },

    _getSpawnTime: function() {
        // nonlinear level-based variable
        var L = NJ.gameState.getLevel();
        var exponent = 0.3;
        var LFactor = 1 / Math.pow(L, exponent);

        // linear blocks-cleared-this-level factor
        var BFactor = 1 - NJ.gameState.getLevelupProgress() / 3;

        var spawnTime = 1.5 * LFactor * BFactor;
        return spawnTime;
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.backgroundTrack;
    },

    _initGeometry: function() {
        this._super();
        // curtain layer between levels
        this._curtainLayer = new CurtainLayer(this._levelBounds);
    },

    /////////////////////////
    // Game State Handling //
    /////////////////////////

    onGameOver: function() {
        this._super();

        var that = this;

        NJ.stats.addCurrency(NJ.gameState.getScore());

        var key = NJ.modekeys.infinite;
        var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());
        var highlevelAccepted = NJ.stats.offerHighlevel(key, NJ.gameState.getLevel());

        if(highscoreAccepted)
            NJ.social.submitScore(key, NJ.stats.getHighscore(key));

        if(highlevelAccepted)
            NJ.social.submitLevel(key, NJ.stats.getHighlevel(key));

        NJ.stats.save();

        // first send the analytics for the current game session
        NJ.sendAnalytics("Default");

        this.runAction(cc.sequence(cc.callFunc(function() {
            that._numboHeaderLayer.leave();
            that._toolbarLayer.leave();
        }), cc.delayTime(2), cc.callFunc(function() {
            that.pauseGame();

            that._gameOverMenuLayer = new GameOverMenuLayer(key, true);
            that._gameOverMenuLayer.setOnRetryCallback(function() {
                that.onRetry();
            });
            that._gameOverMenuLayer.setOnMenuCallback(function() {
                that.onMenu();
            });
            that.addChild(that._gameOverMenuLayer, 999);
        })));
    },

    // whether the game is over or not
    isGameOver: function() {
        return this._numboController.levelIsFull();
    },

    spawnInitialBlocks: function(){
        var that = this;

        var firstBlocksAction = cc.callFunc(function() {that.spawnDropRandomBlocks(NJ.NUM_COLS * NJ.NUM_ROWS / 3);});

        var delayAction = cc.delayTime(2.0);
        var scheduleAction = cc.callFunc(function(){that.scheduleSpawn();})

        this.runAction(cc.sequence(firstBlocksAction, delayAction, scheduleAction));
    },

    // Spawns a block and calls itself in a loop.
    scheduleSpawn: function() {
        if(this.checkGameOver())
            return;

        this.unschedule(this.scheduleSpawn);
        this.schedule(this.scheduleSpawn, this._getSpawnTime());

        this.spawnDropRandomBlock();
    },

    // spawns a specified amount of blocks with a small delay between each one
    spawnRandomBlocks: function(amount) {
        this.schedule(this.spawnDropRandomBlock, 0.1, amount - 1);
    },

    // bonus for clearing screen
    checkClearBonus: function() {
        if (this._numboController.getNumBlocks() < 3) {
            if (NJ.settings.sounds)
                cc.audioEngine.playEffect(res.cheeringSound);
            this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS * .4));
            this.unschedule(this.scheduleSpawn);
            this.schedule(this.scheduleSpawn, 6);

            // give the player 5 * 9 points and launch 5 random '+9' snippets
            for (i = 0; i < 5; ++i) {
                NJ.gameState.addScore(9);
                this._feedbackLayer.launchSnippet({
                    title: "+" + 9,
                    x: cc.visibleRect.center.x,
                    y: cc.visibleRect.center.y,
                    targetX: this._levelBounds.x + Math.random() * this._levelBounds.width,
                    targetY: this._levelBounds.y + Math.random() * this._levelBounds.height
                });
            }
        }
    },

    // Curtain
    closeCurtain: function() {
        this.levelTransition = true;
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.applauseSound);
        this.unschedule(this.closeCurtain);

        this._curtainLayer.initLabels();
        this._curtainLayer.animate();
        this.addChild(this._curtainLayer, 901);

        for (var col = 0; col < NJ.NUM_COLS; ++col) {
            for (var row = 0; row < this._numboController.getNumBlocksInColumn(col); ++row)
                this.moveBlockIntoPlace(this._numboController.getBlock(col, row));
        }

        this.schedule(this.checkOpenCurtain,2);
    },

    checkOpenCurtain: function() {
        this.unschedule(this.checkOpenCurtain);

        if(this._curtainLayer.isCurtainComplete()) {
            this.openCurtain();
        }
        else {
            this.schedule(this.checkOpenCurtain, .5);
        }
    },

    openCurtain: function() {
        this.levelTransition = false;
        this.removeChild(this._curtainLayer);
        this.unschedule(this.openCurtain);
        this.schedule(this.scheduleSpawn, this._getSpawnTime());
        this.checkClearBonus();
    },

    ///////////////////
    // Virtual Stuff //
    ///////////////////

    checkGameOver: function() {
        if(this._super())
            return true;

        if(this.isInDanger()) {
            if(!this._feedbackLayer.isDoomsayerLaunched())
                this._feedbackLayer.launchDoomsayer();
        } else {
            if(this._feedbackLayer.isDoomsayerLaunched())
                this._feedbackLayer.clearDoomsayer();
        }

        return false;
    },

    isInDanger: function() {
        return this._numboController.getNumBlocks() / this._numboController.getCapacity() >= NJ.DANGER_THRESHOLD;
    },

    //////////////////
    // Touch Events //
    //////////////////

    // On touch ended, activates all selected blocks once touch is released.
    onTouchEnded: function(touchPosition) {
        var clearedBlocks = this._super(touchPosition);
        var comboLength = clearedBlocks.length;
        if(!comboLength)
            return;

        var activationSound;
        var progress;

        // handle levelup if we meet the threshold
        if (NJ.gameState.levelUpIfNeeded()) {
            this._numboController.updateProgression();

            activationSound = res.levelupSound;

            progress = NJ.gameState.getLevelupProgress();

            this.closeCurtain();
            this.unschedule(this.scheduleSpawn);
        } else {
            progress = NJ.gameState.getLevelupProgress();
            // choose and play a sound depending on how many blocks until levelup
            //var soundProgressIndex = Math.floor((progresses.length - 1) * progress);
            //activationSound = progresses[soundProgressIndex];
            var soundProgressIndex = Math.floor((plangs.length-1) * progress);
            activationSound = plangs[soundProgressIndex];
        }

        if (NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        // check for a near-empty screen, do 'nice clear!', etc
        this.checkClearBonus();

        this._numboHeaderLayer.updateValues();
        this._numboHeaderLayer.setProgress(progress);
    },

    onExit: function() {
        this._super();
        this._curtainLayer.release();
    }
});