/**
 * Created by jonathanlu on 1/18/16.
 */

var TutorialDriverLayer = BaseGameLayer.extend({

	_tutorialLayer: null,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function () {
		this._super();

		this._initTutorial();

		this._advanceTutorialSlide();
	},

	_initTutorial: function() {
		this._tutorialLayer = new TutorialLayer();
		this.addChild(this._tutorialLayer, 999);
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.backgroundTrack;
	},

	//////////////
	// Tutorial //
	//////////////

	_advanceTutorialSlide: function() {
		var that = this;

		var currSlide = this._tutorialLayer.advanceSlide();
		var slides = this._tutorialLayer.slides;

		var centerCol;

		switch(currSlide) {
			case slides.intro:
				centerCol = Math.floor((NJ.NUM_COLS - 1) / 2);

				this.runAction(cc.sequence(cc.delayTime(5.5),
					cc.callFunc(function() {
						that.spawnDropBlock(centerCol , 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 3);
					})
				));

				break;
			case slides.subtraction:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 3);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 5);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 6);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 7);
					})
				));

				break;
			case slides.more:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 6);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 3);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 4);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 5);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						// begin scheduling hint jiggles
						that.schedule(that.jiggleHintBlocks, 5);
					})
				));

				break;

			case slides.wombo:

				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 4);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 7);
					})


					// spawn some extra 7's to demonstrate the wombo combo explosion
					, cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 3, 7);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 7);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 7);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 7);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 7);
					})

				));

				break;

			case slides.end:

				this.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(function() {
					// load resources
					cc.LoaderScene.preload(g_menu, function () {
						var scene = new cc.Scene();
						scene.addChild(new NumboMenuLayer());
						cc.director.runScene(new cc.TransitionFade(0.5, scene));
					}, that);
				})));

				break;
		}
	},

	isGameOver: function() {
		return false;
	},

	///////////////////////
	// Game State Events //
	///////////////////////

	// Halts game, switches to game over, sends data.
	onGameOver: function() {
		NJ.stats.addCurrency(NJ.gameState.getScore());
		NJ.stats.offerHighscore(NJ.gameState.getScore());
		NJ.stats.offerHighlevel(NJ.gameState.getLevel());

		NJ.stats.save();

		// first send the analytics for the current game session
		NJ.sendAnalytics();

		var that = this;

		cc.audioEngine.stopMusic();

		this.pauseGame();

		this._gameOverMenuLayer = new GameOverMenuLayer();
		this._gameOverMenuLayer.setOnRetryCallback(function() {
			that.onRetry();
		});
		this._gameOverMenuLayer.setOnMenuCallback(function() {
			that.onMenu();
		});
		this.addChild(this._gameOverMenuLayer, 999);
	},

	///////////////
	// UI Events //
	///////////////


	//////////////////
	// Touch Events //
	//////////////////

	// On touch ended, activates all selected blocks once touch is released.
	onTouchEnded: function(touchPosition) {
		var clearedBlocks = this._super(touchPosition);

		var comboLength = clearedBlocks.length;

		if(!comboLength)
			return;

		var activationSound = progresses[Math.min(comboLength - 2, progresses.length - 1)];

		// launch feedback for combo threshold title snippet
		if (comboLength >= 5) {

			//if (NJ.settings.sounds)
			//cc.audioEngine.playEffect(res.applauseSound);
		}

		if(NJ.settings.sounds)
			cc.audioEngine.playEffect(activationSound);

		if(this._numboController.levelIsClear()) {
			this._advanceTutorialSlide();
		}
	}
});