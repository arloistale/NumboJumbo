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
		this.spawnRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));
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

		var activationSounds = [];
		for(var i=0; i<comboLength-2; i++) {
			activationSounds.push(bloops[i]);
		}

		this.schedule(function() {
			cc.audioEngine.playEffect(activationSounds[0]);
		},.05, false);

		if(activationSounds.length == 2) {
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[1]);
			}, .2, false);
		}
		else if(activationSounds.length == 3) {
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[1]);
			}, .17, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[2]);
			}, .29, false);
		}
		else if(activationSounds.length == 4) {
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[1]);
			}, .15, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[2]);
			}, .25, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[3]);
			}, .35, false);
		}
		else if(activationSounds.length == 5) {
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[1]);
			}, .12, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[2]);
			}, .19, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[3]);
			}, .26, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[4]);
			}, .33, false);
		}
		else if(activationSounds.length > 5) {
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[1]);
			}, .11, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[2]);
			}, .17, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[3]);
			}, .23, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[4]);
			}, .29, false);
			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[5]);
			}, .35, false);
		}

		/*var timeElapsed = 0;
		var timeBetweenSounds = 1.0/activationSounds.length;
		for(var i=1; i<Math.min(activationSounds.length, 6); i++) {
			timeElapsed += timeBetweenSounds;
			this.schedule(function() { cc.audioEngine.playEffect(activationSounds[i]);}, timeElapsed, false);
		}*/

		// launch feedback for combo threshold title snippet
		if (comboLength >= 5) {

			//if (NJ.settings.sounds)
				//cc.audioEngine.playEffect(res.applauseSound);
		}

		//if(NJ.settings.sounds) {
		//	for(var i=0; i<activationSounds.length; i++)
		//		cc.audioEngine.playEffect(activationSounds[i]);
		//}
		// show player data
		this._numboHeaderLayer.updateValues();
	}
});