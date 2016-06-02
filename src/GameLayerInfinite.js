/**
 * Created by jonathanlu on 1/18/16.
 */

var InfiniteGameLayer = BaseGameLayer.extend({

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
        this._numboHeaderLayer.setConditionValue(this._numboController.getSpawnDistributionMaxNumber());

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

    _initUI: function() {
        this._super();

        this._numboHeaderLayer.setConditionPrefix("Max Drop: ");
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.trackDauntinglyMellow;
    },

    _initGeometry: function() {
        this._super();
        // curtain layer between levels
        this._curtainLayer = new CurtainLayer(this._levelBounds);
    },

    /////////////////////////
    // Game State Handling //
    /////////////////////////

    onRetry: function() {
        this._super();

        var scene = new cc.Scene();
        scene.addChild(new InfiniteGameLayer());
        cc.director.runScene(scene);
    },

    onGameOver: function() {
        this._super();

        var that = this;

        NJ.stats.addCurrency(NJ.gameState.getScore());

        var key = NJ.modekeys.infinite;
        var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());
        var highlevelAccepted = NJ.stats.offerHighlevel(key, NJ.gameState.getLevel());

        if(highscoreAccepted) {
            var highscore = NJ.stats.getHighscore(key);
            NJ.social.submitScore(key, highscore);

            if(highscore >= 500) {
                NJ.social.unlockAchievement(NJ.social.achievementKeys.inf1);

                if(highscore >= 1000) {
                    NJ.social.unlockAchievement(NJ.social.achievementKeys.inf2);

                    if(highscore >= 1500) {
                        NJ.social.unlockAchievement(NJ.social.achievementKeys.inf3);

                        if(highscore >= 2000) {
                            NJ.social.unlockAchievement(NJ.social.achievementKeys.inf4);
                        }
                    }
                }
            }
        }

        //if(highlevelAccepted)
          //  NJ.social.submitLevel(key, NJ.stats.getHighlevel(key));

        NJ.stats.save();

        // first send the analytics for the current game session
        NJ.sendAnalytics("Default");

        this.runAction(cc.sequence(cc.callFunc(function() {
            that._numboHeaderLayer.leave();
            that._toolbarLayer.leave();
        }), cc.delayTime(1), cc.callFunc(function() {
            that._numboController.clearLevel();
        }), cc.delayTime(1), cc.callFunc(function() {
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

    // Curtain
    closeCurtain: function() {
        this.levelTransition = true;
        //if(NJ.settings.sounds)
            //cc.audioEngine.playEffect(res.applauseSound);
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
        //this.checkClearBonus();
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
        // Activate any selected blocks.
        var selectedAndBonusBlocks = this._numboController.activateSelectedBlocks();
        var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
        var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

        this.redrawSelectedLines();

        this._numboHeaderLayer.setEquation([]);

        this._effectsLayer.clearComboOverlay();

        if (!selectedBlocks)
            return;

        var totalClearedBlocks = selectedBlocks.concat(bonusBlocks);
        this.scoreBlocksMakeParticles(totalClearedBlocks, totalClearedBlocks.length);

        this.relocateBlocks();

        // Allow controller to look for new hint.
        this._numboController.resetKnownPath();
        this.jiggleCount = 0;

        // schedule a hint
        //this.schedule(this.jiggleHintBlocks, 7);

        var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
        if(!comboLength)
            return;

        var numSounds = comboLength - bonusBlocks.length;

        var activationSound;
        var progress;

        // handle levelup if we meet the threshold
        if (NJ.gameState.levelUpIfNeeded()) {
            this._numboController.updateProgression();

            this._numboHeaderLayer.setConditionValue(this._numboController.getSpawnDistributionMaxNumber());
        } else {
            progress = NJ.gameState.getLevelupProgress();
            //var soundProgressIndex = Math.floor((bloops.length-1) * progress);
            //activationSound = bloops[soundProgressIndex];
        }

        if(NJ.settings.sounds) {
            var activationSounds = [];
            for (var i = 0; i < numSounds; i++) {
                activationSounds.push(bloops[i]);
            }
            if(numSounds > 4)
                activationSounds.push(bloops[numSounds]);

            this.schedule(function () {
                cc.audioEngine.playEffect(activationSounds[0]);
            }, .05, false);

            var timeBetween = 0;
            switch (activationSounds.length) {
                case 3:
                    timeBetween = .12;
                    break;
                case 4:
                    timeBetween = .1;
                    break;
                case 5:
                    timeBetween = .07;
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    timeBetween = .06;
                    break;
            }
            /*
             for (var i = 1; i < activationSounds.length; i++) {
             this.schedule(function () {
             cc.audioEngine.playEffect(activationSounds[i]);
             }, .05 + (i * timeBetween), false);
             }
             */

            if (activationSounds.length == 3) {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .17, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .29, false);
            }
            else if (activationSounds.length == 4) {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .15, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .25, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .35, false);
            }
            else if (activationSounds.length == 6) {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .12, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .19, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .26, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .33, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .40, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .47, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .54, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .61, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .68, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[0]);
                }, .75, false);
            }
            else if (activationSounds.length == 7) {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .11, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .17, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .23, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .29, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .35, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[6]);
                }, .41, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .47, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .53, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .59, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .65, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .71, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[0]);
                }, .77, false);
            }
            else if (activationSounds.length == 8) {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .11, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .17, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .23, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .29, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .35, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[6]);
                }, .41, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[7]);
                }, .47, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[6]);
                }, .53, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .59, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .65, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .71, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .77, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .83, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[0]);
                }, .89, false);
            }
            else {
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .11, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .17, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .23, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .29, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .35, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[6]);
                }, .41, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[7]);
                }, .47, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[8]);
                }, .53, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[7]);
                }, .59, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[6]);
                }, .65, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[5]);
                }, .71, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[4]);
                }, .77, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[3]);
                }, .83, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[2]);
                }, .89, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[1]);
                }, .95, false);
                this.schedule(function () {
                    cc.audioEngine.playEffect(activationSounds[0]);
                }, 1.01, false);
            }
        }

        // check for a near-empty screen, do 'nice clear!', etc
        //this.checkClearBonus();
    },

    onExit: function() {
        this._super();
        this._curtainLayer.release();
    }
});