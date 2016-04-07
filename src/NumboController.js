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
		distribution: [],
		spawnTime: 1.0,

		// level data
		_numboLevel: null,
		_knownPath: [],
		_selectedBlocks: [],

		nextBlockPowerup: false,

		////////////////////
		// INITIALIZATION //
		////////////////////

		// initialize timing, initial mode
		init: function() {
			this._selectedBlocks = [];
			this._numboLevel = new NumboLevel();
			this._numboLevel.init();

			if(NJ.gameState.currentJumboId == "multiple-progression" && NJ.gameState.currentLevel != 1) {
				for(var i=0; i < NJ.getJumbo()["numberList"].length; i++) {
					NJ.getJumbo()["numberList"][i].key /= NJ.gameState.currentLevel;
				}
				NJ.gameState.currentLevel = 1;
			}

			this.initJumbo();
		},

		initJumbo: function() {
			var jumbo = NJ.gameState.getJumbo();
			this.distribution = jumbo.numberList;
			this.spawnTime = jumbo.spawnTime;
		},

		/////////////////////////////
		// SELECTION FUNCTIONALITY //
		/////////////////////////////

		// select a block in the level, adding it to the selectedBlocks collection
		// returns the new selected blocks list
		selectBlock: function(col, row) {
			cc.assert(0 <= col && col < NJ.NUM_COLS && 0 <= row && row < NJ.NUM_ROWS, "Invalid coords");

			var block = this._numboLevel.getBlock(col, row);
			var lastBlock = null;
			var deletedBlock = null;

			if (block === null)
				return null;

			if(this._selectedBlocks.length >= 2) {
				if(block == this._selectedBlocks[this._selectedBlocks.length-2]) {
					deletedBlock = this._selectedBlocks[this._selectedBlocks.length-1];
					deletedBlock.clearHighlight();
					this._selectedBlocks.splice(this._selectedBlocks.length-1, 1);
					if(NJ.settings.sounds)
						cc.audioEngine.playEffect(plops[Math.max(this._selectedBlocks.length-3, 0)]);
					return this._selectedBlocks;
				}
			}

			// TODO: possible optimization
			if (this._selectedBlocks.indexOf(block) >= 0)
				return null;

			// make sure this block is adjacent to the block before it
			if (this._selectedBlocks.length > 0) {
				lastBlock = this._selectedBlocks[this._selectedBlocks.length - 1];
				if (!this._numboLevel.isAdjBlocks(block, lastBlock))
					return null;
			}

			this._selectedBlocks.push(block);

			if(NJ.settings.sounds)
				cc.audioEngine.playEffect(plops[Math.min(this._selectedBlocks.length, plops.length-1)]);

			return this._selectedBlocks;
		},

		// deselect a single block, removing its highlight
		deselectBlock: function(col, row) {
			cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

			var block = this._numboLevel.getBlock(col, row);

			if(!block)
				return;

			block.clearHighlight();

			var index = this._selectedBlocks.indexOf(block);
			if(index >= 0)
				this._selectedBlocks.splice(index, 1);
		},

		// deselect all currently selected blocks, removing their highlights
		deselectAllBlocks: function() {
			for (var i = 0; i < this._selectedBlocks.length; ++i)
				this._selectedBlocks[i].clearHighlight();

			this._selectedBlocks = [];
		},

		// activate currently selected blocks
		// explodes blocks if needed
		// shifts all blocks down to remove gaps and drops them accordingly
		// returns the list of blocks that were cleared
		activateSelectedBlocks: function() {
			var clearedBlocks = null;

			if(this.isSelectedClearable()) {
				if(NJ.settings.sounds)
					cc.audioEngine.playEffect(res.plipSound);
					
				var selectedBlocks = this._selectedBlocks;
				var lastBlock = selectedBlocks[selectedBlocks.length - 1]
					
				var i;	
				/*
				var explodeBlocks = this.depthLimitedSearch(lastBlock.col, lastBlock.row, 1);
				explodeBlocks.filter(function(val) {
 					return selectedBlocks.indexOf(val) == -1;
				});
				var explodeBlock;
				cc.log(explodeBlocks.length);
				for(i = 0; i < explodeBlocks.length; i++) {
					explodeBlock = explodeBlocks[i];
					this.killBlock(explodeBlock);
				}*/

				// remove any affected block sprite objects:
				for(i = 0; i < selectedBlocks.length; ++i)
					this.killBlock(selectedBlocks[i]);

				clearedBlocks = selectedBlocks;
			}

			this.deselectAllBlocks();

			return clearedBlocks;
		},

		clearRows: function(num) {
			this._numboLevel.clearBottomRows(num);
		},

		killBlock: function(block) {
			this._numboLevel.killBlock(block);
		},

		killAllBlocks: function() {
			this.deselectAllBlocks();
			this._numboLevel.killAllBlocks();
		},

		// drop block into random column with random value
		// must define block size in terms of world coordinates
		// returns dropped block
		spawnDropRandomBlock: function(blockSize) {
			cc.assert(!this.isGameOver(), "Can't drop any more blocks");

			// Set up val/col
			var col = NJ.weightedRandom(this._numboLevel.getColWeights());
			var val = NJ.weightedRandom(this.distribution);

			if(NJ.settings.sounds){
				cc.audioEngine.playEffect(res.clickSound);
			}

			var powerup = null;
			if  (NJ.gameState.isPowerupMode() && this.nextBlockPowerup) {// 5% chance
				//powerup = 'clearAndSpawn';
				powerup = 'bonusOneMania';
				this.nextBlockPowerup = false;
			}

			if (powerup) {
				var path = this.meanderSearch(col, this._numboLevel.getNumBlocksInColumn(col),
					meanderSearchCriteria.pathAtLeastTwoWithNoise);
				path.shift();

				if (path && path.length > 0) {
					var sum = 0;
					for (var i in path) {
						sum += path[i].val;
					}
					val = sum;
				}
				else {
					powerup = false;
				}
			}

			return this._numboLevel.spawnDropBlock(blockSize, col, val, powerup);
		},

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

		resetKnownPath: function(){
			this._knownPath = [];
		},

		////////////
		// COMBOS //
		////////////

		updateRandomJumbo: function() {
			//console.log(NJ.jumbos.jumboDistribution);
			var butt = NJ.weightedRandom(NJ.jumbos.getJumboDistribution());
			NJ.gameState.chooseJumbo(butt);

			var jumbo = NJ.gameState.getJumbo();
			this.distribution = jumbo.numberList;
			this.spawnTime = jumbo.spawnTime;
		},

		updateJumboTo: function(jumboString){
			NJ.chooseJumbo(jumboString);
			var jumbo = NJ.gameState.getJumbo();
			this.distribution = jumbo.numberList;
			this.spawnTime = jumbo.spawnTime;
		},

		addNewNumbersToJumbo: function(){
			var jumbo = NJ.gameState.getJumbo();
			if (jumbo.thresholdNumbers){
				var level = NJ.gameState.getLevel();
				if (jumbo.thresholdNumbers[level.toString()]) {
					var newNumbers = jumbo.thresholdNumbers[level.toString()];
					for (var i = 0; i < newNumbers.length; ++i){
						this.distribution.push(newNumbers[i]);
					}
				}
				else {
					cc.log("no new numbers for level " + level);
				}
			}
			else{
				cc.log("oh crap, this distribution has no extra threshold numbers!");
			}
		},

		// updates the board/distribution given the mode is Multiple Progression
		updateProgression: function() {
			// Get possible factors based on level
			var possibleFactors = null;
			var level = NJ.gameState.getLevel();

			if(level == 3)
				possibleFactors = [2,3,4];
			else if(level == 5)
				possibleFactors = [4,5,6];
			else if(level == 7)
				possibleFactors = [6,7,8,10];
			else if(level == 9)
				possibleFactors = [8,9,10];
			else if(level == 10)
				possibleFactors = [7,8,9,11];
			else if(level == 11 || level == 12)
				possibleFactors = [9,12,13];
			else if(level > 12)
				possibleFactors = [12,13,14,15];

			if(possibleFactors != null) {
				// Change distribution by multiplying by a random factor.
				var factor = NJ.gameState.currentLevel;
				while(factor == NJ.gameState.currentLevel)
					factor = possibleFactors[Math.floor(Math.random()*possibleFactors.length)];
				for(var i=0; i < NJ.getJumbo()["numberList"].length; i++) {
					NJ.getJumbo()["numberList"][i].key /= NJ.gameState.currentLevel;
					NJ.getJumbo()["numberList"][i].key *= factor;
				}

				// Update the blocks currently on the board.
				this._numboLevel.divideBlocksBy(NJ.gameState.currentLevel);
				this._numboLevel.multiplyBlocksBy(factor);
			}
		},

        //////////
        // MISC //
        //////////

		requestPowerup: function() {
			this.nextBlockPowerup = true;
		},

		initiateOneManiaBonus: function() {
			NJ.gameState.chooseJumbo("one-mania");

			var jumbo = NJ.gameState.getJumbo();
			this.distribution = jumbo.numberList;
			this.spawnTime = jumbo.spawnTime;
		},

		copyBoard: function() {
			return this._numboLevel.getBlocks();
		},

		recallBoard: function(jumbo, blockSize) {
			NJ.gameState.chooseJumbo(jumbo.id);
			var id = jumbo.id;
			var heldJumbo = NJ.jumbos.getJumboDataWithKey(jumbo.id);
			this.distribution = heldJumbo.numberList;
			this.spawnTime = heldJumbo.spawnTime;
		},

		/////////////
		// GETTERS //
		/////////////

		isInDanger: function() {
			return this._numboLevel.getNumBlocks() / this._numboLevel.getCapacity() >= NJ.DANGER_THRESHOLD;
		},

		isGameOver: function() {
			return this._numboLevel.isFull();
		},

		getRowsToClearAfterLevelup: function() {
			var numBlocks = this._numboLevel.getNumBlocks();
			if(numBlocks < NJ.NUM_COLS)
				return 2;
			else if(numBlocks < NJ.NUM_COLS*2)
				return 1;
			else if(numBlocks > NJ.NUM_COLS*5)
				return -2;
			else if(numBlocks > NJ.NUM_COLS*4)
				return -1;
			return 0;
		},

		// a scaling factor to reduce spawn time on higher levels
		getSpawnConst: function() {
			var L = NJ.gameState.getLevel();
			return 0.5 + 2/Math.pow(L, 1/4);
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

		getBlock: function(col, row) {
			return this._numboLevel.getBlock(col, row);
		},

		getSpawnTime: function() {
			return this.getSpawnConst() * this.spawnTime;
		},

		getKnownPathLength: function(){
			return this._knownPath.length;
		},

		// checks if the current selected blocks can be activated (their equation is valid)
		isSelectedClearable: function() {
			if (!this._selectedBlocks.length || this._selectedBlocks.length < 3)
				return false;

			var selectedBlocksLength = this._selectedBlocks.length;

			var sum = 0;
			var max = 0;

			var i = 0;

			for(; i < selectedBlocksLength - 1; ++i) {
				if(!this._numboLevel.isAdjBlocks(this._selectedBlocks[i], this._selectedBlocks[i + 1]))
					return false;
			}

			for(i = 0; i < selectedBlocksLength; ++i)
				sum += this._selectedBlocks[i].val;


			for(i = 0; i < selectedBlocksLength; ++i) {
				if(sum - this._selectedBlocks[i].val == this._selectedBlocks[i].val)
					return true;
			}

			return false;//sum == this._selectedBlocks[selectedBlocksLength - 1].val;
		}
	});
}());
