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
		{ key: 7, weight: 20 },
		{ key: 8, weight: 20 },
		{ key: 9, weight: 20 }
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

		if(!NJ.settings.hasLoadedMOV) {
			this.pauseGame();

			this._prepLayer = new PrepLayer(res.movesImage, NJ.themes.blockColors[1], "Moves", "As many numbers\nas you need.\n\n\nClear as many numbers\nas you can in 20 moves.\n\n\nLet's go!");
			this._prepLayer.setOnCloseCallback(function() {
				that.onResume();

				that.removeChild(that._prepLayer);
				that._prepLayer = null;

				NJ.settings.hasLoadedMOV = true;
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
					})));
				});
			})));
		}
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

		var scoreDiff = NJ.gameState.getScore();
		if(NJ.stats.isDoubleEnabled())
			scoreDiff *= 2;

		NJ.stats.addCurrency(scoreDiff);

		var key = NJ.modekeys.moves;
		var highscoreAccepted = NJ.stats.offerHighscore(key, NJ.gameState.getScore());

		var highscore = NJ.stats.getHighscore(key);
		NJ.social.submitScore(key, highscore);

		if(highscore >= 500) {
			NJ.social.unlockAchievement(NJ.social.achievementKeys.mov1);

			if(highscore >= 750) {
				NJ.social.unlockAchievement(NJ.social.achievementKeys.mov2);

				if(highscore >= 1000) {
					NJ.social.unlockAchievement(NJ.social.achievementKeys.mov3);

					if(highscore >= 1250) {
						NJ.social.unlockAchievement(NJ.social.achievementKeys.mov4);
					}
				}
			}
		}

		NJ.stats.save();

		// first send the analytics for the current game session
		NJ.sendAnalytics("Moves");

		this.runAction(cc.sequence(cc.callFunc(function() {
			that._numboHeaderLayer.leave();
			that._toolbarLayer.leave();
		}), cc.delayTime(1), cc.callFunc(function() {
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

		this._numboHeaderLayer.activateEquation();

		this._effectsLayer.clearComboOverlay();

		if (!selectedBlocks.length)
			return;

		// add moves made
		NJ.gameState.addMovesMade();

		this.scoreBlocksMakeParticles(selectedBlocks);
		this.scoreBlocksMakeParticles(bonusBlocks, true);

		this.relocateBlocks();

		// Allow controller to look for new hint.
		this._numboController.resetKnownPath();

		var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
		if(!comboLength)
			return;

		this._effectsLayer.clearComboOverlay();

		this._playActivationSounds(selectedBlocks.length);

		this.spawnDropRandomBlocks(comboLength);
		//NJ.audio.playSound(res.plipSound);

		this._numboHeaderLayer.setConditionValue(this._movesLimit - NJ.gameState.getMovesMade());

		this.checkGameOver();
	}
});