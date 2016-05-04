/**
 * Created by jonathanlu on 1/18/16.
 */

var MinuteMadnessLayer = BaseGameLayer.extend({

	// time limit for minute madness
	_elapsedTimeLimit: 60,

	////////////////////
	// Initialization //
	////////////////////

	_reset: function() {
		this._super();

		// fill the board with blocks initially
		this.spawnRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));

		// next we wait until the blocks have been spawned to init the game
		var that = this;
		this.schedule(function() {
			that._numboHeaderLayer.updateValues();
			that.checkGameOver();
		}, 1);
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

		this.spawnRandomBlocks(comboLength);

		var activationSound = progresses[Math.min(comboLength*2, progresses.length-1)];

		// launch feedback for combo threshold title snippet
		if (comboLength >= 5) {

			//if (NJ.settings.sounds)
				//cc.audioEngine.playEffect(res.applauseSound);
		}

		if(NJ.settings.sounds)
			cc.audioEngine.playEffect(activationSound);
	}
});