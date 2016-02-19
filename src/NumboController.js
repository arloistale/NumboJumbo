var NumboController = cc.Class.extend({
	distribution: [],
	jumboDistribution: [],
	spawnTime: 1.0,

	// level data
	_numboLevel: null,

	_selectedBlocks: [],

	comboTimes: [],
	multiplier: 1,
                                      
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
    
	isGameOver: function() {
	    return this._numboLevel.isFull();
	},

	/////////////////////////////
	// SELECTION FUNCTIONALITY //
	/////////////////////////////

	// select a block, giving it a highlight
	selectBlock: function(col, row) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS && 0 <= row && row < NJ.NUM_ROWS, "Invalid coords");

	    var block = this._numboLevel.getBlock(col, row);

	    if(!block)
			return;

	    // TODO: possible optimization
	    if(!block.bHasDropped || this._selectedBlocks.indexOf(block) >= 0)
			return;

	    // make sure this block is adjacent to the block before it
	    if (this._selectedBlocks.length > 0){
			var lastBlock = this._selectedBlocks[this._selectedBlocks.length-1];
			if (! this._numboLevel.isAdjBlocks(block, lastBlock) )
				return;
	    }
	    // we make this block green, make the last selected block red
	    if(this._selectedBlocks.length > 0) {
			var lastBlock = this._selectedBlocks[this._selectedBlocks.length - 1];
			lastBlock.highlight(cc.color(255, 0, 0, 255));
	    }

	    block.highlight(cc.color(0, 255, 0, 255));
	    this._selectedBlocks.push(block);
	    
	    if(NJ.settings.sounds)
			cc.audioEngine.playEffect(res.plop);
	},

	// deselect a single block, removing its highlight
	deselectBlock: function(col, row) {
	    cc.assert(col >= 0 && row >= 0 && col < NJ.NUM_COLS && col < NJ.NUM_ROWS, "Invalid coords");

	    var block = this._numboLevel.getBlock(col, row);

	    if(!block || !block.bHasDropped)
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
			    cc.audioEngine.playEffect(res.plip_plip);
		
			// remove any affected block sprite objects:
			for(var i = 0; i < this._selectedBlocks.length; ++i)
			    this._numboLevel.killBlock(this._selectedBlocks[i]);
		
			this._numboLevel.collapseColumnsToward(lastCol);
			this._numboLevel.updateBlockRowsAndCols();

			this.updateCombo(Date.now());
	    }

	    this.deselectAllBlocks();

	    return { cleared: selectedBlockCount, blockSum: blockSum, powerupValue: powerupValue};
	},

	// drop block into random column with random value
	// returns dropped block
	dropRandomBlock: function() {
	    cc.assert(!this.isGameOver(), "Can't drop any more blocks");

	    // Set up val/col
	    var col = NJHelper.weightedRandom(this._numboLevel.getColWeights());
	    var val = NJHelper.weightedRandom(this.distribution);

	    if(NJ.settings.sounds){
			cc.audioEngine.playEffect(res.tongue_click);
	    }

		var powerup = (Math.random() < 0.05); // 5% chance
		if (powerup){
			var keys = Object.keys(NJ.jumbos.jumboMap)
			val = parseInt(keys[Math.floor(Math.random() * keys.length)]);
		}

	    return this._numboLevel.dropBlock(col, val, powerup);
	},

	/////////////
	// GETTERS //
	/////////////

	updateRandomJumbo: function(){
		cc.log(this.jumboDistribution);
		NJ.chooseJumbo(NJHelper.weightedRandom(this.jumboDistribution))
		cc.log(NJ.getCurrentJumbo());
		var jumbo = NJ.getCurrentJumbo();
		this.distribution = jumbo.numberList;
		this.spawnTime = jumbo.spawnTime;
	},

	updateJumboTo: function(jumboString){

		NJ.chooseJumbo(jumboString);

		var jumbo = NJ.getCurrentJumbo();
		this.distribution = jumbo.numberList;
		this.spawnTime = jumbo.spawnTime;
		cc.log(jumboString);
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
				this.multiplier = 1 + (this.comboTimes.length-2)*.5;
		}
		else this.comboTimes = [time];
	},

	checkMultiplier: function() {
		if(this.comboTimes.length > 0) {
			if((Date.now() - this.comboTimes[this.comboTimes.length-1])/1000 > 5) {
				this.comboTimes = [];
				NJ.gameState.multiplier = 1;
				this.multiplier = 1;
			}
		}
	},

	// a scaling factor to reduce spawn time on higher levels
	spawnConst: function() {
	    return 1 + 2/NJ.stats.level
	},
	
	// checks if the current selected blocks can be activated (their equation is valid)
	getColLength: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "Invalid column");
	    return this._numboLevel.blocks[col].length;
	},

	getBlock: function(col, row) {
	    return this._numboLevel.getBlock(col, row);
	},

	getSpawnTime: function() {
	    return this.spawnConst() * this.spawnTime;
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
