/**
 * Created by jonathanlu on 1/18/16.
 */

var MinuteMadnessLayer = BaseGameLayer.extend({

	// domain of spawning
	_numberList: [
		{ key: 1, weight: 100 },
		{ key: 2, weight: 75 },
		{ key: 3, weight: 50 },
		{ key: 4, weight: 50 },
		{ key: 5, weight: 50 },
		{ key: 6, weight: 40 },
		{ key: 7, weight: 40 },
		{ key: 8, weight: 40 },
		{ key: 9, weight: 40 }
	],

	// time limit for minute madness
	_elapsedTimeLimit: 60,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function() {
		this._super();

		this._numboHeaderLayer.hideLevelLabel(true);
	},

	_reset: function() {
		this._super();

		this._numboController.initDistribution(this._numberList);

		// next we wait until the blocks have been spawned to init the game
		var that = this;
		this.schedule(function() {
			var elapsedTime = (Date.now() - NJ.gameState.getStartTime()) / 1000;
			var timeFraction = 1 - elapsedTime / 60;

			that._numboHeaderLayer.setProgress(timeFraction);
			that.checkGameOver();
		}, 1);

		// cause UI elements to fall in
		this._numboHeaderLayer.enter();
		this._toolbarLayer.enter();

		// fill the board with blocks initially
		this.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.backgroundTrack;
	},

	/////////////////////////
	// Game State Handling //
	/////////////////////////

	// whether the game is over or not
	isGameOver: function() {
		var timeElapsed = (Date.now() - NJ.gameState.getStartTime()) / 1000;

		return timeElapsed >= this._elapsedTimeLimit;
	},

//////////////////
// Touch Events //
//////////////////

	// On touch ended, activates all selected blocks once touch is released.
	onTouchEnded: function(touchPosition) {
		var clearedBlocks = this._super(touchPosition);

		var comboLength = clearedBlocks.length;

		if(!comboLength)
			return;

		this.spawnDropRandomBlocks(comboLength);

		var activationSound = progresses[Math.min(comboLength - 2, progresses.length - 1)];

		// launch feedback for combo threshold title snippet
		if (comboLength >= 5) {

			//if (NJ.settings.sounds)
				//cc.audioEngine.playEffect(res.applauseSound);
		}

		if(NJ.settings.sounds)
			cc.audioEngine.playEffect(activationSound);

		// show player data
		this._numboHeaderLayer.updateValues();
	}
});