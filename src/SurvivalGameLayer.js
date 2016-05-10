/**
 * Created by jonathanlu on 1/18/16.
 */

var SurvivalGameLayer = BaseGameLayer.extend({

    // time limit for minute madness
    _elapsedTimeLimit: 60,
    _spawnTime: 1.0,

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

    _thresholdNumbers: {
        "2": [{"key": 10, "weight": 20}],
        "7": [{"key": 11, "weight": 20}],
        "8": [{"key": 12, "weight": 20}],
        "9": [{"key": 13, "weight": 20}],
        "10": [{"key": 14, "weight": 20}],
        "11": [{"key": 15, "weight": 20}],
        "12": [{"key": 16, "weight": 20}],
        "13": [{"key": 17, "weight": 10}],
        "14": [{"key": 18, "weight": 10}],
        "15": [{"key": 19, "weight": 10}],
        "16": [{"key": 20, "weight": 10}]
    },

    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        this._numboController.initDistribution(this._numberList, this._thresholdNumbers);

        // spawn blocks until the board is 1/3 full initially fill the board with blocks initially
        this.spawnInitialBlocks();

        // cause UI elements to fall in
        this._numboHeaderLayer.enter();
        this._toolbarLayer.enter();
    },

    _getSpawnTime: function() {
        // nonlinear level-based variable
        var L = NJ.gameState.getLevel();
        var exponent = 0.3;
        var LFactor = 1 / Math.pow(L, exponent);

        // linear blocks-cleared-this-level factor
        var BFactor = 1 - NJ.gameState.getLevelupProgress() / 3;

        var spawnTime = 2 * LFactor * BFactor;
        return spawnTime;
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.backgroundTrack;
    },

    /////////////////////////
    // Game State Handling //
    /////////////////////////

    // whether the game is over or not
    isGameOver: function() {
        return this._numboController.levelIsFull();
    },

    spawnInitialBlocks: function(){
        var that = this;

        var firstBlocksAction = cc.callFunc(function() {that.spawnRandomBlocks(NJ.NUM_COLS * NJ.NUM_ROWS / 3);});

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

        if(!this._feedbackLayer.isDoomsayerLaunched()) {
            if(this._numboController.isInDanger())
                this._feedbackLayer.launchDoomsayer();
        } else {
            if(!this._numboController.isInDanger())
                this._feedbackLayer.clearDoomsayer();
        }

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
        } else {
            progress = NJ.gameState.getLevelupProgress();
            // choose and play a sound depending on how many blocks until levelup
            var soundProgressIndex = Math.floor((progresses.length - 1) * progress);
            activationSound = progresses[soundProgressIndex];
        }

        if (NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        // check for a near-empty screen, do 'nice clear!', etc
        this.checkClearBonus();

        this._numboHeaderLayer.updateValues();
        this._numboHeaderLayer.setProgress(progress);
    }
});