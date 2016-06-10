/**
 * Created by The Dylan on 5/4/2016.
 */

var StackGameLayer = BaseGameLayer.extend({

    //// domain of spawning
    _numberList: [
        { key: 1, weight: 100 },
        { key: 2, weight: 75 },
        { key: 3, weight: 50 },
        { key: 4, weight: 50 },
        { key: 5, weight: 50 },
        { key: 6, weight: 40 },
        { key: 7, weight: 40 },
        { key: 8, weight: 40 },
        { key: 9, weight: 40 }
    ],

    // initial # of blocks dropped every turn (increases at each level)
    _blocksToDrop: 4,

    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        var that = this;

        this._numboController.initDistribution(this._numberList);
        this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());
        this._numboHeaderLayer.setConditionValue(this._blocksToDrop);

        if(!NJ.settings.hasLoadedRE) {
            this.pauseGame();

            this._prepLayer = new PrepLayer(res.stackImage, NJ.themes.blockColors[2], "Stack", "Numbers appear\nwhen you make moves.\n\n\nThe game ends\nwhen the board fills up.\n\n\nLet's go!");
            this._prepLayer.setOnCloseCallback(function() {
                that.onResume();

                that.removeChild(that._prepLayer);

                NJ.settings.hasLoadedRE = true;
                NJ.saveSettings();

                that._reset();
            });
            this.addChild(this._prepLayer, 100);
        } else {
            this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                that.enter(function () {
                    that.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                        // fill the board with blocks initially
                        that.spawnBlocksAfterDelay(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 2), 0.5);
                    })));
                });
            })));
        }
    },

    _initUI: function() {
        this._super();

        this._numboHeaderLayer.setConditionPrefix("Level: ");
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.trackDauntinglyMellow;
    },

    /////////////////////////
    // Game State Handling //
    /////////////////////////

    onRetry: function() {
        this._super();

        var scene = new cc.Scene();
        scene.addChild(new StackGameLayer());
        cc.director.runScene(scene);
    },

    onGameOver: function() {
        this._super();

        var that = this;

        NJ.stats.addCurrency(NJ.gameState.getScore());

        var key = NJ.modekeys.react;
        var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());
        var highlevelAccepted = NJ.stats.offerHighlevel(key, NJ.gameState.getLevel());

        // only submit score after all desired achievements have been pushed
        // because the achievement
        if(highscoreAccepted) {
            var highscore = NJ.stats.getHighscore(key);
            NJ.social.submitScore(key, highscore);

            if(highscore >= 500) {
                NJ.social.unlockAchievement(NJ.social.achievementKeys.re1);

                if(highscore >= 1000) {
                    NJ.social.unlockAchievement(NJ.social.achievementKeys.re2);

                    if(highscore >= 1500) {
                        NJ.social.unlockAchievement(NJ.social.achievementKeys.re3);

                        if(highscore >= 2000) {
                            NJ.social.unlockAchievement(NJ.social.achievementKeys.re4);
                        }
                    }
                }
            }
        }

        //if(highlevelAccepted)
          //  NJ.social.submitLevel(key, NJ.stats.getHighlevel(key));

        NJ.stats.save();

        // first send the analytics for the current game session
        NJ.sendAnalytics("Stack");

        this.leave(function() {
            that.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function() {
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
        });
    },

    // whether the game is over or not
    isGameOver: function() {
        return (this._numboController.getNumBlocks() >= NJ.NUM_COLS * NJ.NUM_ROWS);
    },

    isInDanger: function() {
        return false;
    },

    addMoreBlocks: function() {
        this.spawnDropRandomBlocks(this._blocksToDrop);
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

        this._effectsLayer.clearComboOverlay();

        this._playActivationSounds(selectedBlocks.length);

        var levelUpCount = NJ.gameState.levelUpIfNeeded();

        if(levelUpCount) {
            for (var i = 0; i < levelUpCount; ++i) {
                this._blocksToDrop++;
            }

            this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());
        }

        var numBlocksToSpawn = Math.min(this._blocksToDrop, NJ.NUM_COLS * NJ.NUM_ROWS - this._numboController.getNumBlocks());

        this.spawnBlocksAfterDelay(numBlocksToSpawn, this._spawnDelay);
        this.checkGameOver();
    }
});