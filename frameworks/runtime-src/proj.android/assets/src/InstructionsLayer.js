/**
 * Created by jonathanlu on 1/19/16.
 */

var InstructionsLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,

    // Callbacks Data
    onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.init(cc.color(0, 0, 0, 255));

        this.initUI();
    },

    initUI: function() {
        this._menu = new cc.Menu();
        this.addChild(this._menu);

        this.presentControlsSlide();
    },

    presentControlsSlide: function() {
        this._menu.removeAllChildren();

        var that = this;

        var titleLabel = this.generateLabel("Controls");
        this._menu.addChild(titleLabel);

        // write instructions label
        var instructionsLabel = this.generateInstructionsLabel("Select Combos of Numbo Blocks by dragging across the blocks.\nPrevious numbers should add up to the last number in the Combo.");
        // write instructions label
        var instructionsTokens = [
            "Select Combos of Numbo Blocks by dragging mouse or finger across the blocks.",
            "Previous Numbos should add up to the last Numbos in the Combo."
        ];

        var instructionLabel;
        for(var i = 0; i < instructionsTokens.length; ++i) {
            instructionLabel = this.generateInstructionsLabel(instructionsTokens[i]);
            this._menu.addChild(instructionLabel);
        }

        var backButton = this.generateTitleButton("Back", function () {
            that.onBack();
        });

        var nextButton = this.generateTitleButton("Next", function () {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.tongue_click, false);

            that.presentGoalsSlide();
        });

        this._menu.addChild(backButton);
        this._menu.addChild(nextButton);

        this._menu.alignItemsInColumns(1, 1, 1, 2);
    },

    presentGoalsSlide: function() {
        this._menu.removeAllChildren();

        var that = this;

        var titleLabel = this.generateLabel("Goals");
        this._menu.addChild(titleLabel);

        // write instructions label
        var instructionsTokens = [
            "Longer combos give more points.",
            "Combo faster to increase points multiplier.",
            "Game over when the screen fills up with Numbo Blocks!"
        ];

        var instructionLabel;
        for(var i = 0; i < instructionsTokens.length; ++i) {
            instructionLabel = this.generateInstructionsLabel(instructionsTokens[i]);
            this._menu.addChild(instructionLabel);
        }

        var backButton = this.generateTitleButton("Previous", function () {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.tongue_click, false);

            that.presentControlsSlide();
        });

        var nextButton = this.generateTitleButton("Finish", function () {
            that.onBack();
        });

        this._menu.addChild(backButton);
        this._menu.addChild(nextButton);

        this._menu.alignItemsInColumns(1, 1, 1, 1, 2);
    },

///////////////
// UI Events //
///////////////

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.tongue_click, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    },

//////////////////
// UI Callbacks //
//////////////////

    setOnCloseCallback: function(callback) {
        this.onCloseCallback = callback;
    },

////////////////
// UI Helpers //
////////////////

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(56);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateInstructionsLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(30);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateTitleButton: function(title, callback) {
        var label = new cc.LabelTTF(title, b_getFontName(res.markerFont), 42);
        label.setColor(cc.color(255, 255, 255, 255));

        return new cc.MenuItemLabel(label, callback);
    }
});