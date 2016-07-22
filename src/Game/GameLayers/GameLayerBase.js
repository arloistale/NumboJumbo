/**
 * Created by jonathanlu on 1/18/16.
 */

var BaseGameLayer = (function() {
	var activationSounds = [
		{
			// combo length = 3
			startingDelay: 0.05,
			midDelay: 0.12,
			data: [ 0, 1, 2 ]
		},
		{
			// combo length = 4
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 1, 2, 3, 4]
		},
		{
			// combo length = 5
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 1, 2, 3, 4, 5, 6 ]
		},
		{
			// combo length = 6
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 2, 4, 6, 4, 2, 0 ]
		},
		{
			// combo length = 7
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 1, 3, 5, 7, 5, 3, 1, 0]
		},
		{
			// combo length = 8
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 2, 4, 6, 4, 2, 0, 6, 8 ]
		},
		{
			// combo length = 9
			startingDelay: 0.05,
			midDelay: 0.09,
			data: [ 0, 3, 6, 9, 6, 3, 0, 5, 7, 9 ]
		},
		{
			// combo length = 10
			startingDelay: 0.05,
			midDelay: 0.08,
			data: [ 6, 4, 2, 8, 6, 4, 5, 6, 7, 8, 9]
		}
	];


	return cc.Layer.extend({

		// Meta Data
		_modeKey: null,

		// Level Data
		_levelBounds: null,
		_levelCellSize: null,

		_headerSize: null,
		_toolBarSize: null,

		_blockSize: null,

		// UI Data
		_prepLayer: null,

		_numboHeaderLayer: null,
		_toolbarLayer: null,
		_settingsMenuLayer: null,
		_gameOverMenuLayer: null,
		_effectsLayer: null,
		_feedbackLayer: null,

		_infoInterfaceLayer: null,

		_shopletLayer: null,

		// Audio Data
		_backgroundTrack: null,

		// Geometry Data
		_backgroundLayer: null,
        _boardContainer: null,

		_playableRect: null,

		_levelSprite: null,
		_selectedLinesNode: null,

		// Controller Data
		_numboController: null,

		// Selection Data
		_lastTouchPosition: null,

		// data
		_isInGame: false,

		////////////////////
		// Initialization //
		////////////////////

		ctor: function () {
			this._super();

			this.unscheduleAllCallbacks();
			this.stopAllActions();

			this.setTag(NJ.tags.PAUSABLE);

			// Init game logic
			this._initInput();
			this._initController();

			// Init game visuals and audio
			this._initGeometry();
			this._initAudio();
			this._initParticles();
			this._initUI();

			// extranneous initialization
			this._reset();

			this._toolbarLayer.updatePowerups();
		},

		onExit: function() {
			this.unscheduleAllCallbacks();
			this.stopAllActions();
			cc.pool.drainAllPools();

			cc.eventManager.removeCustomListeners("game_on_hide");
			cc.eventManager.removeCustomListeners("game_on_show");

			this._super();
		},

		// Override this for extranneous
		_reset: function() {
			NJ.gameState.init();

			this._touchID = -1;

			this.unscheduleAllCallbacks();
			this.stopAllActions();

			this._selectedLinesNode.clear();

			this._numboHeaderLayer.reset();
			this._numboHeaderLayer.setScoreValue(0);
			this._numboHeaderLayer.setConditionValue(0);

			this._numboController.reset();
			this._feedbackLayer.reset();
			this._effectsLayer.reset();

			this._numboController.findHint();

            // play music again if music settings turned on
            NJ.audio.playMusic(this._backgroundTrack);
		},

		// init particle systems in the game
		_initParticles: function() {
			for (var col = 0; col < NJ.NUM_COLS; ++col){
				for (var row = 0; row < NJ.NUM_ROWS; ++row) {
					var coords = this._convertLevelCoordsToPoint(col, row);
					this._effectsLayer.initializeParticleSystemAt({
						x: coords.x,
						y: coords.y,
						col: col,
						row: row
					});
				}
			}
		},

		// Initialize input depending on the device.
		_initInput: function() {
            var that = this;

			if ('mouse' in cc.sys.capabilities) {
				cc.eventManager.addListener({
					event: cc.EventListener.MOUSE,
					onMouseDown: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchBegan(event.getLocation());

						return true;
					},
					onMouseMove: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchMoved(event.getLocation());

						return true;
					},
					onMouseUp: function (event) {
						if (event.getButton() != cc.EventMouse.BUTTON_LEFT)
							return false;

						event.getCurrentTarget().onTouchEnded(event.getLocation());

						return true;
					}
				}, this);
			}

			if (cc.sys.capabilities.hasOwnProperty('touches')) {
				cc.eventManager.addListener({
					prevTouchId: -1,
					event: cc.EventListener.TOUCH_ONE_BY_ONE,
					swallowTouches: true,
					onTouchBegan: function(touch, event) {
                        if(touch.getID() == 0) {
                            event.getCurrentTarget().onTouchBegan(touch.getLocation());
                        }

                        return true;
					},
					onTouchMoved: function(touch, event) {
                        if(touch.getID() == 0) {
                            event.getCurrentTarget().onTouchMoved(touch.getLocation());
                        }

						return true;
					},
					onTouchEnded: function(touch, event) {
                        if(touch.getID() == 0) {
                            event.getCurrentTarget().onTouchEnded(touch.getLocation());
                        }

						return true;
					}
				}, this);
			}

			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				onKeyPressed: function(key, event) {
					if(key == cc.KEY.back) {
						that.onPause();
					}
				}
			}, this);

			cc.eventManager.addListener(cc.EventListener.create({
				event: cc.EventListener.CUSTOM,
				eventName: "game_on_hide",
				callback: function(event) {
					if(that._isInGame) {
						that.onPause(true);
					}
				}
			}), 1);

			cc.eventManager.addListener(cc.EventListener.create({
				event: cc.EventListener.CUSTOM,
				eventName: "game_on_show",
				callback: function(event) {
					if(that._isInGame) {
						that.onResume();
					}
				}
			}), 2);
		},

		// Initialize UI elements
		_initUI: function() {
			var that = this;

			// header
			this._numboHeaderLayer = new NumboHeaderLayer(this._headerSize);
			this.addChild(this._numboHeaderLayer, 999);
			this._numboHeaderLayer.setScoreValue(0);
			this._numboHeaderLayer.setConditionValue(0);
			this._numboHeaderLayer.setOnPauseCallback(function() {
				that.onPause();
			});

			// toolbar
			this._toolbarLayer = new ToolbarLayer( this._toolBarSize);

			this._toolbarLayer.setOnConvertCallback(function() {
				if (NJ.gameState.getConvertersRemaining() > 0) {
					if(NJ.stats.getNumConverters() > 0) {
						if(!that._isShowingReduceInterface)
							that.enterReduceInfoInterface();
						else
							that.leaveReduceInfoInterface();
					} else {
						that.showShoplet(NJ.purchases.ingameItemKeys.converter);
					}
				}
			});

			this._toolbarLayer.setOnScrambleCallback(function(){
				if (NJ.gameState.getScramblesRemaining() > 0) {
					if(NJ.stats.getNumScramblers() > 0) {
						that.scrambleBoard();
						NJ.stats.depleteScramblers();
						NJ.stats.save();
						NJ.gameState.decrementScramblesRemaining();
						that._toolbarLayer.updatePowerups();
					} else {
                        that.showShoplet(NJ.purchases.ingameItemKeys.scrambler);
					}
				}
			});

			this._toolbarLayer.setOnHintCallback(function(){
				if (NJ.gameState.getHintsRemaining() > 0) {
					if(NJ.stats.getNumHints() > 0) {
						if (that.jiggleHintBlocksAndReset()) {
							NJ.stats.depleteHints();
							NJ.stats.save();
							NJ.gameState.decrementHintsRemaining();
							that._toolbarLayer.updatePowerups();
						}
					} else {
                        that.showShoplet(NJ.purchases.ingameItemKeys.hint);
					}
				}
			});

			this.addChild(this._toolbarLayer, 999);

			// info for power ups
			this._infoInterfaceLayer = new InfoInterfaceLayer(cc.size(this._playableRect.width, this._playableRect.height));
			this.addChild(this._infoInterfaceLayer, 999);
		},

		// Initialize dimensions and geometry
		_initGeometry: function() {
			// background
			this._backgroundLayer = new BackgroundLayer();
			this.addChild(this._backgroundLayer, -3);

			// level geometry

			// first we must calculate header and toolbar sizes (even though we are not in UI) in order to make space
			this._headerSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar);
			this._toolBarSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar);

			var playableRect = this._playableRect = cc.rect({
				x: cc.visibleRect.bottomLeft.x,
				y: cc.visibleRect.bottomLeft.y +  this._toolBarSize.height,
				width: cc.visibleRect.width,
				height: cc.visibleRect.height - this._headerSize.height -  this._toolBarSize.height
			});

			var refDim = Math.min(playableRect.width, playableRect.height);
			var levelPadding = refDim * 0.02;
			var safeDim = refDim - levelPadding * 2;
			var cellSize = Math.min(safeDim / NJ.NUM_COLS, safeDim / NJ.NUM_ROWS);

			var levelDims = cc.size(cellSize * NJ.NUM_COLS, cellSize * NJ.NUM_ROWS);
			var levelOrigin = cc.p(playableRect.x + playableRect.width / 2 - levelDims.width / 2, playableRect.y + playableRect.height / 2 - levelDims.height / 2);

			this._levelCellSize = cc.size(cellSize, cellSize);
			this._levelBounds = cc.rect(levelOrigin.x, levelOrigin.y, levelDims.width, levelDims.height);

			this._blockSize = cc.size( this._levelCellSize.width * NJ.blockCellSize,  this._levelCellSize.height * NJ.blockCellSize);

            this._boardContainer = new cc.Layer();
            this.addChild(this._boardContainer);

			// selected lines
			this._selectedLinesNode = cc.DrawNode.create();
			this._boardContainer.addChild(this._selectedLinesNode, 2);

			this.redrawSelectedLines(null);

			// feedback overlay
			this._feedbackLayer = new FeedbackLayer();
			this._boardContainer.addChild(this._feedbackLayer, 800);

			// effects middle layer between background and game elements
			this._effectsLayer = new EffectsLayer();
			this._boardContainer.addChild(this._effectsLayer, 24);
		},

		// Initialize the Numbo Controller, which controls the level.
		_initController: function() {
			this._numboController = new NumboController();
			this._numboController.init();
		},

		// Initialize audio.
		_initAudio: function() {
			// start the music
			this._backgroundTrack = res.trackChill2;
		},

		enter: function(callback) {
			var that = this;

			this._backgroundLayer.runAction(cc.sequence(cc.callFunc(function() {
				// cause UI elements to fall in
				that._numboHeaderLayer.enter();
				that._toolbarLayer.enter();
			}), cc.delayTime(0.4), cc.callFunc(function() {
				if(callback)
					callback();
			})));
		},

		leave: function(callback) {
			var that = this;

			this._backgroundLayer.runAction(cc.sequence(cc.callFunc(function() {
				that._numboHeaderLayer.leave();
				that._toolbarLayer.leave();
			}), cc.delayTime(0.4), cc.callFunc(function() {
				if(callback)
					callback();
			})));
		},

        enterBoard: function() {
            this._boardContainer.runAction(cc.sequence(cc.moveTo(0.4, cc.p(0, 0)).easing(cc.easeBackOut())));
        },

        leaveBoard: function() {
            this._boardContainer.runAction(cc.sequence(cc.moveTo(0.4, cc.p(cc.visibleRect.width, 0)).easing(cc.easeBackOut())));
        },

		/////////////////////////
		// Game State Handling //
		/////////////////////////

		// ends the session and goes to the game over screen
		// for the appropriate mode
		endToEpilogue: function(modeKey) {
			var that = this;

			var score = NJ.gameState.getScore();
			var highscoreAccepted = NJ.stats.offerHighscore(modeKey, score);

			var scoreDiff = NJ.gameState.getScore();
			if(NJ.stats.isDoubleEnabled())
				scoreDiff *= 2;

			NJ.stats.addCurrency(scoreDiff);

			this._backgroundLayer.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
				// now clear the level once all that is dealt with
				that._numboController.clearLevel();
			}), cc.delayTime(0.5), cc.callFunc(function() {
				// deal with saving high scores and achievements
				var highscore = NJ.stats.getHighscore(modeKey);
				NJ.social.submitScore(modeKey, highscore);
				NJ.social.offerAchievementForModeWithScore(modeKey, highscore);
				NJ.stats.save();

				// send the analytics for the current game session
				NJ.sendAnalytics(NJ.modeNames[modeKey]);
			}), cc.delayTime(0.5), cc.callFunc(function() {
				that.pauseGame();

				that._gameOverMenuLayer = new GameOverMenuLayer(modeKey, highscoreAccepted);
				that._gameOverMenuLayer.setOnRetryCallback(function() {
					that.onRetry();
				});
				that._gameOverMenuLayer.setOnMenuCallback(function() {
					that.onMenu();
				});
				that.addChild(that._gameOverMenuLayer, 999);

				that._gameOverMenuLayer.enter();
			})));
		},

		// checks whether the game has ended and performs actions appropriately
		// this function also triggers the doom sayer if in danger
		// returns whether the game is over
		checkGameOver: function() {
			if (this.isGameOver() ) {
				this.onGameOver();
				return true;
			}

			return false;
		},

		// IMPORTANT: You must override this function for all children
		// Determines whether the game session has ended
		isGameOver: function() {
			cc.assert(false, "isGameOver: abstract function");

			return true;
		},

		pauseInput: function() {
			cc.eventManager.pauseTarget(this, true);
		},

		resumeInput: function() {
			cc.eventManager.resumeTarget(this, true);
		},

		// Pauses the game, halting all actions and schedulers.
		pauseGame: function() {
			// halt the doomsayer
			this._feedbackLayer.clearDoomsayer();

			// use breadth first search to pause all valid children
			var children = [this];
			var visited = [this];

			this.pauseInput();
			this.pause();

			var child, i, newChildren;
			while(children.length > 0) {
				child = children.pop();

				if (child.getTag() == NJ.tags.PAUSABLE)
					child.pause();

				newChildren = child.getChildren();
				for(i = 0; i < newChildren.length; i++) {
					cc.assert(visited.indexOf(newChildren[i]) < 0, "Circular node references detected!");

					visited.push(newChildren[i]);
					children.push(newChildren[i]);
				}
			}
		},

		// Unpauses game, resuming all actions and schedulers.
		resumeGame: function() {
			// use breadth first search to resume all valid children
			var children = [this];
			var visited = [this];

			this.resume();
			this.resumeInput();

			var child, i, newChildren;
			while(children.length > 0) {
				child = children.pop();

				if (child.getTag() == NJ.tags.PAUSABLE)
					child.resume();

				newChildren = child.getChildren();
				for(i = 0; i < newChildren.length; i++) {
					cc.assert(visited.indexOf(newChildren[i]) < 0, "Circular node references detected");

					visited.push(newChildren[i]);
					children.push(newChildren[i]);
				}
			}
		},

		////////////////////
		// Block Spawning //
		////////////////////

		// Move scene block sprite into place.
		moveBlockIntoPlace: function(moveBlock) {
			var blockTargetY = this._levelBounds.y + this._levelCellSize.height * (moveBlock.row + 0.5);
			var blockTargetX = this._levelBounds.x + this._levelCellSize.width * (moveBlock.col + 0.5);

			var bounceEasing = cc.easeBounceOut();

			var moveVerticalAction = cc.moveTo(0.7, cc.p(moveBlock.getPositionX(), blockTargetY)).easing(bounceEasing);
			var moveHorizontalAction = cc.moveTo(0.7, cc.p(blockTargetX, moveBlock.getPositionY())).easing(cc.easeQuinticActionInOut());

			moveVerticalAction.setTag(42);
			moveHorizontalAction.setTag(43);

			moveBlock.stopActionByTag(42);
			moveBlock.stopActionByTag(43);

			moveBlock.runAction(moveVerticalAction);
			moveBlock.runAction(moveHorizontalAction);
		},

		// spawns and drops a block with random col and val.
		// plays appropriate sound
		spawnDropBlock: function(col, val) {
			var spawnBlock = NumboBlock.recreate(this._blockSize);
			this._numboController.spawnDropBlock(spawnBlock, col, val);
			this._instantiateBlock(spawnBlock);
			this.moveBlockIntoPlace(spawnBlock);
		},

		// Spawns a block with random col and val and drops the spawned block into place.
		// plays appropriate sound
		spawnDropRandomBlock: function() {
			var spawnBlock = NumboBlock.recreate(this._blockSize);
			this._numboController.spawnDropRandomBlock(spawnBlock);
			this._instantiateBlock(spawnBlock);
			this.moveBlockIntoPlace(spawnBlock);
		},

        // Scrambles the board until there is a valid move
		scrambleBoard: function() {
			NJ.audio.playSound(res.swooshSound);

			var blockList = this._numboController.getBlocksList();
			var positionList = [];
			var block;

			var i;

			for (i = 0; i < blockList.length; ++i){
				block = blockList[i];
				positionList.push(block.getPosition());
			}

			this._numboController.removeAllBlocks();
			positionList = NJ.shuffleArray(positionList);

			for (i = 0; i < positionList.length; ++i) {
				block = NumboBlock.recreate(this._blockSize);
				this._numboController.spawnDropRandomBlock(block);
				this._instantiateBlock(block);
				block.setPosition(positionList[i]);
				this.moveBlockIntoPlace(block);
			}

			this._numboController.resetKnownPath();
            // TODO: This recursively arranges the board
			if (this._numboController.haveNoMoves()) {
				this.scrambleBoard();
			}

		},

		// spawns a specified amount of blocks randomly
		// plays the drop random blocks sound
		spawnDropRandomBlocks: function(amount) {
			var spawnBlock;

			for(var i = 0; i < amount; i++) {
				spawnBlock = NumboBlock.recreate( this._blockSize);
				this._numboController.spawnDropRandomBlock(spawnBlock);
				this._instantiateBlock(spawnBlock);
				this.moveBlockIntoPlace(spawnBlock);
			}
		},

		// helper function to move a spawned block into place, shifting its position based on column
		_instantiateBlock: function(block) {
			var blockX = this._levelBounds.x +  this._levelCellSize.width * (block.col + 0.5);
			block.setPosition(blockX, cc.visibleRect.top.y +  this._levelCellSize.height / 2);
			this._boardContainer.addChild(block, 42, 42);
		},

		//////////////////
		// Hint Finding //
		//////////////////

		jiggleHintBlocksAndReset: function(){
			var hint = this._numboController.findHint();

			if (hint.length > 0) {
				for (var i in hint) {
					if (hint.hasOwnProperty(i))
						hint[i].jiggleSprite();
				}
				this._numboController.resetKnownPath();

				return true;
			}

			return false;
		},

		///////////////////////
		// Game State Events //
		///////////////////////

		// Halts game, children must handle what to do afterwards in terms of going to game over screen
		// also increments number of times played overall
		onGameOver: function() {
			var that = this;

			this._isInGame = false;

			this._selectedLinesNode.clear();
			this._feedbackLayer.clearDoomsayer();
			this.pauseInput();
			this.unscheduleAllCallbacks();

			NJ.audio.playSound(res.overSound);

			NJ.audio.stopMusic();

			// achievements

			var numGames = NJ.stats.incrementNumGamesCompleted();

			if(numGames >= 5) {
				NJ.social.unlockAchievement(NJ.social.achievements.played1);

				if(numGames >= 10) {
					NJ.social.unlockAchievement(NJ.social.achievements.played2);

					if (numGames >= 25) {
						NJ.social.unlockAchievement(NJ.social.achievements.played3);

						if (numGames >= 50) {
							NJ.social.unlockAchievement(NJ.social.achievements.played4);

							if (numGames >= 100) {
								NJ.social.unlockAchievement(NJ.social.achievements.played5);
							}
						}
					}
				}
			}

			this.leave(function() {
				that.endToEpilogue(that._modeKey);
			})
		},

		///////////////
		// UI Events //
		///////////////

		// On pause, pauses game and opens up the settings menu.
		onPause: function(isInstant) {
			var that = this;

			that._isInGame = false;

			this._feedbackLayer.clearDoomsayer();

			this.pauseGame();

            this.leaveBoard();

			if(this._isShowingReduceInterface)
				this.leaveReduceInfoInterface();

			var callback = function() {
				that._settingsMenuLayer = new SettingsMenuLayer(true);
				that._settingsMenuLayer.setOnRetryCallback(function() {
					that.onRetry();
				});
				that._settingsMenuLayer.setOnCloseCallback(function() {
					that.removeChild(that._settingsMenuLayer);
					that.onResume();
				});
				that._settingsMenuLayer.setOnMenuCallback(function() {
					that.onMenu();
				});
				that.addChild(that._settingsMenuLayer, 999);
				that._settingsMenuLayer.enter();
			};

			if(isInstant) {
				callback();
			} else {
				this.leave(callback);
			}
		},

		// On closing previously opened settings menu we resume.
		onResume: function() {
			var that = this;

			that._isInGame = true;

			that.resumeGame();

            this.enterBoard();

			that._updateTheme();

            // clear the equation if it hasn't been cleared already
            this._numboHeaderLayer.activateEquation();
            this._numboController.deselectAllBlocks();

			this.enter(function() {
                if(that.isInDanger())
                    that._feedbackLayer.launchDoomsayer();

                // play music again if music settings turned on
                NJ.audio.playMusic(that._backgroundTrack);
            });
		},

		// On game over when player chooses to go to menu we return to menu.
		onRetry: function() {
			if(this._gameOverMenuLayer)
				this.removeChild(this._gameOverMenuLayer);

			//this._reset();
		},

		// On game over when player chooses to go to menu we return to menu.
		onMenu: function() {
			// reset necessary modules
			this._feedbackLayer.reset();

			//load resources
			NJ.audio.stopMusic();

			var scene = new cc.Scene();
			scene.addChild(new NumboMenuLayer());
			cc.director.runScene(scene);
		},

//////////////////
// Touch Events //
//////////////////

		// On touch began, tries to find level coordinates for the touch and selects block accordingly.
		onTouchBegan: function(touchPosition) {
			this._lastTouchPosition = touchPosition;

			var touchCoords = this._convertPointToLevelCoords(touchPosition);

			if (touchCoords && this._isPointWithinCoordsDistanceThreshold(touchPosition, touchCoords.col, touchCoords.row)) {
				var selectedBlock = this._numboController.selectBlock(touchCoords.col, touchCoords.row);
				var selectedBlocks = this._numboController.getSelectedBlocks();

				// we know there is at least 1 selected block
				if (selectedBlocks.length) {
					var selectedBlockSum = 0;
					var block;
					for (i = 0; i < selectedBlocks.length; i++) {
						block = selectedBlocks[i];
						selectedBlockSum += block.val;
					}

					// if selected block was returned then we have a new selected block deal with
					if(selectedBlock) {
                        // this audio may be changed
                        var selectAudio = plops[Math.min(selectedBlocks.length, plops.length - 1)];

						// if we have already selected then we are trying to use the quick convert feature
						if(selectedBlock.val != 1) {

							// we should not try to reduce if we're in the tutorial
							if(this._modeKey != NJ.modekeys.tutorial) {
								if ((this._isShowingReduceInterface || selectedBlock.isSelected) && NJ.gameState.getConvertersRemaining() > 0) {
									if (NJ.stats.getNumConverters() > 0) {
										//selectAudio = res.Sound;

										selectedBlock.convertValue(1);
										NJ.stats.depleteConverters();
										NJ.stats.save();
										NJ.gameState.decrementConvertersRemaining();

										this._toolbarLayer.updatePowerups();

										if (this._isShowingReduceInterface) {
											this.leaveReduceInfoInterface();
										}

										this._numboController.resetKnownPath();

										// it's possible to have converted the board to no solutions
										if (this._numboController.haveNoMoves()) {
											this.scrambleBoard();
										}
									} else {
										this.showShoplet(NJ.purchases.ingameItemKeys.converter);
									}
								} else {
									selectedBlock.select();
								}
							} else {
								selectedBlock.highlight();
							}
						} else {
							selectedBlock.highlight();
						}

						// gotta update the equation
						var selectedNums = selectedBlocks.map(function(b) {
							return b.val;
						});
						this._numboHeaderLayer.setEquation(selectedNums);

                        NJ.audio.playSound(selectAudio);
					}

					this.redrawSelectedLines(selectedBlocks);
				}
			}
		},

		// On touch moved, selects additional blocks as the touch is held and moved using raycasting
		onTouchMoved: function(touchPosition) {
			var touchDiff = cc.pSub(touchPosition, this._lastTouchPosition);
			var touchDistance = cc.pLength(touchDiff);
			var touchDirection = cc.pNormalize(touchDiff);
			var testLength =  this._levelCellSize.width * 0.25;
			var currLength = 0;
			var currPosition = null;

			var touchCoords = null;
			var touchBlock = null;
			var selectedBlock = null;
			var deselectedBlock = null;

			var penultimate = this._numboController.getPenultimateSelectedBlock();

			for (var i = 0; currLength <= touchDistance; i++) {
				currPosition = cc.pAdd(this._lastTouchPosition, cc.pMult(touchDirection, currLength));

				touchCoords = this._convertPointToLevelCoords(currPosition);

				// if we have valid touch coordinates then we either select or deselect the block based on
				// whether it is already selected and is the last selected block
				if (touchCoords && this._isPointWithinCoordsDistanceThreshold(currPosition, touchCoords.col, touchCoords.row)) {
					touchBlock = this._numboController.getBlock(touchCoords.col, touchCoords.row);
					if(penultimate && touchBlock === penultimate) {
						deselectedBlock = this._numboController.deselectLastBlock();
					} else {
						selectedBlock = this._numboController.selectBlock(touchCoords.col, touchCoords.row) || selectedBlock;
					}
				}

				currLength = testLength * (i + 1);
			}

			var selectedBlocks = this._numboController.getSelectedBlocks();

			if(selectedBlock || deselectedBlock) {
				NJ.audio.playSound(plops[Math.min(selectedBlocks.length, plops.length - 1)]);

				// also update the equation
				var selectedNums = selectedBlocks.map(function (b) {
					return b.val;
				});
				this._numboHeaderLayer.setEquation(selectedNums);
			}

			// update graphics for selected blocks
			if (selectedBlocks.length) {
				var block = selectedBlocks[selectedBlocks.length - 1];

				var currColor = NJ.getColor(block.val - 1);

				// if selected block was returned then we have a new selected block deal with
				if(selectedBlock) {
					var highlightBlocks = [selectedBlock];

					var isCombo = this._numboController.isSelectedClearable();

					if(isCombo) {
						highlightBlocks = highlightBlocks.concat(selectedBlocks.slice(0));

						selectedBlock.highlight();

						if(this._numboController.getSelectedBlocks().length >= 7) {
							NJ.audio.playSound(res.tensionSound3, 1);
						} else if(this._numboController.getSelectedBlocks().length >= 5) {
							NJ.audio.playSound(res.tensionSound2, 0.9);
						} else if(this._numboController.getSelectedBlocks().length >= 3) {
							NJ.audio.playSound(res.tensionSound, 0.8);
						}
					}

					// remove duplicates
					for (i = 0; i < highlightBlocks.length; ++i) {
						for (var j = i + 1; j < highlightBlocks.length; ++j) {
							if (highlightBlocks[i] === highlightBlocks[j])
								highlightBlocks.splice(j--, 1);
						}
					}

					// highlight all blocks to be potentially cleared
					for (i = 0; i < highlightBlocks.length; ++i) {
						highlightBlocks[i].highlight();
					}

					var bonusBlocks = this._numboController.getBonusBlocks(highlightBlocks.length);

					for(i = 0; i < bonusBlocks.length; ++i) {
						bonusBlocks[i].highlight();
					}
				}

				this.redrawSelectedLines(selectedBlocks);

				// draw a line from last selected to our finger if we are outside of the range of the block
				var lastBlockPos = this._convertLevelCoordsToPoint(block.col, block.row);
				var diff = cc.pSub(touchPosition, lastBlockPos);
				var radius = 0.5 *  this._blockSize.width;
				if (cc.pDot(diff, diff) >= radius * radius) {
					this._selectedLinesNode.drawSegment(this._convertLevelCoordsToPoint(block.col, block.row),
						touchPosition, this._blockSize.height / 8, currColor);
				}
			}

			this._lastTouchPosition = touchPosition;
		},

		// On touch ended, activates all selected blocks once touch is released.
		// Returns the cleared blocks.
		onTouchEnded: function(touchPosition) {
			// just for decoration :)
		},

		scoreBlocksMakeParticles: function(blocks, shouldLaunchShadow){
			// initiate iterator variables here because we use them a lot
			var i, block, color;

			var scoreDifference = 0;

			// loop through the blocks, giving each one a particle explosion and also computing some values
			for (i = 0; i < blocks.length; i++) {
				block = blocks[i];
				// we need to find the target value which will be the maximum value in the cleared blocks
				scoreDifference += block.val;

				color = NJ.getColor(block.val - 1) || cc.color("#ffffff");
				if (block) {
					var coords = this._convertPointToLevelCoords({x: block.x, y: block.y});
					if (coords && !NJ.settings.battery) {
						this._effectsLayer.launchExplosion(coords.col, coords.row, color, shouldLaunchShadow);
					}
				}
			}

			// add to number of blocks cleared
			NJ.gameState.addBlocksCleared(blocks.length);

			// add to score
			NJ.gameState.addScore(scoreDifference);

			this._numboHeaderLayer.setScoreValue(NJ.gameState.getScore());
		},

		relocateBlocks: function () {
			// Gaps may be created; shift all affected blocks down.
			var blocks = this._numboController.getBlocksList();
			for (var i = 0; i < blocks.length; ++i){
				this.moveBlockIntoPlace(blocks[i]);
			}
		},

		////////////////
		// UI Helpers //
		////////////////

		// pause the game and enter the shoplet to buy more items
		showShoplet: function(itemKey) {

			var that = this;

			that._isInGame = false;

			this._feedbackLayer.clearDoomsayer();

            // TODO: This is sort of a hack to get timed mode to function correctly
            this._timePassed = (Date.now() - NJ.gameState.getStartTime()) / 1000;

			this.pauseGame();
			this.leaveBoard();

			var callback = function() {
				that._shopletLayer = new ShopletLayer(itemKey);
				that._shopletLayer.setOnCloseCallback(function() {
					that.removeChild(that._shopletLayer);
					that._toolbarLayer.updatePowerups();
					that.onResume();
				});
				that.addChild(that._shopletLayer, 999);
				that._shopletLayer.enter();
			};

			this.leave(callback);
		},

		// enters the interface to show players
		// how to use the reduce power up
		enterReduceInfoInterface: function() {
			this._isShowingReduceInterface = true;

			/*
			var blocks = this._numboController.getBlocksList();
			for(var i = 0; i < blocks.length; ++i) {
				blocks[i].highlight(true);
			}*/

			this._infoInterfaceLayer.reset();
			this._infoInterfaceLayer.setPrimaryInfo("Tap a number to reduce it to 1.");
			this._infoInterfaceLayer.setSecondaryInfo("Double tap any number to quickly reduce.");
			this._infoInterfaceLayer.enter();
		},

/////////////
// Drawing //
/////////////

		// leave the interface for showing players how to reduce
		leaveReduceInfoInterface: function() {
			this._isShowingReduceInterface = false;

			/*
			var blocks = this._numboController.getBlocksList();
			for(var i = 0; i < blocks.length; ++i) {
				blocks[i].clearHighlight(true);
			}*/

			this._infoInterfaceLayer.leave();
		},

		// generate dividers on headers and toolbars
		_generateBaseDividers: function() {
			var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

			var headerDivider = new NumboMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
			headerDivider.setTag(444);
			headerDivider.setBackgroundImage(res.alertImage);
			headerDivider.setBackgroundColor(NJ.themes.dividerColor);
			headerDivider.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: this._numboHeaderLayer.getContentSize().width / 2,
				y: dividerHeight
			});
			this._numboHeaderLayer.addChild(headerDivider);

			var toolDivider = new NumboMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
			toolDivider.setTag(444);
			toolDivider.setBackgroundImage(res.alertImage);
			toolDivider.setBackgroundColor(NJ.themes.dividerColor);
			toolDivider.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: this._toolbarLayer.getContentSize().width / 2,
				y: this._toolbarLayer.getContentSize().height - dividerHeight
			});
			this._toolbarLayer.addChild(toolDivider);
		},

		// redraw lines indicating selected blocks
		redrawSelectedLines: function(selectedBlocks) {
			this._selectedLinesNode.clear();

			if(!selectedBlocks)
				return;

			var i;

			var currSum = 0;
			var color;
			var first, second;
			for(i = 0; i < selectedBlocks.length - 1; i++) {
				first = selectedBlocks[i];
				second = selectedBlocks[i + 1];

				currSum = first.val;

				color = NJ.getColor(first.val-1);

				this._selectedLinesNode.drawSegment(this._convertLevelCoordsToPoint(first.col, first.row),
					this._convertLevelCoordsToPoint(second.col, second.row), this._blockSize.height / 8, color);
			}
		},

		/////////////
		// Virtual //
		/////////////

		isInDanger: function() {
			return true;
		},

		///////////////////
		// Audio Helpers //
		///////////////////

		// plays correct activations sounds based on original combo length
		_playActivationSounds: function(selectedLength) {
			if(NJ.settings.sounds) {

				// cache the data from the correct activation sounds set
				var activationSound = activationSounds[Math.min(activationSounds.length - 1, selectedLength - 3)];
				var startingDelay = activationSound.startingDelay;
				var midDelay = activationSound.midDelay;
				var data = activationSound.data;

				// start a sequence of Actions
				var actionList = [];

				// we always start with at least the first "boop" sound after a starting delay
				actionList.push(cc.delayTime(startingDelay));
				actionList.push(cc.callFunc(function() {
					NJ.audio.playSound(bloops[data[0]]);
				}));

				// now push in the rest of the activation sounds
				for(var i = 1; i < data.length; ++i) {
					(function() {
						var soundData = data[i];

						actionList.push(cc.delayTime(midDelay));
						actionList.push(cc.callFunc(function() {
							NJ.audio.playSound(bloops[soundData]);
						}));
					})();
				}

				// finally play the sequence in order
				this._backgroundLayer.runAction(cc.sequence(actionList));
			}
		},

		/////////////
		// Helpers //
		/////////////

		// determines whether a given point is within
		// a certain distance of the given grid coordinates
		_isPointWithinCoordsDistanceThreshold: function(point, col, row) {
			// return only if coordinates in certain radius of the block.
			var radius = 0.52 *  this._blockSize.width;

			var cellCenter = cc.p(this._levelBounds.x + (col + 0.5) *  this._levelCellSize.width,
				this._levelBounds.y + (row + 0.5) *  this._levelCellSize.height);

			var diff = cc.pSub(point, cellCenter);
			var distSq = cc.pDot(diff, diff);

			// check distance
			return distSq <= radius * radius;
		},

		// Attempt to convert point to location on grid.
		_convertPointToLevelCoords: function(point) {
			if (point.x >= this._levelBounds.x && point.x < this._levelBounds.x + this._levelBounds.width &&
				point.y >= this._levelBounds.y && point.y < this._levelBounds.y + this._levelBounds.height) {

				var col = Math.floor((point.x - this._levelBounds.x) /  this._levelCellSize.width);
				var row = Math.floor((point.y - this._levelBounds.y) /  this._levelCellSize.height);

				return { col: col, row: row };
			}

			return null;
		},

		// attempt to convert level coords to point
		_convertLevelCoordsToPoint: function(col, row) {
			return cc.p(this._levelBounds.x + (col + 0.5) *  this._levelCellSize.width,
				this._levelBounds.y + (row + 0.5) *  this._levelCellSize.height);
		},

		// update the color theme of the game
		_updateTheme: function() {
			this._backgroundLayer.setBackgroundColor(NJ.themes.backgroundColor);
			this._numboHeaderLayer.updateTheme();
			this._numboController.updateTheme();
		}
	});
}());