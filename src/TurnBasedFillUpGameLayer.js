/**
 * Created by The Dylan on 5/4/2016.
 */

var TurnBasedFillUpGameLayer = BaseGameLayer.extend({

    // blocks dropped every turn (changes)
    _blocksToDrop: 3,
    _moreBlocksButton: null,

    ////////////////////
    // Initialization //
    ////////////////////

    _reset: function() {
        this._super();

        // fill the board with blocks initially
        this.spawnRandomBlocks(Math.floor(NJ.NUM_ROWS * NJ.NUM_COLS / 2));

        // next we wait until the blocks have been spawned to init the game
        var that = this;
        this.schedule(function() {
            that.checkGameOver();
        }, 1);
    },

    // Initialize audio.
    _initAudio: function() {
        // start the music
        this._backgroundTrack = res.backgroundTrack;
    },

    _initUI: function() {
        this._super();
        //this.schedule(this.quickDropButton, 1.3, false);
        //this.schedule(this.medDropButton, 3, false);
        //this.schedule(this.slowDropButton, 5, false);
        this.triggerMoreBlocksButton();
    },

    quickDropButton: function() {
        if(this._numboController.getKnownPathLength == 0 && this._numboController.getNumBlocks() < 7)
            this.triggerMoreBlocksButton();
    },
    medDropButton: function() {
        if(this._numboController.getKnownPathLength == 0 && this._moreBlocksButton == null)
            this.triggerMoreBlocksButton();
    },
    slowDropButton: function() {
        if(this._moreBlocksButton == null)
            this.triggerMoreBlocksButton();
    },


    /////////////////////////
    // Game State Handling //
    /////////////////////////

    // whether the game is over or not
    isGameOver: function() {
        return false;
        //return (this._numboController.getNumBlocks >= NJ.NUM_COLS*NJ.NUM_ROWS);
    },

    triggerMoreBlocksButton: function() {
        this._moreBlocksButton = new ccui.Button();
        this._moreBlocksButton.setTitleText("Drop More Blocks");
        this._moreBlocksButton.setTitleFontSize(20);
        this._moreBlocksButton.setTitleFontName("Arial");
        this._moreBlocksButton.setTitleColor(cc.color(0, 255, 0));
        this._moreBlocksButton.setAnchorPoint(cc.p(0, 0));
        this._moreBlocksButton.x = this._levelBounds.x+this._levelBounds.width/3;
        this._moreBlocksButton.y = this._levelBounds.y - this._levelBounds.height/16;
        this._moreBlocksButton.addTouchEventListener(this.clickEvent, this);
        this.addChild(this._moreBlocksButton, 8);
    },

    clickEvent: function(sender, type) {
        switch(type) {
            case ccui.Widget.TOUCH_ENDED:
                this.addMoreBlocks();
        }
    },

    addMoreBlocks: function() {
        this.spawnRandomBlocks(this._blocksToDrop);
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

       this.spawnRandomBlocks(Math.min(this._blocksToDrop, NJ.NUM_COLS*NJ.NUM_ROWS - this._numboController.getNumBlocks()));

        var activationSound = progresses[Math.min(comboLength*2, progresses.length-1)];

        // launch feedback for combo threshold title snippet
        if (comboLength >= 5) {

            //if (NJ.settings.sounds)
            //cc.audioEngine.playEffect(res.applauseSound);
        }

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(activationSound);

        if(this._numboHeaderLayer.getTurnsUntilPenalty() == 0) {
            this._blocksToDrop++;
            this._numboHeaderLayer.resetTurnsUntilPenalty();
        }
    },


});