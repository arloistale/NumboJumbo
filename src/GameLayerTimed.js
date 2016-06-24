/**
 * Created by jonathanlu on 1/18/16.
 */

var TimedGameLayer = BaseGameLayer.extend({

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
	},

	_reset: function() {
		this._super();

		var that = this;

		this._numboController.initDistribution(this._numberList);

		// here is our schedule
		that._numboHeaderLayer.setConditionValue(this._elapsedTimeLimit);

		if(!NJ.settings.hasLoadedMM) {
			this.pauseGame();

			this._prepLayer = new PrepLayer(res.timedImage, NJ.themes.blockColors[0], "Timed", "As many numbers\nas you need.\n\n\nClear as many numbers\nas you can in 60 seconds.\n\n\nLet\'s go!");
			this._prepLayer.setOnCloseCallback(function() {
				that.onResume();

				that.removeChild(that._prepLayer);
				that._prepLayer = null;

				NJ.settings.hasLoadedMM = true;
				NJ.saveSettings();

				that._reset();
			});
			this.addChild(this._prepLayer, 100);
		} else {
			this.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
				that.enter(function () {
					that.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
						that._isInGame = true;

						// fill the board with blocks initially
						that.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));
						NJ.audio.playSound(res.plipSound);

						that.schedule(function () {
							// pad with 2 seconds to compensate for time taken entering
							var timeLeft = that._elapsedTimeLimit + 2 - (Date.now() - NJ.gameState.getStartTime()) / 1000;

							that._numboHeaderLayer.setConditionValue(Math.floor(timeLeft));
							that.checkGameOver();
						}, 1);
					})));
				});
			})));
		}
	},

	_initUI: function() {
		this._super();

		this._numboHeaderLayer.setConditionPrefix("Time: ");
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.trackSomethingElse1;
	},

	/////////////////////////
	// Game State Handling //
	/////////////////////////

	onRetry: function() {
		this._super();

		var scene = new cc.Scene();
		scene.addChild(new TimedGameLayer());
		cc.director.runScene(scene);
	},

	onGameOver: function() {
		this._super();

		var that = this;

		var scoreDiff = NJ.gameState.getScore();
		if(NJ.stats.isDoubleEnabled())
			scoreDiff *= 2;

		NJ.stats.addCurrency(scoreDiff);

		var key = NJ.modekeys.minuteMadness;
		var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

		if(highscoreAccepted) {
			var highscore = NJ.stats.getHighscore(key);
			NJ.social.submitScore(key, highscore);

			if(highscore >= 300) {
				NJ.social.unlockAchievement(NJ.social.achievementKeys.mm1);

				if(highscore >= 450) {
					NJ.social.unlockAchievement(NJ.social.achievementKeys.mm2);

					if(highscore >= 600) {
						NJ.social.unlockAchievement(NJ.social.achievementKeys.mm3);

						if(highscore >= 750) {
							NJ.social.unlockAchievement(NJ.social.achievementKeys.mm4);
						}
					}
				}
			}
		}

		NJ.stats.save();

		// first send the analytics for the current game session
		NJ.sendAnalytics("Timed");

		this.leave(function() {
			that.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function() {
				that._numboController.clearLevel();
			}), cc.delayTime(1), cc.callFunc(function() {
				that.pauseGame();

				that._gameOverMenuLayer = new GameOverMenuLayer(key, highscoreAccepted);
				that._gameOverMenuLayer.setOnRetryCallback(function() {
					that.onRetry();
				});
				that._gameOverMenuLayer.setOnMenuCallback(function() {
					that.onMenu();
				});
				that.addChild(that._gameOverMenuLayer, 999);
			})));
		});
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
		// 1 second padding to account for time spent entering
		return this._getElapsedTime() >= (this._elapsedTimeLimit + 1);
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
		this._super(touchPosition);

		// Activate any selected blocks.
		var selectedAndBonusBlocks = this._numboController.activateSelectedBlocks();
		var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
		var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

		this.redrawSelectedLines();

		this._numboHeaderLayer.activateEquation();

		this._effectsLayer.clearComboOverlay();

		if (!selectedBlocks.length)
			return;

		this.scoreBlocksMakeParticles(selectedBlocks);
		this.scoreBlocksMakeParticles(bonusBlocks, true);

		this.relocateBlocks();

		// Allow controller to look for new hint.
		this._numboController.resetKnownPath();

		var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
		if(!comboLength)
			return;

		this._effectsLayer.clearComboOverlay();

		this.spawnDropRandomBlocks(comboLength);
		//NJ.audio.playSound(res.plipSound);

		this._playActivationSounds(selectedBlocks.length);
	},

	onPause: function() {
		this._super();

		this._timePassed = (Date.now() - NJ.gameState.getStartTime()) / 1000;
	},

	onResume: function() {
		this._super();

		NJ.gameState.setStartTime(Date.now() - this._timePassed * 1000);
	},

	/////////////
	// Helpers //
	/////////////

	_getElapsedTime: function () {
		return (Date.now() - NJ.gameState.getStartTime()) / 1000;
	}
});