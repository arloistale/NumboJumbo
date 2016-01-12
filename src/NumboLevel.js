/**
 Created by jonathanlu on 1/10/16.

 Part of the model-view scheme used by the level system.

 NumboLevel represents a grid with blocks. The actual sprites for blocks and level are contained
 within the MainGame scene but all logic for dropping blocks and shifting blocks
 are done in this module.

 */

var NumboLevel = cc.Class.extend({
    blocks: [],
    numBlocks: [],
    totalNumBlocks: 0,

    // initialize the level to empty
    init: function() {
        while(this.blocks.push([]) < NJ.ROWS);

        this.reset();
    },

    // reset the level, removing all blocks
    reset: function() {
        for(var i = 0; i < NJ.NUM_COLS; ++i) {
            this.numBlocks[i] = 0;

            for(var j = 0; j < NJ.NUM_ROWS; ++j) {
                this.blocks[i][j] = null;
            }
        }
    },

    // fill the level with random blocks
    fillBlocks: function() {
        for(var i = 0; i < NJ.NUM_ROWS; ++i) {
            for(var j = 0; j < NJ.NUM_COLS; ++j) {
                var blockVal = Math.floor(Math.random() * (NJ.BLOCK_MAX_VALUE) + 1);
                this.spawnBlock(j, i, blockVal).hasDropped = true;
            }
        }
    },

    // spawn a block at the given col, row, and value
    // returns spawned block
    // DO NOT publicly use directly!!! Use dropBlock or dropRandomBlock instead
    spawnBlock: function(col, row, val) {
        cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

        var block = new NumboBlock();
        block.init(col, row, val);
        this.blocks[col][row] = block;
        this.numBlocks[col]++;
        this.totalNumBlocks++;
        return block;
    },

    // drop block into the given column with given value
    // returns dropped block
    dropBlock: function(col, val) {
        cc.assert(numBlocks[col] < NJ.NUM_ROWS, "Can't drop any more blocks in this column!");

        var row = this.numBlocks[col];
        var block = this.spawnBlock(col, row, val);
        block.hasDropped = false;
        return block;
    },

    // drop block into random column with random value
    // returns dropped block
    dropRandomBlock: function() {
        cc.assert(!isFull(), "Can't drop any more blocks");

        var val = Math.floor(Math.random() * (NJ.BLOCK_MAX_VALUE) + 1);

        // search for a non full column to drop block into
        var col = Math.floor(Math.random() * NJ.NUM_COLS);
        while (this.numBlocks[col] >= NJ.NUM_ROWS) {
            col = Math.floor(Math.random() * NJ.NUM_COLS);
        }

        return this.dropBlock(col, val);
    },

    // kill given block
    killBlock: function(block) {
        cc.assert(block, "Invalid block");

        var col = block.col;
        block.kill();

        this.blocks[col][block.row] = null;
        this.numBlocks[col]--;
        this.totalNumBlocks--;
    },

    // kill block at given coordinates
    killBlockAtCoords: function(col, row) {
        cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

        this.blocks[col][row].kill();
        this.blocks[col][row] = null;
        this.numBlocks[col]--;
        this.totalNumBlocks--;
    },

    // shifts all blocks down, removing gaps
    shiftBlocks: function() {
        var result = [];

        for(var i = 0; i < NJ.NUM_COLS; i++) {
            if(!numBlocks[i])
                continue;

            var shiftRow = !this.blocks[i][0] ? 0 : -1;
            for(var j = 0; j < NJ.NUM_ROWS; j++) {
                if(this.blocks[i][j]) {
                    if(shiftRow >= 0) {
                        this.blocks[i][shiftRow] = this.blocks[i][j];
                        this.blocks[i][shiftRow].hasDropped = false;
                        this.blocks[i][shiftRow].row = shiftRow;
                        result.push(this.blocks[i][shiftRow]);
                        shiftRow++;
                        this.blocks[i][j] = nullptr;
                    }
                } else if(this.blocks[i][j - 1]) {
                    shiftRow = j;
                }
            }
        }
    },

    // returns whether level is currently full of blocks
    isFull: function() {
        return totalNumBlocks >= NJ.NUM_COLS * NJ.NUM_ROWS;
    },

    // returns whether two coordinates are adjacent (diagonal allowed)
    isAdjCoords: function(col1, row1, col2, row2) {
        return Math.abs(col2 - col1) <= 1 && Math.abs(row2 - row1) <= 1;
    },

    // returns whether two blocks are adjacent (diagonal allowed)
    isAdjBlocks: function(block1, block2) {
        return Math.abs(block1.col, block1.row, block2.col, block2.row);
    },

    // returns whether a block exists at given coords
    blockExistsAtCoords: function(col, row) {
        return this.blocks[col][row];
    }
});