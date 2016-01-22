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
	    // create empty columns:
	    for(var i = 0; i < NJ.NUM_COLS; ++i)
		this.blocks.push([]);

	},

	// reset the level, removing all blocks
	reset: function() {
	    for(var i = 0; i < NJ.NUM_ROWS; ++i) {
		for(var j = 0; j < NJ.NUM_COLS; ++j) {
		    this.blocks[i][j] = null;
		}
	    }
	},

	// fill the level with random blocks
	fillBlocks: function() {
	    for(var i = 0; i < NJ.NUM_COLS; ++i) {
		for(var j = 0; j < NJ.NUM_ROWS; ++j) {
		    var blockVal = Math.floor(Math.random() * (NJ.BLOCK_MAX_VALUE) + 1);
		    this.spawnBlock(i, blockVal).bHasDropped = true;
		}
	    }
	},

	// spawn a block at the given col and value
	// returns spawned block
	// DO NOT publicly use directly!!! Use dropBlock or dropRandomBlock instead
	spawnBlock: function(col, val) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "Invalid coords");
	    
	    var block = new NumboBlock();

	    block.init(col, this.blocks[col].length, val);
	    this.blocks[col].push(block);
	    this.totalNumBlocks++;
	    return block;
	},

	// drop block into the given column with given value
	// returns dropped block
	dropBlock: function(col, val) {
	    cc.assert(this.blocks[col].length < NJ.NUM_ROWS, "Can't drop any more blocks in this column!");

	    var block = this.spawnBlock(col, val);
	    block.bHasDropped = false;
	    return block;
	},

	// drop block into random column with random value
	// returns dropped block
	dropRandomBlock: function() {
	    cc.assert(!this.isFull(), "Can't drop any more blocks");

	    var val = Math.floor(Math.random() * (NJ.BLOCK_MAX_VALUE) + 1);

	    // search for a non full column to drop block into
	    var col = Math.floor(Math.random() * NJ.NUM_COLS);
	    while (this.blocks[col].length >= NJ.NUM_ROWS) 
		col = Math.floor(Math.random() * NJ.NUM_COLS);

	    return this.dropBlock(col, val);
	},

	// kill given block
	killBlock: function(block) {
	    cc.assert(block, "Invalid block");

	    var col = block.col;
	    var row = block.row;
	    block.kill();

	    this.blocks[col].splice(row, 1);
	    this.totalNumBlocks--;
	    for (var j = row; j < this.blocks[col].length; ++j){
		this.blocks[col][j].row = j;
		this.blocks[col][j].bHasDropped = false;
	    }
	},

	// kill block at given coordinates
	killBlockAtCoords: function(col, row) {
	    cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");
	    
	    if (row < this.blocks[col].length) 
		killBlock(this.blocks[col][row]);
	    
	},
	
	// shifts all blocks on the given column downward
	// by setting its bHasDropped to false
	shiftBlocksInColumn: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
	    
	    for (var row = 0; row < this.blocks[col].length; ++row){
		this.blocks[col][row].bHasDropped = false;
		this.blocks[col][row].row = row;
	    }
	},

	collapseColumnsToward: function (col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
	    
	    collapseLeftSideToward(col);
	    collapseRightSideToward(col);
	},

	collapseLeftSideToward: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

	    // find an empty column:
	    for (var e; e >= 0; --e) {
		if (blocks[e].length == 0) { // found one
		    // find index of next non-empty column:
		    for (var n = e; n >= 0; --n) {
			if (blocks[n].length > 0) {// found one
			    this.swapColumns(n, e);
			    break;
			}
		    }
		}
	    }
	},
	
	collapseRightSideToward: function(col){
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
	    	
	    // find an empty column:
	    for (var e; e < NJ.NUM_COLS; ++e) {
		if (blocks[e].length == 0) { // found one
		    // find index of next non-empty column:
		    for (var n = e; n >= 0; --n) {
			if (blocks[n].length > 0) {// found one
			    this.swapColumns(n, e);
			    break;
			}
		    }
		}
	    }
    
	},

	swapColumns: function(i, j){
	    var t = blocks[i];
	    blocks[i] = blocks[j];
	    blocks[j] = blocks[t];
	},

	// returns whether level is currently full of blocks
	isFull: function() {
	    return this.totalNumBlocks >= NJ.NUM_COLS * NJ.NUM_ROWS;
	},

	// returns whether two coordinates are adjacent (diagonal allowed)
	isAdjCoords: function(col1, row1, col2, row2) {
	    return Math.abs(col2 - col1) <= 1 && Math.abs(row2 - row1) <= 1;
	},

	// returns whether two blocks are adjacent (diagonal allowed)
	isAdjBlocks: function(block1, block2) {
	    return this.isAdjCoords(block1.col, block1.row, block2.col, block2.row);
	},

	// returns whether a block exists at given coords
	getBlock: function(col, row) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS && 0 <= row && row < NJ.NUM_ROWS 
		      && row < this.blocks[col].length, "invalid coords!");
	    return this.blocks[col][row];
	}
    });