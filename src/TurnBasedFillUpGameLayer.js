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

        this._numboController.initDistribution(this._numberList);

        // fill the board with blocks initially
        this.spawnRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 2));

        // cause UI elements to fall in
        this._numboHeaderLayer.enter();
        this._toolbarLayer.enter();
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
        return (this._numboController.getNumBlocks() >= NJ.NUM_COLS * NJ.NUM_ROWS);
    },

    addMoreBlocks: function() {
        this.spawnRandomBlocks(this._blocksToDrop);
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

        this.spawnRandomBlocks(Math.min(this._blocksToDrop, NJ.NUM_COLS * NJ.NUM_ROWS - this._numboController.getNumBlocks()));

        var activationSound = progresses[Math.min(comboLength*2, progresses.length-1)];

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        var levelUpCount = NJ.gameState.levelUpIfNeeded();

        for(var i = 0; i < levelUpCount; ++i) {
            this._blocksToDrop++;
        }

        this._numboHeaderLayer.setProgress(NJ.gameState.getLevelupProgress());

        this.checkGameOver();
    }
});