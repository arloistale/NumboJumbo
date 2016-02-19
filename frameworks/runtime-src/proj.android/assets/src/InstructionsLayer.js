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

        this.presentControlsSlide();
    },

    presentControlsSlide: function() {
        this._menu.removeAllChildren();

        var that = this;

        var titleLabel = this.generateLabel("Controls");
        this._menu.addChild(titleLabel);

        // write instructions label
        var instructionsLabel = this.generateInstructionsLabel("Select chains of blocks by dragging your mouse or moving your finger across the blocks.");
        this._menu.addChild(instructionsLabel);

        this._menu.alignItemsVerticallyWithPadding(30);

        var backButton = this.generateTitleButton("Back", function () {
            that.onBack();
        });

        var nextButton = this.generateTitleButton("Next", function () {
            //that.presentGoalsSlide();
        });

        this._menu.addChild(backButton);
        this._menu.addChild(nextButton);

        this._menu.alignItemsInColumns(2);

        this.addChild(this._menu, 100);
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
    }
});