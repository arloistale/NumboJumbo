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

		var that = this;

		this._numboController.initDistribution(this._numberList);

		// here is our schedule

		this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
			// cause UI elements to fall in
			that._numboHeaderLayer.enter();
			that._toolbarLayer.enter();
		}), cc.delayTime(0.5), cc.callFunc(function() {
			// fill the board with blocks initially
			that.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));

			that.schedule(function() {
				var elapsedTime = (Date.now() - NJ.gameState.getStartTime()) / 1000;
				var timeFraction = 1 - elapsedTime / 60;

				that._numboHeaderLayer.setProgress(timeFraction);
				that.checkGameOver();
			}, 1);
		})));
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.backgroundTrack;
	},

	/////////////////////////
	// Game State Handling //
	/////////////////////////

	onGameOver: function() {
		this._super();

		var that = this;

		NJ.stats.addCurrency(NJ.gameState.getScore());

		var key = NJ.modekeys.minuteMadness;
		var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

		if(highscoreAccepted) {
			NJ.social.submitScore(key, NJ.stats.getHighscore(key));
		}

		NJ.stats.save();

		// first send the analytics for the current game session
		NJ.sendAnalytics("Default");

		this.runAction(cc.sequence(cc.callFunc(function() {
			that._numboHeaderLayer.leave();
			that._toolbarLayer.leave();
		}), cc.delayTime(2), cc.callFunc(function() {
			that.pauseGame();

			that._gameOverMenuLayer = new GameOverMenuLayer(key, false);
			that._gameOverMenuLayer.setOnRetryCallback(function() {
				that.onRetry();
			});
			that._gameOverMenuLayer.setOnMenuCallback(function() {
				that.onMenu();
			});
			that.addChild(that._gameOverMenuLayer, 999);
		})));
	},

	checkGameOver: function() {
		if(this._super())
			return true;

		if(this.isInDanger()) {
			if(!this._feedbackLayer.isDoomsayerLaunched())
				this._feedbackLayer.launchDoomsayer();
		} else {
			if(this._feedbackLayer.isDoomsayerLaunched())
				this._feedbackLayer.clearDoomsayer();
		}

		return false;
	},

	// whether the game is over or not
	isGameOver: function() {
		return this._getElapsedTime() >= this._elapsedTimeLimit;
	},

	///////////////////
	// Virtual Stuff //
	///////////////////

	isInDanger: function() {
		return this._getElapsedTime() / this._elapsedTimeLimit > 0.9;
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
	},

	/////////////
	// Helpers //
	/////////////

	_getElapsedTime: function () {
		return (Date.now() - NJ.gameState.getStartTime()) / 1000;
	}
});