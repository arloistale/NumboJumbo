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

		// search for a path of 3 blocks that sums to the last element
		threeBlocksSumsToLast: function(path) {
			var sum = 0;
			for (var i = 0; i < path.length - 1; ++i)
				sum += path[i].val;

			return path.length >= 3 && path.length <= 4 && sum == path[path.length - 1].val;
		}
	};

	return cc.Class.extend({

        // spawn data

        // current range of numbers that can be spawned
		_spawnDistribution: [],

        // numbers that added to the distribution dynamically
        _thresholdNumbers: [],

        // factor for how much each number should be multiplied when spawning
        _spawnScale: 1,

		// level data
		_numboLevel: null,
		_knownPath: [],
		_selectedBlocks: [],

		// the element at index i of the cache represents the (i + 3) combo length bonus blocks image
		_bonusBlocksImageCache: [],

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

			// TODO: should be done in gamelayer, we make the block highlight itself here for convenience
			this._selectedBlocks.push(block);

			if(NJ.settings.sounds)
				cc.audioEngine.playEffect(plops[Math.min(this._selectedBlocks.length, plops.length - 1)]);

			return block;
		},

		// deselect a single block, removing its highlight
		deselectLastBlock: function() {
			var lastBlock = this._selectedBlocks[this._selectedBlocks.length-1];

			this._selectedBlocks.splice(this._selectedBlocks.length - 1, 1);

			if(NJ.settings.sounds)
				cc.audioEngine.playEffect(plops[Math.min(Math.max(this._selectedBlocks.length - 3, 0), plops.length - 1)]);

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
			var clearedBlocks = [];

			if(this.isSelectedClearable()) {
				var i;

					//cc.audioEngine.playEffect(res.plipSound);

				var selectedBlocks = this._selectedBlocks;

				clearedBlocks = selectedBlocks.slice(0);

				//clearedBlocks = clearedBlocks.concat(this._bonusBlocksImageCache);

				// remove duplicates
				for(i = 0; i < clearedBlocks.length; ++i) {
					for(var j = i + 1; j < clearedBlocks.length; ++j) {
						if(clearedBlocks[i] === clearedBlocks[j])
							clearedBlocks.splice(j--, 1);
					}
				}

				// remove any affected block sprite objects:
				for(i = 0; i < clearedBlocks.length; ++i) {
					this.popKillBlock(clearedBlocks[i]);
				}

				this._numboLevel.updateRowsAndColumns();
			}

			this.deselectAllBlocks();

			return { clearedBlocks: clearedBlocks, bonusBlocks: [] };
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
			var val = NJ.weightedRandom(this._spawnDistribution) * this._spawnScale;

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

        // scale the numbers in the spawn distribution by a factor
        scaleSpawnDistribution: function() {
            // Check for Jumbo Swap
            if (NJ.gameState.currentJumboId == "multiple-progression") {

                // Get possible factors based on level
                var possibleFactors = null;
                var level = NJ.gameState.getLevel();

                if (level == 3)
                    possibleFactors = [2, 3, 4];
                else if (level == 5)
                    possibleFactors = [4, 5, 6];
                else if (level == 7)
                    possibleFactors = [6, 7, 8, 10];
                else if (level == 9)
                    possibleFactors = [8, 9, 10];
                else if (level == 10)
                    possibleFactors = [7, 8, 9, 11];
                else if (level == 11 || level == 12)
                    possibleFactors = [9, 12, 13];
                else if (level > 12)
                    possibleFactors = [12, 13, 14, 15];

                if (possibleFactors != null) {
                    // Change spawn scale factor
                    var factor = NJ.gameState.currentLevel;
                    while (factor == NJ.gameState.currentLevel)
                        factor = possibleFactors[Math.floor(Math.random() * possibleFactors.length)];

                    this._spawnScale = factor;

                    // Update the blocks currently on the board.
                    this._numboLevel.divideBlocksBy(NJ.gameState.currentLevel);
                    this._numboLevel.multiplyBlocksBy(factor);
                }
            }
        },

        //////////////////
        // Level Search //
        //////////////////

		findHint: function() {
			var tries = 50; // try no more than 50 times
			while (tries > 0 && this._knownPath.length == 0) {
				var block = this._numboLevel.getRandomBlock();

				if(block) {
					this._knownPath = this.meanderSearch(block.col, block.row,
						meanderSearchCriteria.threeBlocksSumsToLast, [block]);
				}

				--tries;
			}

			return this._knownPath;
		},

		// returns a col/val pair such that the column is legal to spawn in,
		// and the value has at least one solution associated with it
		// useful if we want to guarantee spawning a 'good' block
		findLocationAndValueForNewBlock: function(){
			var maxTries = 500;
			var path = [];
			var col = null;
			var val = 0;
			var i;
			for (i = 0; i < maxTries && path.length == 0; ++i){
				col = this._numboLevel.getRandomValidCol();
				var row = this._numboLevel.getNumBlocksInColumn(col);
				if (row >= 0){
					path = this.meanderSearch(col, row,
						meanderSearchCriteria.sumOrDifferenceIsValid, []);
				}
			}

			if (path.length == 2){
				var valA = path[0].val;
				var valB = path[1].val;
				if (valA + valB <= 9) {
					val = valA + valB;
				}
				else if (valB - valA >= 1){
					val = valB - valA;
				}


			}
			return {col: col, val: val};

		},

		findLocationAndValueForTwoNewBlocks: function (){
			var valA = null;
			var valB = null;
			var colA = null;
			var colB = null;

			// find the indices of non-empty columns, then shuffle them, then iterate over them
			var colIndices = [];
			for (var colI = 0; colI < NJ.NUM_COLS; ++colI){
				var column = this._numboLevel.getBlocksInColumn(colI);
				if (column && column.length < NJ.NUM_ROWS) {
					colIndices.push(colI);
				}
			}
			var colIndicesShuffled = colIndices.slice(0);
			NJ.shuffleArray(colIndicesShuffled);

			var printString = "";
			for (var colI = 0; colI < colIndicesShuffled.length; ++colI){
				var column = this._numboLevel.getBlocksInColumn(colIndicesShuffled[colI]);
			}

			// attempt to place both blocks in a single column (because it's easier, that's why):
			for (var colI = 0; colI < colIndicesShuffled.length; ++colI){
				var column = this._numboLevel.getBlocksInColumn(colIndicesShuffled[colI]);
				if (column.length < NJ.NUM_ROWS - 2){
					colA = colB = colIndicesShuffled[colI];
					var valOfExisting = column[column.length-1].val;
					valA = Math.floor( ( ( valOfExisting - 1) * Math.random() )+ 1);
					valB = valOfExisting - valA;

					return [{col: colA, val: valA}, {col: colB, val: valB}];
				}
			}

			// ok, that didn't work, so lets try to find two neighboring non-empty columns
			// such that adding a block to each will result in them being adjacent
			// (ie, ignore spawning one block in a near-empty column and the other in a
			// near-ful column, because that wouldn't help anything).
			// note that here we ignore the far-left and far-right columns,
			// so as not to have 3 different cases. but those will be covered
			// by the check we do on their immedate neighbor.
			var leftIndex = colIndices.indexOf(0);
			if (leftIndex >= 0){
				colIndices.splice(leftIndex, 1);
			}
			var rightIndex = colIndices.indexOf(NJ.NUM_COLS - 1);
			if (rightIndex >= 0){
				colIndices.splice(rightIndex, 1);
			}

			for (var colI = 0; colI < colIndices.length; ++colI){
				var column = this._numboLevel.getBlocksInColumn(colIndices[colI]);
				var leftLength = this._numboLevel.getBlocksInColumn(colIndices[colI] - 1).length;
				var rightLength = this._numboLevel.getBlocksInColumn(colIndices[colI] + 1).length;
				var colLength = column.length;
				if (colLength < NJ.NUM_ROWS && leftLength < NJ.NUM_ROWS && Math.abs(colLength - leftLength) <= 1){
					valA = Math.floor( ( ( column[colIndices[colI]].val - 1) * Math.random() )+ 1);
					valB = column[colIndices[colI]].val - valA;
					colA = colIndices[colI];
					colB = colIndices[colI] - 1;

					return [{col: colA, val: valA}, {col: colB, val: valB}];
				}
				else if (colLength < NJ.NUM_ROWS && rightLength < NJ.NUM_ROWS && Math.abs(colLength - rightLength) <= 1){
					valA = Math.floor( ( ( column[colIndices[colI]].val - 1) * Math.random() )+ 1);
					valB = column[colIndices[colI]].val - valA;
					colA = colIndices[colI];
					colB = colIndices[colI] + 1;

					return [{col: colA, val: valA}, {col: colB, val: valB}];
				}
			}

			cc.log("find location for two blocks did not return anything!" +
				" crap, might as well throw our hands in the air and spawn random stuff");

		},


        resetKnownPath: function(){
            this._knownPath = [];
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
        },

		/////////////
		// GETTERS //
		/////////////

		clearLevel: function() {
			this._numboLevel.clear();
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
			return this._numboLevel.getCurrentBlocks();
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

		// returns the number of bonus blocks to clear, given a wombocombo of a certain length
		getBonusBlocks: function(length) {
			cc.assert(length, "uh-oh! bad LENGTH value in numboController::getBonusBlocks()");

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
				case 10:
					numBonusBlocks = 28;
					break;
			}

			var womboComboType = 0;
			var itorBlock;
			var result = [];

			switch(womboComboType) {
				// random
				case 0:
					var randomBlocks = NJ.shuffleArray(this.getBlocksList());

					for (var i = 0; i < randomBlocks.length && result.length < numBonusBlocks; ++i) {
						itorBlock = randomBlocks[i];
						if (this._selectedBlocks.indexOf(itorBlock) < 0) {
							result.push(itorBlock);
						}
					}
					break;
				// highest
				case 1:
					var sortedBlocks = this.getBlocksList().sort(function(a, b) {
						return a.val - b.val;
					});

					var count = numBonusBlocks;
					while(sortedBlocks.length > 0 && count > 0) {
						itorBlock = sortedBlocks.pop();
						if(this._selectedBlocks.indexOf(itorBlock) < 0) {
							result.push(itorBlock);
							count--;
						}
					}

					break;
			}

			return result;
		},

		// checks if the current selected blocks can be activated (their equation is valid)
		isSelectedClearable: function() {
			if (!this._selectedBlocks.length || this._selectedBlocks.length < 3)
				return false;


			// "order-less"
			return this.sumToHighest();

			// "order matters"
			// return this.sumToLast();
		},

		sumToLast: function(){
			var selectedBlocksLength = this._selectedBlocks.length;
			var sum = 0;

			for(var i = 0; i < selectedBlocksLength; ++i) {
				sum += this._selectedBlocks[i].val;
			}

			return (sum - this._selectedBlocks[i - 1].val == this._selectedBlocks[i - 1].val);
		},

		sumToHighest: function(){
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
