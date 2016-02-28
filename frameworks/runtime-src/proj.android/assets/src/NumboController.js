var NumboController = cc.Class.extend({
	distribution: [],
	jumboDistribution: [],
	spawnTime: 1.0,

	// level data
	_numboLevel: null,

	_selectedBlocks: [],

	comboTimes: [],

	////////////////////
	// INITIALIZATION //
	////////////////////


	// initialize timing, initial mode
	init: function() {
	    this._selectedBlocks = [];
	    this._numboLevel = new NumboLevel();
	    this._numboLevel.init();

		if(NJ.gameState.currentJumboId == "multiple-progression" && NJ.gameState.currentLevel != 1) {
			for(var i=0; i < NJ.getCurrentJumbo()["numberList"].length; i++) {
				NJ.getCurrentJumbo()["numberList"][i].key /= NJ.gameState.currentLevel;
			}
			NJ.gameState.currentLevel = 1;
		}

        this.initJumbo();
		this.initJumboDistribution();
	},

    initJumbo: function() {
        var jumbo = NJ.getCurrentJumbo();
        this.distribution = jumbo.numberList;
        this.spawnTime = jumbo.spawnTime;
    },

	initJumboDistribution: function(){
		for (var KEY in NJ.jumbos.data.jumbos){
			this.jumboDistribution.push({key: KEY, weight: NJ.jumbos.data.jumbos[KEY].weight});
		}
	},

	/////////////////////////////
	// SELECTION FUNCTIONALITY //
	/////////////////////////////

	// select a block in the level, adding it to the selectedBlocks collection
	// returns an object containing { currentSelectedBlock, lastSelectedBlock }, or null if there was no block
	selectBlock: function(col, row) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS && 0 <= row && row < NJ.NUM_ROWS, "Invalid coords");

	    var block = this._numboLevel.getBlock(col, row);
		var lastBlock = null;

	    if(!block)
			return null;

	    // TODO: possible optimization
	    if(this._selectedBlocks.indexOf(block) >= 0)
			return null;

	    // make sure this block is adjacent to the block before it
	    if (this._selectedBlocks.length > 0){
			lastBlock = this._selectedBlocks[this._selectedBlocks.length-1];
			if (!this._numboLevel.isAdjBlocks(block, lastBlock) )
				return null;
	    }

	    this._selectedBlocks.push(block);

	    if(NJ.settings.sounds)
			cc.audioEngine.playEffect(res.plopSound);

		return {
			currBlock: block,
			lastBlock: lastBlock
		};
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
	// shifts all blocks down to remove gaps and drops them accordingly
	// returns the number of blocks cleared if successful, or 0 otherwise
	activateSelectedBlocks: function() {
		var powerupValue = null;

	    var selectedBlockCount = 0;
	    if(this.isSelectedClearable()) {
			selectedBlockCount = this._selectedBlocks.length;
			var blockSum = 0;
			for (var block in this._selectedBlocks) {
				blockSum += this._selectedBlocks[block].val;
				if (this._selectedBlocks[block].powerup) {
					powerupValue = this._selectedBlocks[block].val;
				}
			}

			NJ.stats.blocksCleared += selectedBlockCount;
			if(selectedBlockCount > NJ.stats.maxComboLength)
			    NJ.stats.maxComboLength = selectedBlockCount;

			var lastCol = this._selectedBlocks[selectedBlockCount - 1].col;

			if(NJ.settings.sounds)
			    cc.audioEngine.playEffect(res.plipSound);

			// remove any affected block sprite objects:
			for(var i = 0; i < this._selectedBlocks.length; ++i)
			    this._numboLevel.killBlock(this._selectedBlocks[i]);

			this._numboLevel.collapseColumnsToward(lastCol);

			this.updateCombo(Date.now());
	    }

	    this.deselectAllBlocks();

	    return { cleared: selectedBlockCount, blockSum: blockSum, powerupValue: powerupValue};
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

		var powerup = NJ.gameState.powerupMode && (Math.random() < 0.05); // 5% chance
		if (powerup) {
			var path = this.meanderSearch(col, this._numboLevel.blocks[col].length,
				this.pathAtLeastTwoWithNoiseCriteria, []);
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

	    var block = this._numboLevel.spawnDropBlock(blockSize, col, val, powerup);
		return block;
	},

	pathLengthIsTwoCriteria: function(path) {
		return path.length == 2;
	},

	pathAtLeastTwoWithNoiseCriteria: function(path){
		return path.length >= 4 || path.length >= 2 && Math.random() > 0.5;
	},

	sumsToCriteria: function(path) {
		var sum = 0;
		for (var i = 0; i < path.length - 1; ++i)
			sum += path[i].val;
		return sum == path[path.length].val;
	},

	meanderSearch: function(col, row, criteria, path) {
		var neighbors = NJHelper.shuffleArray(this._numboLevel.getNeighbors(col, row) );
		if (criteria(path))
			return path;

		for (var i in neighbors){
			var block = neighbors[i];
			if (block && path.indexOf(block) < 0){
				var newPath = path.slice(0);
				newPath.push(block);
				return this.meanderSearch(block.col, block.row, criteria, newPath);
			}
		}
	},


	////////////
	// COMBOS //
	////////////

	updateRandomJumbo: function() {
	 	NJ.chooseJumbo(NJ.weightedRandom(this.jumboDistribution));
		var jumbo = NJ.getCurrentJumbo();
		this.distribution = jumbo.numberList;
		this.spawnTime = jumbo.spawnTime;
	},

	updateJumboTo: function(jumboString){

		NJ.chooseJumbo(jumboString);
		var jumbo = NJ.getCurrentJumbo();
		this.distribution = jumbo.numberList;
		this.spawnTime = jumbo.spawnTime;
	},

	// updates the board/distribution given the mode is Multiple Progression
	updateMultipleProgression: function() {
		// Get possible factors based on level
		var possibleFactors = null;
		if(NJ.stats.level == 3)
			possibleFactors = [2,3,4];
		else if(NJ.stats.level == 5)
			possibleFactors = [4,5,6];
		else if(NJ.stats.level == 7)
			possibleFactors = [6,7,8,10];
		else if(NJ.stats.level == 9)
			possibleFactors = [8,9,10];
		else if(NJ.stats.level == 10)
			possibleFactors = [7,8,9,11];
		else if(NJ.stats.level == 11 || NJ.stats.level == 12)
			possibleFactors = [9,12,13];
		else if(NJ.stats.level > 12)
			possibleFactors = [12,13,14,15];

		if(possibleFactors != null) {
			// Change distribution by multiplying by a random factor.
			var factor = NJ.gameState.currentLevel;
			while(factor == NJ.gameState.currentLevel)
				factor = possibleFactors[Math.floor(Math.random()*possibleFactors.length)];
			for(var i=0; i < NJ.getCurrentJumbo()["numberList"].length; i++) {
				NJ.getCurrentJumbo()["numberList"][i].key /= NJ.gameState.currentLevel;
				NJ.getCurrentJumbo()["numberList"][i].key *= factor;
			}

			// Update the blocks currently on the board.
			this._numboLevel.divideBlocksBy(NJ.gameState.currentLevel);
			this._numboLevel.multiplyBlocksBy(factor);
			NJ.gameState.currentLevel = factor;
		}
	},

	updateCombo: function(time) {
		if(this.comboTimes.length == 0)
			this.comboTimes.push(time);
		else if((time - this.comboTimes[this.comboTimes.length-1])/1000 < 5) {
			this.comboTimes.push(time);
			if(this.comboTimes.length > 2)
				NJ.gameState.multiplier = 1 + (this.comboTimes.length-2)*.5;
		}
		else this.comboTimes = [time];
	},

	checkMultiplier: function() {
		if(this.comboTimes.length > 0) {
			if((Date.now() - this.comboTimes[this.comboTimes.length-1])/1000 > 5) {
				this.comboTimes = [];
				NJ.gameState.multiplier = 1;
			}
		}
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

	clearRows: function(num) {
		this._numboLevel.clearBottomRows(num);
	},

	// a scaling factor to reduce spawn time on higher levels
	getSpawnConst: function() {
		var L = NJ.stats.level;
		return 0.3 + 2/Math.pow(L, 1/2);
	    //return 1 + 2/L;
	},

	// checks if the current selected blocks can be activated (their equation is valid)
	getColLength: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "Invalid column");
	    return this._numboLevel.blocks[col].length;
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

	// checks if the current selected blocks can be activated (their equation is valid)
	isSelectedClearable: function() {
		if (!this._selectedBlocks.length || this._selectedBlocks.length < 3)
		    return false;

		var selectedBlocksLength = this._selectedBlocks.length;

		// all blocks must be sequentially adjacent

		var sum = 0;

		for (var i = 0; i < selectedBlocksLength - 1; ++i) {
		    if (!this._numboLevel.isAdjBlocks(this._selectedBlocks[i], this._selectedBlocks[i + 1]))
			return false;

		    sum += this._selectedBlocks[i].val;
		}

		return sum == this._selectedBlocks[selectedBlocksLength - 1].val;
	}
});
