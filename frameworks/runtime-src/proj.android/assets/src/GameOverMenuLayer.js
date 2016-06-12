/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onRetry = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        this.leave(function() {
            if(that.onRetryCallback)
                that.onRetryCallback();
        });
    };

    var onMenu = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        this.leave(function() {
            if(that.onMenuCallback)
                that.onMenuCallback();
        });
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _statsMenu: null,
        _toolMenu: null,

        _scoreLabel: null,
        _condLabel: null,
        _bestLabel: null,
        _bestLevelLabel: null,
        _currencyLabel: null,

        // Callbacks Data
        onRetryCallback: null,
        onMenuCallback: null,

        // Data
        _shouldDisplayLevel: false,
        _modeKey: null,

////////////////////
// Initialization //
////////////////////

        ctor: function(modeKey, shouldDisplayLevel) {
            this._super();

            // mode key is used to retrieve high score data
            this._modeKey = modeKey;
            this._shouldDisplayLevel = shouldDisplayLevel;

            // init background
            var backgroundColor = NJ.themes.backgroundColor;
            this.init(backgroundColor);

            this._initHeaderUI();
            this._initStatsUI();
            this._initToolUI();

            this.enter();
        },

        _initHeaderUI: function() {
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height
            });

            var headerLabel = this.generateLabel("Scores (" + NJ.modeNames[this._modeKey] + ")", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2
            });

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initStatsUI: function() {
            var key = this._modeKey;
            var shouldDisplayLevel = this._shouldDisplayLevel;

            var columnCount = shouldDisplayLevel ? 2 : 1;

            this._statsMenu = new cc.Menu();

            this._statsMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._statsMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._statsMenu.getContentSize().width
            });

            // compute label size
            var header2Size = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2);
            var largeSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large);

            var scoreTitleLabel = this.generateLabel("Score", header2Size);
            this._scoreLabel = this.generateLabel(NJ.gameState.getScore(), largeSize, NJ.themes.specialLabelColor);

            var bestTitleLabel = this.generateLabel("Best", header2Size);
            this._bestLabel = this.generateLabel(NJ.stats.getHighscore(key), largeSize, NJ.themes.specialLabelColor);

            this._statsMenu.addChild(scoreTitleLabel);
            this._statsMenu.addChild(this._scoreLabel);
            this._statsMenu.addChild(bestTitleLabel);
            this._statsMenu.addChild(this._bestLabel);

            //var currencyTitleLabel = this.generateLabel("Currency");
            //this._currencyLabel = this.generateLabel(NJ.prettifier.formatNumber(NJ.stats.getCurrency()) + "", NJ.fontSizes.header2);

            //this._menu.addChild(currencyTitleLabel);
            //this._menu.addChild(this._currencyLabel);

            this._statsMenu.alignItemsVerticallyWithPadding(10);
            this.addChild(this._statsMenu, 100);
        },

        _initToolUI: function() {

            this._toolMenu = new cc.Menu();
            this._toolMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar));
            var toolSize = this._toolMenu.getContentSize();
            this._toolMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.bottom.y - toolSize.height / 2
            });

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var retryButton = new NJMenuButton(buttonSize, onRetry.bind(this), this);
            retryButton.setImageRes(res.retryImage);
            retryButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menuButton = new NJMenuButton(buttonSize, onMenu.bind(this), this);
            menuButton.setImageRes(res.homeImage);
            menuButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(retryButton);
            this._toolMenu.addChild(menuButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var statsSize = this._statsMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - statsSize.width, cc.visibleRect.center.y)).easing(easing));

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                if(callback)
                    callback();
            })));
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

        generateLabel: function(title, size, color) {
            var toggleItem = new NJMenuItem(size);
            toggleItem.setLabelTitle(title);
            toggleItem.setLabelColor(color || NJ.themes.defaultLabelColor);
            return toggleItem;
        }
    });
}());