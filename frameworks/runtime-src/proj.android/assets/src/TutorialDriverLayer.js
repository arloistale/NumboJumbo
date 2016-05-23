/**
 * Created by jonathanlu on 1/18/16.
 */

var TutorialDriverLayer = BaseGameLayer.extend({

	_handIndicator: null,

	_tutorialLayer: null,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function () {
		this._super();

		this._initTutorial();

		// cause UI elements to fall in
		this._toolbarLayer.enter();

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

	/**
	 * Usage: provide pivot point and target point (both must be of cc.Point)
	 * pivot
     * @private
     */
	_startHandOverPath: function(pivot, target) {
		if(!this._handIndicator) {
			this._handIndicator = new cc.Sprite(res.handImage);
			this._handIndicator.attr({
				anchorX: 0.5,
				anchorY: 1
			});
			this._handIndicator.setColor(NJ.themes.defaultLabelColor);
			this.addChild(this._handIndicator, 56);
		}

		var that = this;

		pivot = pivot || cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y);
		target = target || cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y);

		this._handIndicator.setVisible(true);
		this._handIndicator.setPosition(pivot);
		cc.log(pivot.x + " : " + pivot.y);

		this._handIndicator.runAction(cc.sequence(cc.moveTo(1.2, target).easing(cc.easeBackInOut()), cc.delayTime(0.5), cc.callFunc(function() {
			that._handIndicator.setPosition(pivot);
		})).repeatForever());
	},

	_clearHand: function() {
		this._handIndicator.stopAllActions();
		this._handIndicator.setVisible(false);
	},

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
						that.spawnDropBlock(centerCol, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 3);
					}), cc.delayTime(1), cc.callFunc(function() {
						that._startHandOverPath(that._convertLevelCoordsToPoint(centerCol, 0), that._convertLevelCoordsToPoint(centerCol + 2, 0));
					})
				));

				break;
			case slides.subtraction:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this._clearHand();

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 4);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 7);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 5);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 8);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 3);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 4);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 3);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 2);
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
					var scene = new cc.Scene();
					scene.addChild(new NumboMenuLayer());
					cc.director.runScene(new cc.TransitionFade(0.5, scene));
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
	onGameOver: function() { },

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

		// launch feedback for combo threshold title snippet
		if (comboLength >= 5) {

			//if (NJ.settings.sounds)
			//cc.audioEngine.playEffect(res.applauseSound);
		}

		if(this._numboController.levelIsClear()) {
			this._advanceTutorialSlide();
		}
	}
});