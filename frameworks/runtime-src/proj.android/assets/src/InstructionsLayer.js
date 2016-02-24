/**
 * Created by jonathanlu on 1/19/16.
 */

var InstructionsLayer = cc.Layer.extend({

    // UI Data
    _containerSprite: null,
    _menu: null,

    // Callbacks Data
    onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.initUI();
    },

    initUI: function() {
        var visibleSize = cc.director.getVisibleSize();
        var size = cc.size(visibleSize.width, visibleSize.height);

        this._containerSprite = new cc.Sprite();
        this._containerSprite.setContentSize(size);

        this._containerSprite.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this._containerSprite);

        var backgroundSprite = new cc.Sprite(res.backBottom);
        var backgroundSize = backgroundSprite.getContentSize();
        backgroundSprite.setScale(size.width / backgroundSize.width, size.height / backgroundSize.height);

        backgroundSprite.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2
        });

        this._containerSprite.addChild(backgroundSprite);

        this._menu = new cc.Menu();
        this._menu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: size.width / 2,
            y: size.height / 2
        });

        this._containerSprite.addChild(this._menu);

        this.presentControlsSlide();
    },

    presentControlsSlide: function() {
        this._menu.removeAllChildren();

        var that = this;

        var titleLabel = this.generateLabel("Controls");
        this._menu.addChild(titleLabel);

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

        var backButton = new MenuTitleButton("Back", function () {
            that.onBack();
        }, this);

        var nextButton = new MenuTitleButton("Next", function () {

            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            that.presentGoalsSlide();
        }, this);

        backButton.setImageRes(res.buttonImage);
        nextButton.setImageRes(res.buttonImage);

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

        var backButton = new MenuTitleButton("Previous", function () {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            that.presentControlsSlide();
        }, this);

        var nextButton = new MenuTitleButton("Finish", function () {
            that.onBack();
        }, this);

        backButton.setImageRes(res.buttonImage);
        nextButton.setImageRes(res.buttonImage);

        this._menu.addChild(backButton);
        this._menu.addChild(nextButton);

        this._menu.alignItemsInColumns(1, 1, 1, 1, 2);
    },

///////////////
// UI Events //
///////////////

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

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
        cc.MenuItemFont.setFontSize(NJ.fontSizes.header);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateInstructionsLabel: function(title) {
         var label = new cc.LabelTTF(title, b_getFontName(res.markerFont), NJ.fontSizes.paragraph, cc.size(cc.winSize.width * 0.9, 0));
         label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
         label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
         label.setColor(cc.color(255, 255, 255, 255));

         var menuLabel = new cc.MenuItemLabel(label);
         menuLabel.setEnabled(false);
         menuLabel.setColor(cc.color(255, 255, 255, 255));
         menuLabel.setDisabledColor(cc.color(255, 255, 255, 255));
         return menuLabel;
    }
});