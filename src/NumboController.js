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

			if (block === null)
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
				var selectedNums = this._selectedBlocks.map(function(b) {
					return b.val;
				});

				clearedBlocks = selectedBlocks.slice(0);

				var targetNum = Math.max.apply(null, selectedNums);

				// wombo comboo clear blocks of value
				/*if(selectedBlocks.length >= 5) {

					// clear all blocks adjacent to current combo:
					for(i = 0; i < selectedBlocks.length; ++i) {
						var explodeBlocks = this.depthLimitedSearch(selectedBlocks[i].col, selectedBlocks[i].row, 1);
						clearedBlocks = clearedBlocks.concat(explodeBlocks);
					}
				}*/

				var numBonus = this.getNumBonusBlocks(selectedBlocks.length);
				var bonusBlocks = this.getNRandomFreeBlocks(numBonus);

				//clearedBlocks = clearedBlocks.concat(bonusBlocks);
                
				// remove duplicates
				for(i = 0; i < clearedBlocks.length; ++i) {
					for(var j = i + 1; j < clearedBlocks.length; ++j) {
						if(clearedBlocks[i] === clearedBlocks[j])
							clearedBlocks.splice(j--, 1);
					}
				}

				// remove any affected block sprite objects:
				for(i = 0; i < clearedBlocks.length; ++i) {
					this.killBlock(clearedBlocks[i]);
				}

				this._numboLevel.updateRowsAndColumns();
			}

			this.deselectAllBlocks();

			return {clearedBlocks: clearedBlocks, bonusBlocks: bonusBlocks};
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
					this._knownPath = this.meanderSearch(block.col, block.row, meanderSearchCriteria.threeBlocksSumsToLast);
				}

				--tries;
			}

			return this._knownPath;
		},

        resetKnownPath: function(){
            this._knownPath = [];
        },

		/**
		 * Meander search generates a path randomly until the criteria boolean expression is met.
		 * @param col
		 * @param row
		 * @param criteria Criteria boolean expression
         * @returns {*}
         */
		meanderSearch: function(col, row, criteria) {
			var i;

			var searchStack = [];
			var path = [];

			var firstBlock = this._numboLevel.getBlock(col, row);
			searchStack.push(firstBlock);
			path.push(firstBlock);

			var neighbors;
			var block, neighbor;
			while(searchStack.length > 0) {
				block = searchStack.pop();

				neighbors = this._numboLevel.getNeighbors(col, row);
				neighbors = NJ.shuffleArray(neighbors);

				for(i = 0; i < neighbors.length; i++) {
					neighbor = neighbors[i];
					cc.assert(neighbor, "Get neighbors returned a null -.-");
					if(neighbor != firstBlock && path.indexOf(neighbor) < 0) {
						searchStack.push(neighbor);
						path.push(neighbor);

						if (criteria(path)) {
							return path;
						}
					}
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

        killBlock: function(block) {
            this._numboLevel.killBlock(block);
        },

        killAllBlocks: function() {
            this.deselectAllBlocks();
            this._numboLevel.killAllBlocks();
        },

		/////////////
		// GETTERS //
		/////////////

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

		// returns a list of N random blocks that are not currently selected
		getNRandomFreeBlocks: function(N){
			var randomBlocks = NJ.shuffleArray(this.getBlocksList() );

			var result = [];
			for (var i=0; i < randomBlocks.length && result.length < N; ++i) {
				var block = randomBlocks[i];
				if (this._selectedBlocks.indexOf(block) < 0) {
					result.push(block);
				}
			}

			return result;

		},

		// returns the number of bonus blocks to clear, given a wombocombo of a certain length
		getNumBonusBlocks: function(length) {
			if (length) {
				if (length <= 3)
					return 0;
				if (length == 4)
					return 1;
				if (length == 5)
					return 3;
				if (length == 6)
					return 6;
				if (length == 7)
					return 10;
				if (length == 8)
					return 15;
				if (length == 9)
					return 21;
				if (length >= 10)
					return 28;
			}
			else {
				cc.log("uh-oh! bad LENGTH value in numboController::getNumBonusBlocks()");
				return null;
			}
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

			var selectedBlocksLength = this._selectedBlocks.length;
			for(var i = 0; i < selectedBlocksLength; ++i) {
				sum += this._selectedBlocks[i].val;
			}

			for(var i = 0; i < selectedBlocksLength; ++i) {
				if(sum - this._selectedBlocks[i].val == this._selectedBlocks[i].val) {
					return true;
				}
			}

			return false;

		}
	});
}());
