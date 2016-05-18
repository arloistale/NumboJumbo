/**
 * Created by The Dylan on 5/4/2016.
 */

var TurnBasedFillUpGameLayer = BaseGameLayer.extend({

    // domain of spawning
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

    // blocks dropped every turn (changes)
    _blocksToDrop: 6,

    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        var that = this;

        this._numboController.initDistribution(this._numberList);

        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
            // cause UI elements to fall in
            that._numboHeaderLayer.enter();
            that._toolbarLayer.enter();
        }), cc.delayTime(0.5), cc.callFunc(function() {
            // fill the board with blocks initially
            that.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 2));
        })));
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.trackA;
    },

    /////////////////////////
    // Game State Handling //
    /////////////////////////

    onGameOver: function() {
        this._super();

        var that = this;

        NJ.stats.addCurrency(NJ.gameState.getScore());

        var key = NJ.modekeys.react;
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
        return (this._numboController.getNumBlocks() >= NJ.NUM_COLS * NJ.NUM_ROWS);
    },

    addMoreBlocks: function() {
        this.spawnDropRandomBlocks(this._blocksToDrop);
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

        this.spawnDropRandomBlocks(Math.min(this._blocksToDrop, NJ.NUM_COLS * NJ.NUM_ROWS - this._numboController.getNumBlocks()));

        //var activationSound = progresses[Math.min(comboLength*2, progresses.length-1)];
        var activationSound = plangs[Math.min(comboLength-2, plangs.length - 1)];

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        var levelUpCount = NJ.gameState.levelUpIfNeeded();

        for(var i = 0; i < levelUpCount; ++i) {
            this._blocksToDrop++;
        }

        this._numboHeaderLayer.updateValues();
        this._numboHeaderLayer.setProgress(NJ.gameState.getLevelupProgress());

        this.checkGameOver();
    }
});