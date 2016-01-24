/**
   Created by jonathanlu on 1/10/16.

   Part of the model-view scheme used by the level system.

   NumboLevel represents a grid with blocks. The actual sprites for blocks and level are contained
   within the MainGame scene but all logic for dropping blocks and shifting blocks
   are done in this module.

*/
var NumboLevel = cc.Class.extend({
	blocks: [],
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

	// drop block into the given column with given value.
	// since column collapsing was introduced, also
	// shifts blocks horizontally if neccessary.
	// returns dropped block
	dropBlock: function(col, val) {
	    cc.assert(this.blocks[col].length < NJ.NUM_ROWS, "Can't drop any more blocks in this column!");

	    var block = this.spawnBlock(col, val);
	    block.bHasDropped = false;
	    return block;
	},

	// drop block into random column with random value
	// returns dropped block
	// drop block into random column with random value
	// returns dropped block
	dropRandomBlock: function(difficultyMgr) {
		cc.assert(!this.isFull(), "Can't drop any more blocks");

	    //var col = this.getRandomValidCol();
		var block = difficultyMgr.getNextBlock(this.blocks);
		var val = block.val;
		var col = block.col;

		return this.dropBlock(col, val);
	},
	
	// search for a legit column to drop block into.
	// does not return columns which are empty.
	// prioritizes columns adjacent to non-empty columns, if possible.
	// returns the valid column found
	getRandomValidCol: function(){
	    cc.assert(!this.isFull(), "cannot spawn brick when board is full!");

	    var nonEmptyExists = false;
	    for (var i=0; i< NJ.NUM_COLS; ++i){
		if (this.blocks[i].length > 0)
		    nonEmptyExists = true;
	    }

	    var legit = false;
	    while (legit == false ){
		var col = Math.floor(Math.random() * NJ.NUM_COLS);
		if (this.blocks[col].length >= NJ.NUM_ROWS)
		    legit = false;
		else if (nonEmptyExists == true){
		    if (col > 0 && this.blocks[col-1].length > 0)
			legit = true;
		    else if (col < NJ.NUM_COLS-1 && this.blocks[col+1].length>0)
			legit = true;
		}
		else
		    legit = true;
	    }
	    
	    return col;
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

	// takes in the index of a column in bricks[][].
	// moves all non-empty columns toward that col
	// (cols to the left of col move rightward, and vice-versa)
	collapseColumnsToward: function (col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
	    this.collapseLeftSideToward(col);
	    this.collapseRightSideToward(col);
	},
	
	collapseLeftSideToward: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

	    // find an empty column:
	    for (var e = col; e >= 0; --e) {
			if (this.blocks[e].length == 0) { // found one
				// find index of next non-empty column:
				for (var n = e; n >= 0; --n) {
					if (this.blocks[n].length > 0) { // found one
						this.swapColumns(n, e);
						break; // should maybe write this w/o break :p
					}
				}
			}
	    }
	},
	
	collapseRightSideToward: function(col){
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
	    	
	    // find an empty column:
	    for (var e = col; e < NJ.NUM_COLS; ++e) {
			if (this.blocks[e].length == 0) { // found one
				// find index of next non-empty column:
				for (var n = e; n < NJ.NUM_COLS; ++n) {
					if (this.blocks[n].length > 0) {// found one
						this.swapColumns(n, e);
						break; // should maybe write this w/o break :p
					}
				}
			}
	    }
	},

	// takes in the indeces of two columns in blocks[] and swaps them.
	// does not fix the internal block.col values;
	// use this.updateBlockRowsAndCols() for that.
	// (perhaps should create a new one that only updates locally)
	swapColumns: function(i, j){
	    cc.assert(0 <= i && i < NJ.NUM_COLS, "invalid column! " + i);
	    cc.assert(0 <= j && j < NJ.NUM_COLS, "invalid column! " + j);

	    var t = this.blocks[i];
	    this.blocks[i] = this.blocks[j];
	    this.blocks[j] = t;
	},

	// iterates over all blocks and updates their .row and .col
	// member variables. useful when blocks are removed or need
	// to be collapsed
	updateBlockRowsAndCols: function() {
	    for (var i=0; i < NJ.NUM_COLS; ++i){
			for (var j=0; j < this.blocks[i].length; ++j){
				if (this.blocks[i][j]){
					this.blocks[i][j].col = i;
					this.blocks[i][j].row = j;
				}
			}
	    }
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
	    cc.assert(col >= 0 && col < NJ.NUM_COLS && row >= 0 && row < NJ.NUM_ROWS
		      && row < this.blocks[col].length, "invalid coords!");
	    return this.blocks[col][row];
	}
});