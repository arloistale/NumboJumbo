/**
 * Created by jonathanlu on 1/18/16.
 */

var MovesGameLayer = BaseGameLayer.extend({

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

	onRetry: function() {
		this._super();

		var scene = new cc.Scene();
		scene.addChild(new MovesGameLayer());
		cc.director.runScene(scene);
	},

	onGameOver: function() {
		this._super();

		var that = this;

		NJ.stats.addCurrency(NJ.gameState.getScore());

		var key = NJ.modekeys.moves;
		var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

		if(highscoreAccepted) {
			var highscore = NJ.stats.getHighscore(key);
			NJ.social.submitScore(key, highscore);

			if(highscore >= 300) {
				NJ.social.unlockAchievement(NJ.social.achievementKeys.mov1);

				if(highscore >= 400) {
					NJ.social.unlockAchievement(NJ.social.achievementKeys.mov2);

					if(highscore >= 500) {
						NJ.social.unlockAchievement(NJ.social.achievementKeys.mov3);

						if(highscore >= 600) {
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
		}), cc.delayTime(1), cc.callFunc(function() {
			that._numboController.clearLevel();
		}), cc.delayTime(1), cc.callFunc(function() {
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

	isInDanger: function() {
		return false;
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

		this._numboHeaderLayer.setEquation([]);

		this._effectsLayer.clearComboOverlay();

		if (!selectedBlocks.length)
			return;

		// add moves made
		NJ.gameState.addMovesMade();

		var totalClearedBlocks = selectedBlocks.concat(bonusBlocks);
		this.scoreBlocksMakeParticles(totalClearedBlocks, totalClearedBlocks.length);

		this.relocateBlocks();

		// Allow controller to look for new hint.
		this._numboController.resetKnownPath();
		this.jiggleCount = 0;

		// schedule a hint
		//this.schedule(this.jiggleHintBlocks, 7);

		var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
		if(!comboLength)
			return;

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

		this.spawnBlocksAfterDelay(comboLength, this._spawnDelay);

		this._numboHeaderLayer.setConditionValue(this._movesLimit - NJ.gameState.getMovesMade());

		this.checkGameOver();
	}
});