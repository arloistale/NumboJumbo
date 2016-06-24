/**
   Created by jonathanlu on 1/10/16.

   Part of the model-view scheme used by the level system.

   NumboLevel represents a grid with this._blocks. The actual sprites for this._blocks and level are contained
   within the MainGame scene but all logic for dropping this._blocks and shifting this._blocks
   are done in this module.

*/

var NJ = NJ || {};

// level
NJ.NUM_COLS = 6;
NJ.NUM_ROWS = 6;

var NumboLevel = (function() {

	return cc.Class.extend({

		_blocks: [],
		_numBlocks: 0,

		////////////////////
		// INITIALIZATION //
		////////////////////

		// initialize the level to empty
		init: function() {
			this._numBlocks = 0;
			this._blocks = [];

			var j;
			// create empty columns:
			for(var i = 0; i < NJ.NUM_COLS; ++i) {
				this._blocks.push([]);

				for(j = 0; j < NJ.NUM_ROWS; ++j) {
					NumboBlock.createAndPool();
				}
			}
		},

		// intended to clear the level of all blocks by killing them
		// used at game over
		clear: function() {
			this.killAllBlocks(false);
		},

		// intended to reset level
		reset: function() {
			this.killAllBlocks(true);

			this.init();
		},

		//////////////////
		// MANIPULATION //
		//////////////////

		updateTheme: function() {
			for(var i = 0; i < NJ.NUM_COLS; i++) {
				for(var j = 0; j < this._blocks[i].length; j++) {
					this._blocks[i][j].updateTheme();
				}
			}
		},

		// spawn and drop block at the given col and value
		// returns spawned block
		// DO NOT publicly use directly!!! Use NumboController spawnDropRandomBlock instead
		spawnDropBlock: function(block, col, val) {
			cc.assert(0 <= col && col < NJ.NUM_COLS && this._blocks[col].length < NJ.NUM_ROWS,
				"Invalid coords: " + col + " has length " + this._blocks[col].length);

			block.initValues(col, this._blocks[col].length, val);
			this._blocks[col].push(block);
			this._numBlocks++;
			return block;
		},

		removeBlock: function(block) {
			cc.assert(block, "Invalid block");

			var col = block.col;
			var row = block.row;
			block.remove();

			// mark this block as null
			// later when we update rows and columns we will remove from the array
			this._blocks[col][row] = null;
		},

		fadeKillBlock: function(block) {
			cc.assert(block, "Invalid block");

			var col = block.col;
			var row = block.row;
			block.fadeKill();

			// mark this block as null
			// later when we update rows and columns we will remove from the array
			this._blocks[col][row] = null;
		},

		// popKill given block
		popKillBlock: function(block) {
			cc.assert(block, "Invalid block");

			var col = block.col;
			var row = block.row;
			block.popKill();

			// mark this block as null
			// later when we update rows and columns we will remove from the array
			this._blocks[col][row] = null;
		},

		killAllBlocks: function() {
			for (var col = 0; col < NJ.NUM_COLS; ++col){
				for (var row = this._blocks[col].length - 1; row >= 0; --row){
					var block = this._blocks[col][row];
					// make sure block wasn't already cleared
					if(block)
						this.fadeKillBlock(block);
				}
			}
		},

		/////////////
		// GETTERS //
		/////////////

		// search for a legit column to drop block into.
		// does not return columns which are empty.
		// prioritizes columns adjacent to non-empty columns, if possible.
		// returns the valid column found
		getRandomValidCol: function(){
			cc.assert(!this.isFull(), "cannot spawn brick when board is full!");

			var nonEmptyExists = false;
			for (var i=0; i< NJ.NUM_COLS; ++i) {
				if (this._blocks[i].length > 0)
					nonEmptyExists = true;
			}

			var legit = false;
			while (legit == false ) {
				var col = Math.floor(Math.random() * NJ.NUM_COLS);
				if (this._blocks[col].length >= NJ.NUM_ROWS)
					legit = false;
				else if (nonEmptyExists == true) {
					if (col > 0 && this._blocks[col - 1].length > 0)
						legit = true;
					else if (col < NJ.NUM_COLS-1 && this._blocks[col + 1].length>0)
						legit = true;
				}
				else
					legit = true;
			}

			return col;
		},

		// returns list of objects containing column weighting information
		getColWeights: function() {
			var weights = [];
			var weightObjects = [];

			for(var c=0; c<NJ.NUM_COLS; c++) {
				// Get number of spaces in each column.
				weights[c] = NJ.NUM_ROWS - this._blocks[c].length;
				// Ignore columns which have only empty neighbors.
				if (c == 0) {
					if (this._blocks[c + 1].length == 0)
						weights[c] = 0;
				}
				else if (c == NJ.NUM_COLS - 1) {
					if (this._blocks[c - 1].length == 0)
						weights[c] = 0;
				}
				else if (this._blocks[c - 1].length == 0
					&& this._blocks[c + 1].length == 0) {
					weights[c] = 0;
				}
				// Square weights.
				weights[c] = Math.pow(weights[c], 2);
			}

			// Set weights equal if board is empty.
			if(weights.every(function(element) {
					return element === 0;
				})) {
				for(var i=0; i<weights.length; i++)
					weights[i] = 1;
			}

			// Convert weights to objects.
			for(var i=0; i<weights.length; i++) {
				weightObjects.push({key: i, weight: weights[i]});
			}

			return weightObjects;
		},

		getBlocks: function() {
			return this._blocks;
		},

		// Returns the number of this._blocks in the level
		getNumBlocks: function() {
			return this._numBlocks;
		},

		// grabs a random block, or null if the board is empty
		getRandomBlock: function(){
			var cols = [];
			for (var i = 0; i < NJ.NUM_COLS; ++i){
				if (this._blocks[i].length > 0) {
					cols.push({key: i, weight: this._blocks[i].length});
				}
			}

			var col = NJ.weightedRandom(cols);
			if(this._blocks[col] && this._blocks[col].length) {
				var row = Math.floor(Math.random() * this._blocks[col].length);
				return this.getBlock(col, row);
			}

			return null;
		},

		// Returns the total capacity of the level
		getCapacity: function() {
			return NJ.NUM_COLS * NJ.NUM_ROWS;
		},

		getBlocksInColumn: function(col){
			cc.assert(0 <= col && col < NJ.NUM_COLS, "bad column value fucker: " + col);

			var column = [];
			for (var row = 0; row < this._blocks[col].length; ++row){
				column.push(this._blocks[col][row]);
			}
			return column;
		},

		isClear: function() {
			return this._numBlocks == 0;
		},

		// returns whether level is currently full of this._blocks
		isFull: function() {
			return this._numBlocks >= NJ.NUM_COLS * NJ.NUM_ROWS;
		},

		// returns whether two coordinates are adjacent (diagonal allowed)
		isAdjCoords: function(col1, row1, col2, row2) {
			return Math.abs(col2 - col1) <= 1 && Math.abs(row2 - row1) <= 1;
		},

		// returns whether two this._blocks are adjacent (diagonal allowed)
		isAdjBlocks: function(block1, block2) {
			return this.isAdjCoords(block1.col, block1.row, block2.col, block2.row);
		},

		// returns a list of all this._blocks with the given value
		getBlocksWithValue: function(value) {
			var result = [];

			for(var i = 0; i < NJ.NUM_COLS; ++i) {
				for(var j = 0; j < this._blocks[i].length; ++j) {
					if(this._blocks[i][j].val == value)
						result.push(this._blocks[i][j]);
				}
			}

			return result;
		},

		// returns a list of neighbors adjacent to this block
		// takes in an object either containing a block variable or a col/row pair
		getNeighbors: function(col, row) {
			var neighbors = [];

			var numRowsInColumn = this._blocks[col].length;

			if (col > 0) { // grab this._blocks in column to the left
				if (row > 0 && this.getBlock(col-1, row-1))
					neighbors.push(this.getBlock(col-1, row-1));
				if (row < numRowsInColumn - 1 && this.getBlock(col-1, row+1))
					neighbors.push(this.getBlock(col-1, row+1));
				if (this.getBlock(col-1, row))
					neighbors.push(this.getBlock(col-1, row));
			}
			if (row > 0 && this.getBlock(col, row-1)) // grab block below
				neighbors.push(this.getBlock(col, row-1));
			if (row < numRowsInColumn - 1 && this.getBlock(col, row+1)) // grab block above
				neighbors.push(this.getBlock(col, row+1));
			if (col < NJ.NUM_COLS - 1) { // grab this._blocks in column to the right
				if (row > 0 && this.getBlock(col+1, row-1))
					neighbors.push(this.getBlock(col+1, row-1));
				if (row < numRowsInColumn - 1 && this.getBlock(col+1, row+1))
					neighbors.push(this.getBlock(col+1, row+1));
				if (this.getBlock(col+1, row))
					neighbors.push(this.getBlock(col+1, row));
			}

			return neighbors;
		},

		// returns whether a block exists at given coords
		getBlock: function(col, row) {
			cc.assert(0 <= col && col < NJ.NUM_COLS &&
				0 <= row && NJ.NUM_ROWS,
				"block coordinates out of bounds! (col: " + col + ", row: " + row + ")");

			return row < this._blocks[col].length ? this._blocks[col][row] : null;
		},

		getCurrentBlocks: function() {
			var currentBlocks = [];
			for(var i=0; i<NJ.NUM_COLS; i++) {
				for(var j=0; j< NJ.NUM_ROWS; j++) {
					var block = this.getBlock(i,j);
					if(block != null)
						currentBlocks.push(block);
				}
			}
			return currentBlocks;
		},

		getNumBlocksInColumn: function(col) {
			cc.assert(0 <= col && col < NJ.NUM_COLS,
				"col out of bounds! (col: " + col + ")");

			return this._blocks[col].length;
		},

		// returns true iff all blocks w/in distance 2 of the frontier have the same value
		areAllBlocksTheSameValue: function(){
			if (this._numBlocks >= 2){
				var aBlockVal = null;
				for (var col = 0; col < NJ.NUM_COLS; ++col){
					for (var row = this._blocks[col].length - 1; row >= 0; --row){
						if (aBlockVal == null){
							aBlockVal = this._blocks[col][row].val;
						}
						else if (this._blocks[col][row].val != aBlockVal){
							return false;
						}
					}
				}
			}

			return true;
		},

		//////////////////////
		// Collapse Helpers //
		//////////////////////

		// each block's row and column must be updated
		updateRowsAndColumns: function() {
			var i = 0, j = 0;

			// drop all affected blocks down
			for(i = 0; i < NJ.NUM_COLS; ++i) {
				for (j = 0; j < this._blocks[i].length; ++j) {
					if(this._blocks[i][j] == null) {
						this._blocks[i].splice(j, 1);
						j--;
						this._numBlocks--;
					}
				}
			}

			// collapse columns if there is an empty middle column
			var seenNonEmpty = false;
			var collapsed = false;
			for(i = 0; i < NJ.NUM_COLS - 1 && collapsed == false; ++i) {
				if (this._blocks[i].length > 0){
					seenNonEmpty = true;
				}
				if(seenNonEmpty == true && this._blocks[i].length == 0) {
					this._collapseColumnsToward(i);
					collapsed = true;
				}
			}

			var block;

			for(i = 0; i < NJ.NUM_COLS; ++i) {
				for (j = 0; j < this._blocks[i].length; ++j) {
					block = this._blocks[i][j];
					block.col = i;
					block.row = j;
				}
			}
		},

		// takes in the indeces of two columns in blocks[] and swaps them.
		// does not fix the internal block.col values;
		// use updateBlockRowsAndCols() for that.
		// (perhaps should create a new one that only updates locally)
		_swapColumns: function(i, j) {
			cc.assert(0 <= i && i < NJ.NUM_COLS, "invalid column! " + i);
			cc.assert(0 <= j && j < NJ.NUM_COLS, "invalid column! " + j);

			var t = this._blocks[i];
			this._blocks[i] = this._blocks[j];
			this._blocks[j] = t;
		},

		_collapseLeftSideToward: function(col) {
			cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

			// find an empty column:
			for (var e = col; e >= 0; --e) {
				if (this._blocks[e].length == 0) { // found one
					// find index of next non-empty column:
					for (var n = e; n >= 0; --n) {
						if (this._blocks[n].length > 0) { // found one
							this._swapColumns(n, e);
							break; // should maybe write this w/o break :p
						}
					}
				}
			}
		},

		_collapseRightSideToward: function(col){
			cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

			// find an empty column:
			for (var e = col; e < NJ.NUM_COLS; ++e) {
				if (this._blocks[e].length == 0) { // found one
					// find index of next non-empty column:
					for (var n = e; n < NJ.NUM_COLS; ++n) {
						if (this._blocks[n].length > 0) {// found one
							this._swapColumns(n, e);
							break; // TODO: should maybe write this w/o break :p
						}
					}
				}
			}
		},

		// takes in the index of a column in bricks[][].
		// moves all non-empty columns toward that col
		// (cols to the left of col move rightward, and vice-versa)
		_collapseColumnsToward: function (col) {
			cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
			this._collapseLeftSideToward(col);
			this._collapseRightSideToward(col);
		}
	});
}());