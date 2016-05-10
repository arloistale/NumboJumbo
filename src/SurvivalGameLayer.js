/**
 * Created by jonathanlu on 1/18/16.
 */

var SurvivalGameLayer = BaseGameLayer.extend({

    // time limit for minute madness
    _elapsedTimeLimit: 60,
    _spawnTime: 1.0,



    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        // spawn blocks until the board is 1/3 full initially fill the board with blocks initially
        this.spawnInitialBlocks();

        // next we wait until the blocks have been spawned to init the game
        var that = this;
        this.schedule(function() {
            that._numboHeaderLayer.updateValues();
            that.checkGameOver();
        }, 1);
    },

    _getSpawnTime: function() {
        // the constant spawn delay based on the current jumbo
        var j = this._numboController.getJumboSpawnDelay();

        // nonlinear level-based variable
        var L = NJ.gameState.getLevel();
        var exponent = 0.3;
        var LFactor = 1 / Math.pow(L, exponent);

        // linear blocks-cleared-this-level factor
        var BFactor = 1 - NJ.gameState.getLevelupProgress() / 3;

        var spawnTime = j * LFactor * BFactor;
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
        this.unschedule(this.scheduleSpawn);
        this.schedule(this.scheduleSpawn, this._getSpawnTime());
        if(this.isGameOver()) {
            this.onGameOver();
            return;
        }

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

        // update the progress bar
        var progress = NJ.gameState.getLevelupProgress();
        this._numboHeaderLayer.setProgress(progress);

        // handle levelup if we meet the threshold
        if (NJ.gameState.levelUpIfNeeded()) {
            this._numboController.updateProgression();
            // Play level up sound instead
            if (NJ.settings.sounds)
                activationSound = res.levelupSound;
        }

        // choose and play a sound depending on how many blocks until levelup
        var soundProgressIndex = Math.floor((progresses.length-1) * progress );
        activationSound = progresses[soundProgressIndex];
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        // check for a near-empty screen, do 'nice clear!', etc
        this.checkClearBonus();

    }
});