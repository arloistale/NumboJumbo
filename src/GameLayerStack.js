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

        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
            // cause UI elements to fall in
            that._numboHeaderLayer.enter();
            that._toolbarLayer.enter();
        }), cc.callFunc(function() {
            // fill the board with blocks initially
            that.spawnBlocksAfterDelay(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 2), 0.5);
        })));
    },

    _initUI: function() {
        this._super();

        this._numboHeaderLayer.setConditionPrefix("Drop Count: ");
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
        var selectedAndBonusBlocks = this._super(touchPosition);
        var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
        var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

        if (!selectedBlocks)
            return;
        var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
        if(!comboLength)
            return;


        if(NJ.settings.sounds) {
            var activationSounds = [];
            for (var i = 0; i < comboLength; i++) {
                activationSounds.push(bloops[i]);
            }

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
            else if (activationSounds.length == 5) {
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
            }
            else if (activationSounds.length == 6) {
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
                }, .47, false);
            }
        }

        var levelUpCount = NJ.gameState.levelUpIfNeeded();

        for(var i = 0; i < levelUpCount; ++i) {
            this._blocksToDrop++;
        }

        var numBlocksToSpawn = Math.min(this._blocksToDrop, NJ.NUM_COLS * NJ.NUM_ROWS - this._numboController.getNumBlocks());
        this._numboHeaderLayer.setConditionValue(this._blocksToDrop);

        this.spawnDropRandomBlocks(numBlocksToSpawn);
        this.checkGameOver();
    }
});