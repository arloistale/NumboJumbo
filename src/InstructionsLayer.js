/**
 * Created by jonathanlu on 1/19/16.
 */

var InstructionsLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    };

    return cc.LayerColor.extend({

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
            var instructionsTokens = [
                "Select Combos of Numbo Blocks by dragging mouse or finger across the blocks.",
                "Previous Numbos should add up to the last Numbos in the Combo."
            ];

            var instructionLabel;
            for(var i = 0; i < instructionsTokens.length; ++i) {
                instructionLabel = this.generateInstructionsLabel(instructionsTokens[i]);
                this._menu.addChild(instructionLabel);
            }

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.buttonSizes.back, refDim * NJ.buttonSizes.back);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.backImage);

            var nextButton = new NJMenuButton(buttonSize, function () {
                if(NJ.settings.sounds)
                    cc.audioEngine.playEffect(res.clickSound, false);

                that.presentGoalsSlide();
            }, this);
            nextButton.setImageRes(res.nextImage);

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

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.buttonSizes.back, refDim * NJ.buttonSizes.back);

            var backButton = new NJMenuButton(buttonSize, function () {
                if(NJ.settings.sounds)
                    cc.audioEngine.playEffect(res.clickSound, false);

                that.presentControlsSlide();
            }, this);
            backButton.setImageRes(res.backImage);

            var nextButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            nextButton.setImageRes(res.nextImage);

            this._menu.addChild(backButton);
            this._menu.addChild(nextButton);

            this._menu.alignItemsInColumns(1, 1, 1, 1, 2);
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
            cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
            cc.MenuItemFont.setFontSize(NJ.fontSizes.header);
            var toggleLabel = new cc.MenuItemFont(title);
            toggleLabel.setEnabled(false);
            toggleLabel.setColor(cc.color(255, 255, 255, 255));
            return toggleLabel;
        },

        generateInstructionsLabel: function(title) {
            var label = new cc.LabelTTF(title, b_getFontName(res.mainFont), NJ.fontSizes.paragraph, cc.size(cc.visibleRect.width * 0.9, 0));
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
}());