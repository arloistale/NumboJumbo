var NumboController = cc.Class.extend({
	distribution: [],
	spawnTime: 1.0,

	// level data
	_numboLevel: null,

	_selectedBlocks: [],
                                      
	////////////////////
	// INITIALIZATION //
	////////////////////

	
	// initialize timing, initial mode
	init: function() {
	    this._selectedBlocks = [];
	    this._numboLevel = new NumboLevel();
	    this._numboLevel.init();

        this.initJumbo();
	},

    initJumbo: function() {
        var jumbo = NJ.getCurrentJumbo();
        this.distribution = jumbo.numberList;
        this.spawnTime = jumbo.spawnTime;
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
	// awards player score depending on blocks selected
	// shifts all blocks down to remove gaps and drops them accordingly
	activateSelectedBlocks: function() {
	    if(this.isSelectedClearable()) {
		var selectedBlockCount = this._selectedBlocks.length;
		var blockSum = 0;
		for (var block in this._selectedBlocks)
		    blockSum += this._selectedBlocks[block].val;
		
		NJ.stats.blocksCleared += selectedBlockCount;
		if(selectedBlockCount > NJ.stats.maxComboLength)
		    NJ.stats.maxComboLength = selectedBlockCount;

		var lastCol = this._selectedBlocks[selectedBlockCount - 1].col;

		NJ.stats.score += this.getScoreForCombo(selectedBlockCount, blockSum);
		
		if(NJ.settings.sounds)
		    cc.audioEngine.playEffect(res.plip_plip);

		
		// remove any affected block sprite objects:
		for(var i = 0; i < this._selectedBlocks.length; ++i)
		    this._numboLevel.killBlock(this._selectedBlocks[i]);
		
		this._numboLevel.collapseColumnsToward(lastCol);
		this._numboLevel.updateBlockRowsAndCols();
	    }

	    this.deselectAllBlocks();
	},

	// drop block into random column with random value
	// returns dropped block
	dropRandomBlock: function() {
	    cc.assert(!this.isGameOver(), "Can't drop any more blocks");

	    // Set up val/col
	    var col = NJHelper.weightedRandom(this._numboLevel.getColWeights());
	    //var val = this.distribution[Math.floor(Math.random()*this.distribution.length)];
	    var val = NJHelper.weightedRandom(this.distribution);


	    
	    if(NJ.settings.sounds){
		cc.audioEngine.playEffect(res.tongue_click);
	    }

	    return this._numboLevel.dropBlock(col, val);
	},

	/////////////
	// GETTERS //
	/////////////

	// check if we should level up if blocks cleared is 
	// greater than level up threshold
    // return how many times we leveled up
	levelUp: function() {
	    // level up
        var levelUpCount = 0;

	    while (NJ.stats.blocksCleared >= this.blocksToLevelUp()) {
			NJ.stats.level++;
            levelUpCount++;
	    }

        return levelUpCount;
	},

	// a scaling factor to reduce spawn time on higher levels
	spawnConst: function() {
	    return 1 + 2/NJ.stats.level
	},
	
	// returns the number of blocks needed to get to the next level.
	// this is quadratic in the current level L, ie, aL^2 + bL + c.
	// values for a, b, c can (and should!) be tuned regularly :)
	blocksToLevelUp: function(){
	    var a = 1.0;
	    var b = 5.0;
	    var c = 2.0;
	    var L = NJ.stats.level;
	    return Math.round( a*L*L+b*L+c );
	},
	
	getBlocksToLevelString: function() {
	    return (this.blocksToLevelUp() - NJ.stats.blocksCleared) + "";
	},
	
	// checks if the current selected blocks can be activated (their equation is valid)
	getColLength: function(col) {
	    cc.assert(0 <= col && col < NJ.NUM_COLS, "Invalid column");
	    return this._numboLevel.blocks[col].length;
	},

	getBlock: function(col, row) {
	    return this._numboLevel.getBlock(col, row);
	},

	getScoreForCombo: function(blockCount, blockSum) {
	    return blockCount*blockSum;
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