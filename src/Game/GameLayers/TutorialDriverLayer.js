/**
 * Created by jonathanlu on 1/18/16.
 */

var TutorialDriverLayer = BaseGameLayer.extend({

	_handIndicator: null,

	_tutorialLayer: null,

	_pauseEnabled: false,

	////////////////////
	// Initialization //
	////////////////////

	ctor: function (allowToolbar) {
		this._super();

		var that = this;

		this._numboHeaderLayer.enterTutorialMode();
		this._toolbarLayer.enterTutorialMode();

		if(allowToolbar) {
			this._pauseEnabled = true;

			// this seems like a hack but will work for now
			this._numboHeaderLayer.setOnPauseCallback(function() {
				that.leave(function() {
					that.onMenu();
				});
			});

			this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
				// cause UI elements to fall in
				that._numboHeaderLayer.enter();
				that._toolbarLayer.enter();
			})));
		} else {
			this._numboHeaderLayer.setOnPauseCallback(null);

			this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
				// cause UI elements to fall in
				that._numboHeaderLayer.enter();
			})));
		}

		this._initTutorial();

		this._advanceTutorialSlide();
	},

	// init the tutorial overlay
	_initTutorial: function() {
		this._tutorialLayer = new TutorialLayer();
		this.addChild(this._tutorialLayer, 999);
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.trackDauntinglyMellow;
	},

	leave: function(callback) {
		this._numboController.killAllBlocks();
		this._tutorialLayer.fadeOutSlide();
		this._clearHand();

		this._super(callback);
	},

	//////////////
	// Tutorial //
	//////////////

	/**
	 * Usage: provide a path for the hand to patrol (must have at least 1 point)
     * @private
     */
	_startHandOverPath: function(path) {
		if(!this._handIndicator) {
			var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
			var handSize = refDim * 0.25;
			this._handIndicator = new cc.Sprite(res.handImage);
			var spriteSize = this._handIndicator.getContentSize();
			this._handIndicator.setScale(handSize / spriteSize.width, handSize / spriteSize.height);
			this._handIndicator.attr({
				anchorX: 0.5,
				anchorY: 1
			});
			this._handIndicator.setColor(NJ.themes.defaultLabelColor);
			this.addChild(this._handIndicator, 56);
		}

		var that = this;

		cc.assert(path.length > 0, "Must define at least a start point in the path!");

		// initialize path
		var start = path[0];

		this._handIndicator.stopAllActions();
		this._handIndicator.setVisible(true);
		this._handIndicator.setPosition(start);
		var handActionList = [];

		if(path.length > 2) {
			for (var i = 1; i < path.length; ++i) {
				if (i == 1) {
                    handActionList.push(cc.moveTo(0.5, path[i]).easing(cc.easeBackIn()));
                } else if(i == path.length - 1) {
                    handActionList.push(cc.moveTo(0.7, path[i]).easing(cc.easeBackOut()));
                } else {
                    handActionList.push(cc.moveTo(0.5, path[i]));
                }
			}
		} else {
			handActionList.push(cc.moveTo(1.2, path[1]).easing(cc.easeBackInOut()));
		}

        handActionList.push(cc.delayTime(1));
        handActionList.push(cc.callFunc(function() {
            that._handIndicator.setPosition(start);
        }));

        this._handIndicator.runAction(cc.sequence(handActionList).repeatForever());
	},

	_clearHand: function() {
        if(this._handIndicator) {
            this._handIndicator.stopAllActions();
            this._handIndicator.setVisible(false);
        }
	},

	_advanceTutorialSlide: function() {
		var that = this;

		var currSlide = this._tutorialLayer.advanceSlide();
		var slides = this._tutorialLayer.slides;

		var centerCol;

		this._numboController.killAllBlocks();
		this.relocateBlocks();

		switch(currSlide) {
			case slides.intro:
				centerCol = Math.floor((NJ.NUM_COLS - 1) / 2);

				this.runAction(cc.sequence(cc.delayTime(5.5),
					cc.callFunc(function() {
						NJ.audio.playSound(res.plipSound);
						that.spawnDropBlock(centerCol, 2);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 1);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 2, 3);
					}), cc.delayTime(1), cc.callFunc(function() {
						that._startHandOverPath([
							that._convertLevelCoordsToPoint(centerCol, 0),
							that._convertLevelCoordsToPoint(centerCol + 2, 0)
						]);

						if(that._tutorialLayer.getCurrSlide() == slides.intro) {
							that._handIndicator.runAction(cc.sequence(cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol, 0);
								if (block) block.highlight();
							}), cc.delayTime(0.5), cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol + 1, 0);
								if (block) block.highlight();
							}), cc.delayTime(0.2), cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol + 2, 0);
								if (block) block.highlight();
							}), cc.delayTime(1.5)).repeatForever());
						}
					})
				));

				break;
			case slides.practice1:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this._clearHand();

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						NJ.audio.playSound(res.plipSound);
						that.spawnDropBlock(centerCol - 2, 1);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 2);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 4);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 7);
					})
				));

				break;
			case slides.teach2:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

                this._clearHand();

				this.runAction(cc.sequence(cc.delayTime(4),
					cc.callFunc(function() {
						NJ.audio.playSound(res.plipSound);
						that.spawnDropBlock(centerCol - 2, 2);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 2, 6);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 3);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 4);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 5);
					}), cc.callFunc(function() {
						that.spawnDropBlock(centerCol + 1, 2);
					}), cc.delayTime(1), cc.callFunc(function() {
                        that._startHandOverPath([
                            that._convertLevelCoordsToPoint(centerCol - 2, 0),
                            that._convertLevelCoordsToPoint(centerCol - 1, 0),
                            that._convertLevelCoordsToPoint(centerCol, 1)
                        ]);

						if(that._tutorialLayer.getCurrSlide() == slides.teach2) {
							that._handIndicator.runAction(cc.sequence(cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol - 2, 0);
								if (block) block.highlight();
							}), cc.delayTime(0.5), cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol - 1, 0);
								if (block) block.highlight();
							}), cc.delayTime(0.2), cc.callFunc(function () {
								var block = that._numboController.getBlock(centerCol, 1);
								if (block) block.highlight();
							}), cc.delayTime(1.5)).repeatForever());
						}
                    })
				));

				break;

            case slides.practice2:
                centerCol = Math.floor((NJ.NUM_COLS) / 2);

                this._clearHand();

                this.runAction(cc.sequence(cc.delayTime(4),
                    cc.callFunc(function() {
						NJ.audio.playSound(res.plipSound);
                        that.spawnDropBlock(centerCol - 2, 4);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol - 1, 7);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol, 5);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol + 1, 8);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol + 2, 2);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol - 2, 3);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol - 1, 4);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol + 1, 3);
                    }), cc.callFunc(function() {
                        that.spawnDropBlock(centerCol + 2, 2);
                    })
                ));

                break;

			case slides.end:

				this.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(function() {
					that.leave(function() {

						// first send the analytics for the current game session
						NJ.sendAnalytics("Tutorial");

						// first time playing? give them some starters
						if(!NJ.settings.hasLoadedTUT) {
							NJ.settings.hasLoadedTUT = true;
							NJ.stats.addHints(10);
							NJ.stats.addConverters(5);
							NJ.stats.addScramblers(3);
							NJ.stats.save();
						}

						NJ.saveSettings();

						// load resources
						var scene = new cc.Scene();
						scene.addChild(new NumboMenuLayer());
						cc.director.runScene(scene);
					});
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

	onPause: function() {
		if(this._pauseEnabled) {
			var that = this;

			this.leave(function() {
				that.onMenu();
			});
		}
	},

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
		// Activate any selected blocks.
		var selectedAndBonusBlocks = this._numboController.activateSelectedBlocks();
		var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
		var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

		this.redrawSelectedLines();

		this._numboHeaderLayer.setEquation([]);

		this._effectsLayer.clearComboOverlay();

		if (!selectedBlocks.length)
			return;

		this.scoreBlocksMakeParticles(selectedBlocks);
		this.scoreBlocksMakeParticles(bonusBlocks, true);

		this.relocateBlocks();

		// Allow controller to look for new hint.
		this._numboController.resetKnownPath();
		this.jiggleCount = 0;

		var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
		if(!comboLength)
			return;

		this._playActivationSounds(selectedBlocks.length);

        var targetBlock = Math.max.apply(null, selectedBlocks.map(function(b) {
            return b.val;
        }));

        if(this._tutorialLayer.getCurrSlide() == this._tutorialLayer.slides.teach2 && targetBlock == 5) {
            this._clearHand();
            this._tutorialLayer.fadeOutHelperLabel();
        }

		if (this._numboController.findHint().length == 0) {
			this._advanceTutorialSlide();
		}
	}
});