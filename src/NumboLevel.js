/**
   Created by jonathanlu on 1/10/16.

   Part of the model-view scheme used by the level system.

   NumboLevel represents a grid with blocks. The actual sprites for blocks and level are contained
   within the MainGame scene but all logic for dropping blocks and shifting blocks
   are done in this module.

*/

var NJ = NJ || {};

// level
NJ.NUM_COLS = 6;
NJ.NUM_ROWS = 6;

var NumboLevel = (function() {

	var blocks = [];
	var numBlocks = 0;

	// takes in the indeces of two columns in blocks[] and swaps them.
	// does not fix the internal block.col values;
	// use updateBlockRowsAndCols() for that.
	// (perhaps should create a new one that only updates locally)
	var swapColumns = function(i, j) {
		cc.assert(0 <= i && i < NJ.NUM_COLS, "invalid column! " + i);
		cc.assert(0 <= j && j < NJ.NUM_COLS, "invalid column! " + j);

		var t = blocks[i];
		blocks[i] = blocks[j];
		blocks[j] = t;
	};

	var collapseLeftSideToward = function(col) {
		cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

		// find an empty column:
		for (var e = col; e >= 0; --e) {
			if (blocks[e].length == 0) { // found one
				// find index of next non-empty column:
				for (var n = e; n >= 0; --n) {
					if (blocks[n].length > 0) { // found one
						swapColumns(n, e);
						break; // should maybe write this w/o break :p
					}
				}
			}
		}
	};

	var collapseRightSideToward = function(col){
		cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);

		// find an empty column:
		for (var e = col; e < NJ.NUM_COLS; ++e) {
			if (blocks[e].length == 0) { // found one
				// find index of next non-empty column:
				for (var n = e; n < NJ.NUM_COLS; ++n) {
					if (blocks[n].length > 0) {// found one
						swapColumns(n, e);
						break; // TODO: should maybe write this w/o break :p
					}
				}
			}
		}
	};

	// takes in the index of a column in bricks[][].
	// moves all non-empty columns toward that col
	// (cols to the left of col move rightward, and vice-versa)
	var collapseColumnsToward = function (col) {
		cc.assert(0 <= col && col < NJ.NUM_COLS, "invalid column! " + col);
		collapseLeftSideToward(col);
		collapseRightSideToward(col);

		for (var i = 0; i < NJ.NUM_COLS; ++i){
			for (var j = 0; j < blocks[i].length; ++j){
				if (blocks[i][j]) {
					blocks[i][j].col = i;
				}
			}
		}
	};

	return cc.Class.extend({

		////////////////////
		// INITIALIZATION //
		////////////////////

		// initialize the level to empty
		init: function() {
			numBlocks = 0;
			blocks = [];

			// create empty columns:
			for(var i = 0; i < NJ.NUM_COLS; ++i)
				blocks.push([]);
		},

		//////////////////
		// MANIPULATION //
		//////////////////

		// spawn and drop block at the given col and value
		// returns spawned block
		// DO NOT publicly use directly!!! Use NumboController spawnDropRandomBlock instead
		spawnDropBlock: function(blockSize, col, val, powerup) {
			cc.assert(0 <= col && col < NJ.NUM_COLS && blocks[col].length < NJ.NUM_ROWS, "Invalid coords");

			var block = new NumboBlock(blockSize);

			block.init(col, blocks[col].length, val, powerup);
			blocks[col].push(block);
			numBlocks++;
			return block;
		},

		// kill given block
		killBlock: function(block) {
			cc.assert(block, "Invalid block");

			var col = block.col;
			var row = block.row;
			block.kill();

			// naturally the blocks collection for this column will rearrange itself
			blocks[col].splice(row, 1);
			numBlocks--;

			if(blocks[col].length > 0) {
				// update internal row index to reflect new indices
				for (var j = row; j < blocks[col].length; ++j) {
					blocks[col][j].row = j;
				}

			} else if(col > 0 && col < NJ.NUM_COLS - 1 && blocks[col - 1].length && blocks[col + 1].length) {
				// collapse columns inward if we have cleared a column between two other non empty columns
				collapseColumnsToward(col);
			}
		},

		// kill block at given coordinates
		killBlockAtCoords: function(col, row) {
			cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

			if (row < blocks[col].length)
				this.killBlock(blocks[col][row]);
		},

		killAllBlocks: function() {
			for (var col = 0; col < NJ.NUM_COLS; ++col){
				for (var row = blocks[col].length - 1; row >= 0; --row){
					var block = blocks[col][row];
					this.killBlock(block);
				}
			}
		},

		divideBlocksBy: function(factor) {
			for(var i = 0; i < NJ.NUM_COLS; i++) {
				for(var j = 0; j < NJ.NUM_ROWS; j++) {
					if(blocks[i][j]) {

						blocks[i][j].val = blocks[i][j].val / factor;
						blocks[i][j].valueLabel.setString(blocks[i][j].val);
					}
				}
			}
		},

		multiplyBlocksBy: function(factor) {
			for(var i = 0; i < NJ.NUM_ROWS; i++) {
				for(var j = 0; j < NJ.NUM_COLS; j++) {
					if(blocks[i][j]) {
						blocks[i][j].val = blocks[i][j].val * factor;
						blocks[i][j].valueLabel.setString(blocks[i][j].val);
					}
				}
			}
		},

		clearBottomRows: function(num) {
			for(var c = 0; c < NJ.NUM_COLS; c++) {
				for(var r = 0; r < num; r++)
					this.killBlockAtCoords(c, r);
			}

			this.collapseColumnsToward(Math.floor(NJ.NUM_COLS/2));
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
				if (blocks[i].length > 0)
					nonEmptyExists = true;
			}

			var legit = false;
			while (legit == false ) {
				var col = Math.floor(Math.random() * NJ.NUM_COLS);
				if (blocks[col].length >= NJ.NUM_ROWS)
					legit = false;
				else if (nonEmptyExists == true) {
					if (col > 0 && blocks[col - 1].length > 0)
						legit = true;
					else if (col < NJ.NUM_COLS-1 && blocks[col + 1].length>0)
						legit = true;
				}
				else
					legit = true;
			}

			return col;
		},

		// TODO: get rid of this?
		getAllValidCols: function(){
			validCols = [];

			// check if column is full:
			for (var c = 0; c < NJ.NUM_COLS; ++c){
				if (blocks[c].length < NJ.NUM_ROWS)
					validCols.push(true);
				else
					validCols.push(false);
			}

			if (numBlocks > 0) {
				// check if column is adjacent to a non-empty column:
				for (var c = 0; c < NJ.NUM_COLS; ++c) {
					if (validCols[c]) {
						if (c == 0) {
							if (blocks[c+1].length == 0)
								validCols[c] = false;
						}
						else if (c == NJ.NUM_COLS - 1) {
							if ( blocks[c-1].length == 0)
								validCols[c] = false;
						}
						else if (blocks[c-1].length == 0
							&& blocks[c+1].length == 0) {
							validCols[c] = false;
						}
					}
				}
			}

			var validAsList = [];
			for (var c = 0; c < NJ.NUM_COLS; ++c)
				if (validCols[c])
					validAsList.push(c);

			return validAsList;

		},

		// returns list of objects containing column weighting information
		getColWeights: function() {
			var weights = [];
			var weightObjects = [];

			for(var c=0; c<NJ.NUM_COLS; c++) {
				// Get number of spaces in each column.
				weights[c] = NJ.NUM_ROWS - blocks[c].length;
				// Ignore columns which have only empty neighbors.
				if (c == 0) {
					if (blocks[c + 1].length == 0)
						weights[c] = 0;
				}
				else if (c == NJ.NUM_COLS - 1) {
					if (blocks[c - 1].length == 0)
						weights[c] = 0;
				}
				else if (blocks[c - 1].length == 0
					&& blocks[c + 1].length == 0) {
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

		// Returns the number of blocks in the level
		getNumBlocks: function() {
			return numBlocks;
		},

		// grabs a random block, or null if the board is empty
		getRandomBlock: function(){
			var cols = [];
			for (var i = 0; i < NJ.NUM_COLS; ++i){
				if (blocks[i].length > 0) {
					cols.push({key: i, weight: blocks[i].length});
				}
			}

			var col = NJ.weightedRandom(cols);
			if(blocks[col] && blocks[col].length) {
				var row = Math.floor(Math.random() * blocks[col].length);
				return this.getBlock(col, row);
			}

			return null;
		},

		// Returns the total capacity of the level
		getCapacity: function() {
			return NJ.NUM_COLS * NJ.NUM_ROWS;
		},

		// returns whether level is currently full of blocks
		isFull: function() {
			return numBlocks >= NJ.NUM_COLS * NJ.NUM_ROWS;
		},

		// returns whether two coordinates are adjacent (diagonal allowed)
		isAdjCoords: function(col1, row1, col2, row2) {
			return Math.abs(col2 - col1) <= 1 && Math.abs(row2 - row1) <= 1;
		},

		// returns whether two blocks are adjacent (diagonal allowed)
		isAdjBlocks: function(block1, block2) {
			return this.isAdjCoords(block1.col, block1.row, block2.col, block2.row);
		},

		// returns a list of neighbors adjacent to this block
		// takes in an object either containing a block variable or a col/row pair
		getNeighbors: function(col, row) {
			var neighbors = [];

			var numRowsInColumn = blocks[col].length;

			if (col > 0) { // grab blocks in column to the left
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
			if (col < NJ.NUM_COLS - 1) { // grab blocks in column to the right
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

			return row < blocks[col].length ? blocks[col][row] : null;
		},

		getNumBlocksInColumn: function(col) {
			cc.assert(0 <= col && col < NJ.NUM_COLS,
				"col out of bounds! (col: " + col + ")");

			return blocks[col].length;
		}
	});
}());