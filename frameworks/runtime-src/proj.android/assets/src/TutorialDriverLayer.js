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

		this._advanceTutorialSlide();
	},

	_initTutorial: function() {
		this._tutorialLayer = new TutorialLayer();
		this.addChild(this._tutorialLayer, 999);
	},

	// Initialize audio.
	_initAudio: function() {
		// start the music
		this._backgroundTrack = res.trackDauntinglyMellow;
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
						that.spawnDropBlock(centerCol - 2, 1);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol - 1, 2);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 4);
					}), cc.delayTime(0.1), cc.callFunc(function() {
						that.spawnDropBlock(centerCol, 7);
					})
				));

				break;
			case slides.teach2:
				centerCol = Math.floor((NJ.NUM_COLS) / 2);

                this._clearHand();

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

			case slides.wombo:

				centerCol = Math.floor((NJ.NUM_COLS) / 2);

				this._clearHand();

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
					cc.director.runScene(scene);
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
		var selectedAndBonusBlocks = this._super(touchPosition);
		var selectedBlocks = selectedAndBonusBlocks.selectedBlocks;
		var bonusBlocks = selectedAndBonusBlocks.bonusBlocks;

		if (!selectedBlocks)
			return;
		var comboLength = (selectedBlocks.concat(bonusBlocks)).length;
		if(!comboLength)
			return;

        var targetBlock = Math.max.apply(null, selectedBlocks.map(function(b) {
            return b.val;
        }));

        if(this._tutorialLayer.getCurrSlide() == this._tutorialLayer.slides.teach2 && targetBlock == 5) {
            this._clearHand();
            this._tutorialLayer.fadeOutHelperLabel();
        }

		var activationSounds = [];
		for(var i = 0; i < comboLength; i++) {
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

        var that = this;


        if(this._tutorialLayer.getCurrSlide() == this._tutorialLayer.slides.wombo) {
            this.runAction(cc.sequence(cc.delayTime(0.45), cc.callFunc(function() {
                that._advanceTutorialSlide();
            })));
        } else {
            if (this._numboController.levelIsClear()) {
                this._advanceTutorialSlide();
            }
        }
	}
});