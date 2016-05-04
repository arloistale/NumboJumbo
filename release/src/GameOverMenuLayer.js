/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onRetry = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onRetryCallback)
            this.onRetryCallback();
    };

    var onMenu = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);


        if(this.onMenuCallback)
            this.onMenuCallback();
    };

    return cc.LayerColor.extend({

        // UI Data
        _menu: null,
        _scoreLabel: null,
        _levelLabel: null,
        _bestLabel: null,
        _bestLevelLabel: null,
        _currencyLabel: null,

        // Callbacks Data
        onRetryCallback: null,
        onMenuCallback: null,

////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this.initUI();
        },

        initUI: function() {
            var that = this;

            this._menu = new cc.Menu();

            var headerLabel = this.generateLabel(NJ.gameState.getJumbo().name, NJ.fontSizes.header);

            var scoreTitleLabel = this.generateLabel("Score");
            this._scoreLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.gameState.getScore()) + "", NJ.fontSizes.header2);
            
            var levelTitleLabel = this.generateLabel("Level");
            this._levelLabel = this.generateLabel(NJ.gameState.getLevel() + "", NJ.fontSizes.header2);

            var bestTitleLabel = this.generateLabel("Best");
            this._bestLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getHighscore()) + "", NJ.fontSizes.header2);
            
            var bestLevelTitleLabel = this.generateLabel("Best Level");
            this._bestLevelLabel = this.generateLabel(NJ.stats.getHighlevel() + "", NJ.fontSizes.header2);

            this._menu.addChild(headerLabel);
            
            this._menu.addChild(scoreTitleLabel);
            this._menu.addChild(levelTitleLabel);
            
            this._menu.addChild(this._scoreLabel);
            this._menu.addChild(this._levelLabel);
            
            this._menu.addChild(bestTitleLabel);
            this._menu.addChild(bestLevelTitleLabel);
            
            this._menu.addChild(this._bestLabel);
            this._menu.addChild(this._bestLevelLabel);

            var currencyTitleLabel = this.generateLabel("Currency");
            this._currencyLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getCurrency()) + "", NJ.fontSizes.header2);

            this._menu.addChild(currencyTitleLabel);
            this._menu.addChild(this._currencyLabel);

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var retryButton = new NJMenuItem(buttonSize, onRetry.bind(this), this);
            retryButton.setImageRes(res.retryImage);

            buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var menuButton = new NJMenuItem(buttonSize, onMenu.bind(this), this);
            menuButton.setImageRes(res.homeImage);

            this._menu.addChild(retryButton);
            this._menu.addChild(menuButton);

            this._menu.alignItemsInColumns(1, 2, 2, 2, 2, 1, 1, 1, 1);
            this.addChild(this._menu, 100);
        },

//////////////////
// UI Callbacks //
//////////////////

        setOnRetryCallback: function(callback) {
            this.onRetryCallback = callback;
        },

        setOnMenuCallback: function(callback) {
            this.onMenuCallback = callback;
        },

////////////////
// UI Helpers //
////////////////

        generateLabel: function(title, size) {
            cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
            cc.MenuItemFont.setFontSize(size || NJ.fontSizes.sub);
            var toggleLabel = new cc.MenuItemFont(title);
            toggleLabel.setEnabled(false);
            toggleLabel.setColor(NJ.themes.defaultLabelColor);
            return toggleLabel;
        },

        setScore: function(score) {
            this._finalScore = Math.floor(score);

            this._scoreLabel.setString(this._finalScore);
        }
    });
}());