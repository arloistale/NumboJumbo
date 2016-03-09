/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,
    _scoreLabel: null,
    _bestLabel: null,
    _currencyLabel: null,

    // Callbacks Data
    onRetryCallback: null,
    onMenuCallback: null,
    
////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.init(cc.color(0, 0, 0, 255));

        this.initUI();
    },

    initUI: function() {
        var that = this;

        this._menu = new cc.Menu();

        var headerLabel = this.generateLabel(NJ.gameState.getJumbo().name, NJ.fontSizes.header);
        this._menu.addChild(headerLabel);

        var scoreTitleLabel = this.generateLabel("Score");
        this._scoreLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.gameState.getScore()) + "", NJ.fontSizes.header2);

        this._menu.addChild(scoreTitleLabel);
        this._menu.addChild(this._scoreLabel);

        var bestTitleLabel = this.generateLabel("Best");
        this._bestLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getHighscore()) + "", NJ.fontSizes.header2);

        this._menu.addChild(bestTitleLabel);
        this._menu.addChild(this._bestLabel);

        var currencyTitleLabel = this.generateLabel("Currency");
        this._currencyLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getCurrency()) + "", NJ.fontSizes.header2);

        this._menu.addChild(currencyTitleLabel);
        this._menu.addChild(this._currencyLabel);

        var retryButton = new MenuTitleButton("Retry", function() {
            that.onRetry();
        }, this);
        retryButton.setImageRes(res.buttonImage);

        var menuButton = new MenuTitleButton("Menu", function() {
            that.onMenu();
        }, this);
        menuButton.setImageRes(res.buttonImage);

        this._menu.addChild(retryButton);
        this._menu.addChild(menuButton);

        this._menu.alignItemsVerticallyWithPadding(10);
        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onRetry: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onRetryCallback)
            this.onRetryCallback();
    },

    onMenu: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);


        if(this.onMenuCallback)
            this.onMenuCallback();
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
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(size || NJ.fontSizes.sub);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    setScore: function(score) {
        this._finalScore = Math.floor(score);

        this._scoreLabel.setString(this._finalScore);
    }
});