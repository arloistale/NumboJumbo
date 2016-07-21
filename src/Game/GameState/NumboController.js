/**
 * Numbo Controller is the interface between the game view / user interface and the grid based game level.
 * Provides a lot of functionality related to selecting blocks in the level and spawning blocks and other
 * kinds of manipulation of the NumboLevel.
 */

var NumboController = (function() {

	// list of search filter functions for meander search
	var meanderSearchCriteria = {

		// search one of two kinds of paths randomly, either greater than 4 blocks or greater than 2 blocks
		pathAtLeastTwoWithNoise: function(path){
			return path.length >= 4 || path.length >= 2 && Math.random() > 0.5;
		},

		sumOrDifferenceIsValid: function(path){
			if (path.length != 2){
				return false;
			}

			var valA = path[0].val;
			var valB = path[1].val;
			if (valA + valB <= 9) {
				return true;
			}
			if (valB - valA >= 1){
				return true;
			}

			return false;
		},

		// search for a path of 3-4 blocks that sums to the last element
		sumsToLastValid: function(path) {
			if(path.length < 3 || path.length > 10)
				return false;

			var sum = 0;
			for (var i = 0; i < path.length - 1; ++i)
				sum += path[i].val;

			return sum == path[path.length - 1].val;
		}
	};

	return cc.Class.extend({

        // spawn data

        // current range of numbers that can be spawned
		_spawnDistribution: [],

        // numbers that added to the distribution dynamically
        _thresholdNumbers: [],

		// level data
		_numboLevel: null,
		_knownPath: [],
		_selectedBlocks: [],

		blocksDropped: 0,

		////////////////////
		// INITIALIZATION //
		////////////////////

		// initialize timing, initial mode
		init: function() {
			this._selectedBlocks = [];

            this._initLevel();
		},

		initDistribution: function(numberList, thresholdNumbers) {
			cc.assert(numberList, "Must initialize with numberlist");

			// copy the list since we will potentially modify the distribution
			this._spawnDistribution = numberList.slice(0);

			if(thresholdNumbers)
				this._thresholdNumbers = thresholdNumbers;
		},

        _initLevel: function() {
            this._numboLevel = new NumboLevel();
            this._numboLevel.init();
        },

		reset: function() {
			this._numboLevel.reset();
			this.deselectAllBlocks();
		},

		/////////////////////////////
		// SELECTION FUNCTIONALITY //
		/////////////////////////////

		// select a block in the level, adding it to the selectedBlocks collection
		// returns the block that was selected if any
		selectBlock: function(col, row) {
			cc.assert(0 <= col && col < NJ.NUM_COLS && 0 <= row && row < NJ.NUM_ROWS, "Invalid coords");

			var block = this._numboLevel.getBlock(col, row);
			var lastBlock = null;

			if (!block)
				return null;

			// TODO: possible optimization
			if (this._selectedBlocks.indexOf(block) >= 0)
				return null;

			// make sure this block is adjacent to the block before it
			if (this._selectedBlocks.length > 0) {
				lastBlock = this.getLastSelectedBlock();
				if (lastBlock && !this._numboLevel.isAdjBlocks(block, lastBlock))
					return null;
			}

			this._selectedBlocks.push(block);

			return block;
		},

		// deselect a single block, removing its highlight
		deselectLastBlock: function() {
			var lastBlock = this._selectedBlocks[this._selectedBlocks.length-1];

			this._selectedBlocks.splice(this._selectedBlocks.length - 1, 1);

			NJ.audio.playSound(plops[Math.min(Math.max(this._selectedBlocks.length - 3, 0), plops.length - 1)]);

			return lastBlock;
		},

		// deselect all currently selected blocks, removing their highlights
		deselectAllBlocks: function() {
			this._selectedBlocks = [];
		},

		// activate currently selected blocks
		// explodes blocks if needed
		// shifts all blocks down to remove gaps and drops them accordingly
		// checks if we got a wombo combo, removes all numbers of the same value as target
		// returns the list of blocks that were cleared
		activateSelectedBlocks: function() {
			var selectedBlocks = [];
			var bonusBlocks = [];

			if(this.isSelectedClearable()) {
				var i;

				selectedBlocks = this._selectedBlocks.slice(0);
				bonusBlocks = this.getBonusBlocks(selectedBlocks.length);

				// remove any affected block sprite objects:
				for(i = 0; i < selectedBlocks.length; ++i) {
					this.popKillBlock(selectedBlocks[i]);
				}

				for (i = 0; i < bonusBlocks.length; ++i){
					this.popKillBlock(bonusBlocks[i]);
				}

				this._numboLevel.updateRowsAndColumns();
			}

			this.deselectAllBlocks();

			return { selectedBlocks: selectedBlocks, bonusBlocks: bonusBlocks };
		},

        ////////////////////////////
        // Spawning Functionality //
        ////////////////////////////

		// instantiate and drop block into specified column and value
		// return dropped block
		spawnDropBlock: function(block, col, val) {
			this.blocksDropped++;
			return this._numboLevel.spawnDropBlock(block, col, val, null);
		},

		// drop block into random column with random value
		// must define block size in terms of world coordinates
		// returns dropped block
		spawnDropRandomBlock: function(block) {
			// Set up val/col
			var col = NJ.weightedRandom(this._numboLevel.getColWeights());
			var val = NJ.weightedRandom(this._spawnDistribution);

			return this.spawnDropBlock(block, col, val);
		},

		getMaxBlockFromDistribution: function() {
			return this._spawnDistribution[this._spawnDistribution.length];
		},

        // updates progression of the game based on the current level
        updateProgression: function() {
            var level = NJ.gameState.getLevel();
			this.blocksDropped = 0;

            // update new threshold numbers
            var thresholdNumbers = this._thresholdNumbers;
            if (thresholdNumbers) {
                var levelKey = level.toString();
                if (thresholdNumbers[levelKey]) {
                    var newNumbers = thresholdNumbers[levelKey];
                    for (var i = 0; i < newNumbers.length; ++i){
                        this._spawnDistribution.push(newNumbers[i]);
                    }
                }
            }
        },

        //////////////////
        // Level Search //
        //////////////////

		haveNoMoves: function() {
			this.findHint();
			return this._knownPath.length == 0;
		},

		findHint: function() {
			var block;
			var tries = 50; // try no more than 50 times
			while (tries > 0 && !this._knownPath.length) {
				block = this._numboLevel.getRandomBlock();

				if (block) {
					this._knownPath = this.meanderSearch(block.col, block.row,
						meanderSearchCriteria.sumsToLastValid, [block]);
				}

				--tries;
			}

			return this._knownPath;
		},

		resetKnownPath: function(){
			this._knownPath = [];
		},

		// count and a col/row coordinate pair.
		// returns an array of <= COUNT blocks near that coordinate,
		// excluding the block at that location and any selected blocks.
		// should run in O(S*R*C) time, where and S is the number of selected blocks,
		// and R and C are the maximum number of rows and cols (so R*C is the board size).
		spiralSearch: function(col, row, count) {
			// begin by traversing to the right
			var blocks = [];

			// begin the search here
			var colIndex = col;
			var rowIndex = row;

			// start searching in this direction
			var colStep = 0;
			var rowStep = 1;

			var tries = 0;
			while (blocks.length < count && tries < Math.pow((NJ.NUM_COLS + NJ.NUM_ROWS), 2) ) {
				++tries;

				if (0 <= colIndex && colIndex < NJ.NUM_COLS && 0 <= rowIndex && rowIndex < NJ.NUM_ROWS) {
					var block = this._numboLevel.getBlock(colIndex, rowIndex);
					if (block && this._selectedBlocks.indexOf(block) < 0) { // not already selected
						blocks.push(block);
					}
				}

				// distance from the starting point
				colDistance = col - colIndex;
				rowDistance = row - rowIndex;

				// we hit a corner, change the step direction counter-clockwise
				if ((colDistance) == (rowDistance) ||							// top-right or btm-left
					(colDistance < 0) && (colDistance) == -(rowDistance) ||		// top-left
					(colDistance > 0) && (colDistance) == 1 - (rowDistance)) {	// btm-right
					var prevColStep = colStep;
					var prevRowStep = rowStep;
					colStep = -prevRowStep;
					rowStep = prevColStep;
				}

				// step forward
				colIndex += colStep;
				rowIndex += rowStep;
			}

			return blocks;

		},

		/**
		 * Meander search generates a path randomly until the criteria boolean expression is met.
		 * @param col
		 * @param row
		 * @param criteria Criteria boolean expression
		 * @param path: array containing the first block (if you want to include it) or an empty array (if there is no first block)
         * @returns an array containing a valid path, or an empty array if one is not found
         */

		meanderSearch: function(col, row, criteria, path) {
			if (criteria(path))
				return path;

			var neighbors = NJ.shuffleArray(this._numboLevel.getNeighbors(col, row) );
			for (var i = 0; i < neighbors.length; ++i){
				var block = neighbors[i];
				if (path.indexOf(block) < 0) { // if it's not already in the path
					var newPath = path.slice(0);
					newPath.push(block);
					return this.meanderSearch(block.col, block.row, criteria, newPath);
				}
			}

			return [];
		},

		/**
		 * DLS returns blocks within a certain radius.
		 * @param col
		 * @param row
         * @param depth
         */
        depthLimitedSearch: function(col, row, depth) {
			var currBlock = this._numboLevel.getBlock(col, row);
			if(depth <= 0) {
				return currBlock ? [currBlock] : [];
			}

			var result = [];
			var neighbors = this._numboLevel.getNeighbors(col, row);

			var block;
			for (var i = 0; i < neighbors.length; i++) {
				block = neighbors[i];

				result.push(block);

				if (block) {
					result = result.concat(this.depthLimitedSearch(block.col, block.row, depth - 1));
				}
			}

			return result;
        },

        ////////////////////////
        // Level Manipulation //
        ////////////////////////

		updateTheme: function() {
			this._numboLevel.updateTheme();
		},

        popKillBlock: function(block) {
            this._numboLevel.popKillBlock(block);
        },

        killAllBlocks: function() {
            this.deselectAllBlocks();
            this._numboLevel.killAllBlocks();

			this._numboLevel.updateRowsAndColumns();
        },

		removeAllBlocks: function(){
			this.deselectAllBlocks();
			this._numboLevel.removeAllBlocks();
			this._numboLevel.updateRowsAndColumns();
		},

		clearLevel: function() {
			this.deselectAllBlocks();
			this._numboLevel.killAllBlocks();
		},

		/////////////
		// GETTERS //
		/////////////

		getSpawnDistributionMaxNumber: function() {
			return this._spawnDistribution[this._spawnDistribution.length - 1].key;
		},

		levelIsClear: function() {
			return this._numboLevel.isClear();
		},

		levelIsFull: function() {
			return this._numboLevel.isFull();
		},

		getPenultimateSelectedBlock: function() {
			if(this._selectedBlocks.length > 1)
				return this._selectedBlocks[this._selectedBlocks.length - 2];

			return null;
		},

		getLastSelectedBlock: function() {
			if(this._selectedBlocks.length > 0)
				return this._selectedBlocks[this._selectedBlocks.length - 1];

			return null;
		},

		getCapacity: function() {
			return this._numboLevel.getCapacity();
		},

		getNumBlocks: function(){
			return this._numboLevel.getNumBlocks();
		},

		getNumBlocksInColumn: function(col) {
			return this._numboLevel.getNumBlocksInColumn(col);
		},

		getSelectedBlocks: function() {
			return this._selectedBlocks;
		},

		getBlocksWithValue: function(value) {
			return this._numboLevel.getBlocksWithValue(value);
		},

		getBlocksList: function() {
			return this._numboLevel.getBlocksAsList();
		},

		areAllBlocksTheSameValue: function() {
			return this._numboLevel.areAllBlocksTheSameValue();
		},

		getBlock: function(col, row) {
			return this._numboLevel.getBlock(col, row);
		},

		getKnownPathLength: function(){
			return this._knownPath.length;
		},

		getSelectedTargetValue: function() {
			var selectedNums = this._selectedBlocks.map(function(b) {
				return b.val;
			});

			return Math.max.apply(null, selectedNums);
		},

		getMaxSelectedBlock: function(){
			var maxBlock = this._selectedBlocks[0];
			for (var i = 1; i < this._selectedBlocks.length; ++i){
				var block = this._selectedBlocks[i];
				if (block.val > maxBlock.val){
					maxBlock = block;
				}
			}
			return maxBlock;
		},

		// returns the number of bonus blocks to clear, given a wombocombo of a certain length
		getBonusBlocks: function(length) {
			cc.assert(length, "uh-oh! bad LENGTH value in numboController getBonusBlocks()");

			var numBonusBlocks = 0;

			switch(length) {
				case 4:
					numBonusBlocks = 1;
					break;
				case 5:
					numBonusBlocks = 3;
					break;
				case 6:
					numBonusBlocks = 6;
					break;
				case 7:
					numBonusBlocks = 10;
					break;
				case 8:
					numBonusBlocks = 15;
					break;
				case 9:
					numBonusBlocks = 21;
					break;
			}

			if(length >= 10) {
				numBonusBlocks = 28;
			}

			var maxBlock = this.getMaxSelectedBlock();
			return this.spiralSearch(maxBlock.col, maxBlock.row, numBonusBlocks);
		},

		// checks if the current selected blocks can be activated (their equation is valid)
		isSelectedClearable: function() {
			if (!this._selectedBlocks.length || this._selectedBlocks.length < 3)
				return false;

			//return this.sumToLast();
			return this.sumToHighest();
		},

		sumToLast: function() {
			var selectedBlocksLength = this._selectedBlocks.length;
			var sum = 0;

			for(var i = 0; i < selectedBlocksLength; ++i) {
				sum += this._selectedBlocks[i].val;
			}

			return (sum - this._selectedBlocks[i - 1].val == this._selectedBlocks[i - 1].val);
		},

		sumToHighest: function() {
			var sum = 0;
			var i;

			var selectedBlocksLength = this._selectedBlocks.length;
			for(i = 0; i < selectedBlocksLength; ++i) {
				sum += this._selectedBlocks[i].val;
			}

			for(i = 0; i < selectedBlocksLength; ++i) {
				if(sum - this._selectedBlocks[i].val == this._selectedBlocks[i].val) {
					return true;
				}
			}

			return false;
		}
	});
}());
