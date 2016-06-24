/**
 * Created by jonathanlu on 1/18/16.
 */

var InfiniteGameLayer = BaseGameLayer.extend({

    // time limit for minute madness
    _elapsedTimeLimit: 60,
    _spawnTime: 1.0,

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
        this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());

        if(!NJ.settings.hasLoadedINF) {
            this.pauseGame();

            this._prepLayer = new PrepLayer(res.infiniteImage, NJ.themes.blockColors[3], "Infinite", "Numbers appear\nevery few seconds.\n\n\nThe game ends\nwhen the board fills up.\n\n\nLet's go!");
            this._prepLayer.setOnCloseCallback(function() {
                that.onResume();

                that.removeChild(that._prepLayer);
                that._prepLayer = null;

                NJ.settings.hasLoadedINF = true;
                NJ.saveSettings();

                that._reset();
            });
            this.addChild(this._prepLayer, 100);
        } else {
            this.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                that.enter(function () {
                    that.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                        that._isInGame = true;

                        // spawn blocks until the board is 1/3 full initially fill the board with blocks initially
                        that.spawnInitialBlocks();
                    })));
                });
            })));
        }
    },

    _getSpawnTime: function() {
        // nonlinear level-based variable
        var L = NJ.gameState.getLevel();
        var exponent = 0.3;
        var LFactor = 1 / Math.pow(L, exponent);

        var spawnTime = 1.5 * LFactor;
        return spawnTime;
    },

    _initUI: function() {
        this._super();

        this._numboHeaderLayer.setConditionPrefix("Level: ");
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.trackSomethingElse1;
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

        var scoreDiff = NJ.gameState.getScore();
        if(NJ.stats.isDoubleEnabled())
            scoreDiff *= 2;

        NJ.stats.addCurrency(scoreDiff);

        var key = NJ.modekeys.infinite;
        var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

        if(highscoreAccepted) {
            var highscore = NJ.stats.getHighscore(key);
            NJ.social.submitScore(key, highscore);

            if(highscore >= 2500) {
                NJ.social.unlockAchievement(NJ.social.achievementKeys.inf1);

                if(highscore >= 5000) {
                    NJ.social.unlockAchievement(NJ.social.achievementKeys.inf2);

                    if(highscore >= 7500) {
                        NJ.social.unlockAchievement(NJ.social.achievementKeys.inf3);

                        if(highscore >= 10000) {
                            NJ.social.unlockAchievement(NJ.social.achievementKeys.inf4);
                        }
                    }
                }
            }
        }

        NJ.stats.save();

        // first send the analytics for the current game session
        NJ.sendAnalytics("Infinite");

        this.leave(function() {
            that.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function() {
                that._numboController.clearLevel();
            }), cc.delayTime(1), cc.callFunc(function() {
                that.pauseGame();

                that._gameOverMenuLayer = new GameOverMenuLayer(key, highscoreAccepted);
                that._gameOverMenuLayer.setOnRetryCallback(function() {
                    that.onRetry();
                });
                that._gameOverMenuLayer.setOnMenuCallback(function() {
                    that.onMenu();
                });
                that.addChild(that._gameOverMenuLayer, 999);
            })));
        });
    },

    // whether the game is over or not
    isGameOver: function() {
        return this._numboController.levelIsFull();
    },

    spawnInitialBlocks: function() {
        var that = this;

        that.spawnDropRandomBlocks(NJ.NUM_COLS * NJ.NUM_ROWS / 3);
        NJ.audio.playSound(res.plipSound);

        var delayAction = cc.delayTime(2.0);
        var scheduleAction = cc.callFunc(function(){
            that.scheduleSpawn();
        });

        this.runAction(cc.sequence(delayAction, scheduleAction));
    },

    // Spawns a block and calls itself in a loop.
    scheduleSpawn: function() {
        if(this.checkGameOver())
            return;

        this.unschedule(this.scheduleSpawn);
        this.schedule(this.scheduleSpawn, this._getSpawnTime());

        this.spawnDropRandomBlock();
        NJ.audio.playSound(res.clickSound);
    },

    // spawns a specified amount of blocks with a small delay between each one
    spawnRandomBlocks: function(amount) {
        this.schedule(function() {
            this.spawnDropRandomBlock();
            NJ.audio.playSound(res.clickSound);
        }, 0.1, amount - 1);
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
        this._super(touchPosition);

        // Activate any selected blocks.
        var selectedAndBonusBlocks = this._numboController.activateSelectedBlocks();
        var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
        var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

        this.redrawSelectedLines();

        this._numboHeaderLayer.activateEquation();

        this._effectsLayer.clearComboOverlay();

        if (!selectedBlocks.length)
            return;

        this.scoreBlocksMakeParticles(selectedBlocks);
        this.scoreBlocksMakeParticles(bonusBlocks, true);

        this.relocateBlocks();

        // Allow controller to look for new hint.
        this._numboController.resetKnownPath();

        var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
        if(!comboLength)
            return;

        this._effectsLayer.clearComboOverlay();

        // handle levelup if we meet the threshold
        if (NJ.gameState.levelUpIfNeeded()) {
            this._numboController.updateProgression();

            this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());
        }

        this._playActivationSounds(selectedBlocks.length);

        if(this._numboController.getNumBlocks() <= 3) {
            this.spawnRandomBlocks(Math.floor(NJ.NUM_COLS * NJ.NUM_ROWS / 3));
        }
    }
});