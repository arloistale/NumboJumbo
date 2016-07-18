/**
 * Created by The Dylan on 5/4/2016.
 */

var StackGameLayer = BaseGameLayer.extend({

    //// domain of spawning
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

    // initial # of blocks dropped every turn (increases at each level)
    _blocksToDrop: 4,
    _initialSpawnAmount: null,


    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        var that = this;

        this.pauseGame();

        this._numboController.initDistribution(this._numberList);
        this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());

        if(!NJ.settings.hasLoadedRE) {
            this._prepLayer = new PrepLayer(res.stackImage, NJ.themes.blockColors[2], "Stack", "Numbers appear\nwhen you make moves.\n\n\nThe game ends\nwhen the board fills up.\n\n\nLet's go!");
            this._prepLayer.setOnCloseCallback(function() {
                that.removeChild(that._prepLayer);
                that._prepLayer = null;

                NJ.settings.hasLoadedRE = true;
                NJ.saveSettings();

                that._reset();
            });
            this.addChild(this._prepLayer, 100);
        } else {
            this.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                that.enter(function () {
                    that.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
                        that.resumeGame();
                        that._isInGame = true;

                        // fill the board with blocks initially
                        that.spawnDropRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 3));
                        NJ.audio.playSound(res.plipSound);
                    })));
                });
            })));
        }
    },

    _initUI: function() {
        this._super();

        this._numboHeaderLayer.setConditionPrefix("Level: ");
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
        scene.addChild(new StackGameLayer());
        cc.director.runScene(scene);
    },

    onGameOver: function() {
        this._super();

        var that = this;

        this.leave(function() {
            that.endToEpilogue(NJ.modekeys.react);
        });
    },

    // whether the game is over or not
    isGameOver: function() {
        return (this._numboController.getNumBlocks() >= NJ.NUM_COLS * NJ.NUM_ROWS);
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

        var levelUpCount = NJ.gameState.levelUpIfNeeded();

        if(levelUpCount) {
            for (var i = 0; i < levelUpCount; ++i) {
                this._blocksToDrop++;
            }

            this._numboHeaderLayer.setConditionValue(NJ.gameState.getLevel());
        }

        var numBlocksToSpawn = Math.min(this._blocksToDrop, NJ.NUM_COLS * NJ.NUM_ROWS - this._numboController.getNumBlocks());

        this.spawnDropRandomBlocks(numBlocksToSpawn);

        while (this._numboController.findHint().length == 0){
            cc.log("oh shit, still have no moves. better scramble the board i guess!");
            this.scrambleBoard();
        }

        this.checkGameOver();
    }
});