var DifficultyManager = cc.Class.extend({
    spawnTime: .1, // frequeny of block
    startTime: 0, // time of init
    timeElapsed: 0, // duration of gameplay
    blocksInLevel: 0, // number of blocks in level
    chainBlockFreq: [0,0,0,0,0,0,0,0,0,0], // frequency of numbers picked
    chainLengthFreq: [0,0,0,0,0,0,0,0,0,0], // frequency of chain lengths
    settings: {}, // object for holding sequence flags
    level: 0, // index of spawnConsts
    spawnConsts: [2, 1.8, 1.6, 1.4, 1.25, 1.1, 0.95, 0.8], // spawn times based on level index
    blocksToLevelUp: [15, 30, 50, 75, 105, 140, 175, 210],

    // initialize timing, initial mode
    init: function() {
        this.startTime = Date.now();
        this.spawnTime = .1;
        this.settings.intro = true;
    },

    recordDrop: function() {
        this.blocksInLevel++;
        this.adjustSpawnTime();
    },

    // update data following a score
    recordScore: function(blocks) {
        this.timeElapsed = (Date.now() - this.startTime) / 1000;

        for (var i = 0; i < blocks.length; i++)
            this.chainBlockFreq[blocks[i].val - 1]++;

        this.chainLengthFreq[blocks.length - 1]++;

        NJ.analytics.blocksPerMinute = this.chainBlockFreq.reduce(function(a,b){return a+b;}, 0) / this.timeElapsed * 60;
        this.blocksInLevel -= blocks.length;

        // level up
        if (this.blocksToLevelUp[this.level] <= NJ.analytics.blocksCleared)
            this.level++;

        // speed up for a level up
        if (this.spawnTime != this.spawnConsts[this.level]) {
            this.spawnTime = this.spawnConsts[this.level];
        }
    },

    // adjusts the spawn frequency based parameters, returns if
    // update on spawn time needs to be updated
    adjustSpawnTime: function() {
        // end intro
        if (this.settings.intro) {
            if (false && this.blocksInLevel >= NJ.NUM_COLS * NJ.NUM_ROWS / 3) {
                this.spawnTime = 2;
                this.settings.intro = false;
            }

            return false;
        }
        // stop the slowdown
        else if (this.settings.inDanger) {
            if (this.blocksInLevel <= NJ.NUM_COLS * NJ.NUM_ROWS - 2 * NJ.NUM_COLS) {
                this.settings.inDanger = false;
            }
        }
        // start the slowdown
        else if (this.blocksInLevel > NJ.NUM_COLS * NJ.NUM_ROWS - NJ.NUM_COLS) {
            this.settings.inDanger = true;
            this.spawnTime += .6;
        }
    },

    // returns value of next block
    getNextBlock: function(blocks) {
        var block = {};
        // Set up val/col possibilities
        var vals = [1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,5,5,5,6,6,7,7,8,8,9,9];
        var cols = [];
        for(var i=0; i<NJ.NUM_COLS; i++) {
            for(var j=NJ.NUM_ROWS; j > blocks[i].length; j--) {
                cols.push(i);
            }
        }
        // Pick random val/col from set
        block.val = vals[Math.floor(Math.random()*vals.length)];
        block.col = cols[Math.floor(Math.random()*cols.length)];

        return block;
    },

    // getters

    getSpawnTime: function() {
        return this.spawnTime;
    },

    getBlocksToLevel: function() {
        return this.blocksToLevelUp[this.level] - NJ.analytics.blocksCleared;
    }
});