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

            var backgroundColor = NJ.themes.backgroundColor;
            this.init(cc.color(backgroundColor));

            this.initUI();
        },

        initUI: function() {
            var that = this;

            this._menu = new cc.Menu();

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);

            var headerLabel = this.generateLabel("Stats", refDim * NJ.uiSizes.header);

            var currentLabel = this.generateLabel("Current", refDim * NJ.uiSizes.header2);

            this._scoreLabel = this.generateLabel("Pts: " + NJ.prettifier.formatNumber(NJ.gameState.getScore()), refDim * NJ.uiSizes.header2);
            this._levelLabel = this.generateLabel("Lv: " + NJ.gameState.getLevel(), refDim * NJ.uiSizes.header2);

            var bestLabel = this.generateLabel("Best", refDim * NJ.uiSizes.header2);

            this._bestLabel = this.generateLabel("Pts: " + NJ.prettifier.formatNumber(NJ.stats.getHighscore()), refDim * NJ.uiSizes.header2);
            this._bestLevelLabel = this.generateLabel("Lv: " + NJ.stats.getHighlevel(), refDim * NJ.uiSizes.header2);

            this._menu.addChild(headerLabel);
            
            this._menu.addChild(currentLabel);
            
            this._menu.addChild(this._scoreLabel);
            this._menu.addChild(this._levelLabel);

            this._menu.addChild(bestLabel);

            this._menu.addChild(this._bestLabel);
            this._menu.addChild(this._bestLevelLabel);

            //var currencyTitleLabel = this.generateLabel("Currency");
            //this._currencyLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getCurrency()) + "", NJ.fontSizes.header2);

            //this._menu.addChild(currencyTitleLabel);
            //this._menu.addChild(this._currencyLabel);

            var buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var retryButton = new NJMenuButton(buttonSize, onRetry.bind(this), this);
            retryButton.setImageRes(res.retryImage);

            buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var menuButton = new NJMenuButton(buttonSize, onMenu.bind(this), this);
            menuButton.setImageRes(res.homeImage);

            this._menu.addChild(retryButton);
            this._menu.addChild(menuButton);

            this._menu.alignItemsInColumns(1, 1, 2, 1, 2, 1, 1);
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
            var toggleItem = new NJMenuItem(size);
            toggleItem.setTitle(title);
            toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
            return toggleItem;
        }
    });
}());