/**
 * Created by jonathanlu on 1/18/16.
 */

var MovesLayer = BaseGameLayer.extend({

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

	// maximum number of moves allowed
	_movesLimit: 20,

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
		this._numboHeaderLayer.setConditionValue(this._movesLimit);

		this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
			// cause UI elements to fall in
			that._numboHeaderLayer.enter();
			that._toolbarLayer.enter();
		}), cc.delayTime(0.5), cc.callFunc(function() {
			// fill the board with blocks initially
			that.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS));
		})));
	},

	_initUI: function() {
		this._super();

		this._numboHeaderLayer.setConditionPrefix("Moves: ");
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.trackDauntinglyMellow;
	},

	/////////////////////////
	// Game State Handling //
	/////////////////////////

	onGameOver: function() {
		this._super();

		var that = this;

		NJ.stats.addCurrency(NJ.gameState.getScore());

		var key = NJ.modekeys.moves;
		var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

		if(highscoreAccepted) {
			var highscore = NJ.stats.getHighscore(key);
			NJ.social.submitScore(key, highscore);

			if(highscore >= 64) {
				NJ.social.unlockAchievement(NJ.social.achievementKeys.mov1);

				if(highscore >= 128) {
					NJ.social.unlockAchievement(NJ.social.achievementKeys.mov2);

					if(highscore >= 256) {
						NJ.social.unlockAchievement(NJ.social.achievementKeys.mov3);

						if(highscore >= 512) {
							NJ.social.unlockAchievement(NJ.social.achievementKeys.mov4);
						}
					}
				}
			}
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

	// whether the game is over or not
	isGameOver: function() {
		var movesMade = NJ.gameState.getMovesMade();
		return movesMade >= this._movesLimit;
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

		var numBonusBlocks = this._numboController.getBonusBlocks(comboLength);

		if(NJ.settings.sounds) {
			var activationSounds = [];
			for (var i = 0; i < comboLength; i++) {
				activationSounds.push(bloops[i]);
			}

			this.schedule(function () {
				cc.audioEngine.playEffect(activationSounds[0]);
			}, .05, false);

			var timeBetween = 0;
			switch (activationSounds.length) {
				case 3:
					timeBetween = .12;
					break;
				case 4:
					timeBetween = .1;
					break;
				case 5:
					timeBetween = .07;
					break;
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
					timeBetween = .06;
					break;
			}
/*
			for (var i = 1; i < activationSounds.length; i++) {
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[i]);
				}, .05 + (i * timeBetween), false);
			}
*/
			if (activationSounds.length == 3) {
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[1]);
				}, .17, false);
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[2]);
				}, .29, false);
			}
			else if (activationSounds.length == 4) {
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
			else if (activationSounds.length == 5) {
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
			else if (activationSounds.length == 6) {
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
			else if (activationSounds.length == 7) {
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
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[6]);
				}, .41, false);
			}
			else if (activationSounds.length == 8) {
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
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[6]);
				}, .41, false);
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[7]);
				}, .47, false);
			}
			else {
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
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[6]);
				}, .41, false);
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[7]);
				}, .47, false);
				this.schedule(function () {
					cc.audioEngine.playEffect(activationSounds[8]);
				}, .47, false);
			}
		}

		//this.spawnBlocksAfterDelay(numBonusBlocks, this._spawnDelay);

		this._numboHeaderLayer.setConditionValue(this._movesLimit - NJ.gameState.getMovesMade());

		this.checkGameOver();
	}
});