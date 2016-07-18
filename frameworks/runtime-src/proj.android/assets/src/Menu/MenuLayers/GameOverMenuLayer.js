/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = (function() {

    var highscoreMessages = [
        "You really did it.",
        "Are we there yet?"
    ];

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

    var onShare = function() {
        NJ.audio.playSound(res.clickSound);

        NJ.shareScreen();
    };

    var onShop = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        this.leave(function() {
            that._shopMenuLayer = new ShopMenuLayer(true);
            that._shopMenuLayer.setOnCloseCallback(function() {
                cc.eventManager.resumeTarget(that, true);
                that.removeChild(that._shopMenuLayer);

                that.enter();

                that._howManyBubblesLabel.setLabelTitle(NJ.stats.getCurrency());

                that._updateTheme();
            });

            that.addChild(that._shopMenuLayer, 999);
        });
    };

    var _onLeaderboard = function() {
        NJ.audio.playSound(res.clickSound);

        NJ.social.showLeaderboard();
    };

    var _onAchievements = function() {
        NJ.audio.playSound(res.clickSound);

        NJ.social.showAchievements();
    };

    return BaseMenuLayer.extend({

        // UI Data
        _statsMenu: null,
        _shopMenu: null,
        _promoMenu: null,

        _scoreLabel: null,
        _bestLabel: null,
        _currencyLabel: null,
        _howManyBubblesLabel: null,

        _promoButton: null,

        // Callbacks Data
        onRetryCallback: null,
        onMenuCallback: null,

        // Data
        _isHighscore: false,
        _modeKey: null,

////////////////////
// Initialization //
////////////////////

        ctor: function(modeKey, isHighscore) {
            // mode key is used to retrieve high score data
            this._modeKey = modeKey;
            this._isHighscore = isHighscore;

            this._super();

            // this order must be exact as each menu calculates its geometry in order based on the previous menu
            this._initStatsUI();
            this._initShopUI();
            this._initPromoUI();
        },

        _initHeaderUI: function() {
            this._super();

            var headerLabel = this.generateLabel(NJ.modeNames[this._modeKey].toUpperCase(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            switch(this._modeKey) {
                case NJ.modekeys.minuteMadness:
                    headerLabel.setLabelColor(NJ.themes.blockColors[0]);
                    break;
                case NJ.modekeys.moves:
                    headerLabel.setLabelColor(NJ.themes.blockColors[1]);
                    break;
                case NJ.modekeys.react:
                    headerLabel.setLabelColor(NJ.themes.blockColors[2]);
                    break;
                case NJ.modekeys.infinite:
                    headerLabel.setLabelColor(NJ.themes.blockColors[3]);
                    break;
            }
            headerLabel.setTag(1000);

            this._headerMenu.addChild(headerLabel);
        },

        _initStatsUI: function() {
            var key = this._modeKey;

            this._statsMenu = new cc.Menu();

            this._statsMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - (!NJ.settings.hasInteractedReview ? NJ.uiSizes.promoArea : 0) - NJ.uiSizes.shopArea - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            var statsSize = this._statsMenu.getContentSize();

            this._statsMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x - statsSize.width,
                y: cc.visibleRect.top.y - this._headerMenu.getContentSize().height - statsSize.height / 2
            });

            // compute label size
            var header2Size = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2);
            var largeSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large);
            var headerSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header);
            var subSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub);

            var bestTitleLabel, scoreTitleLabel;

            if(this._isHighscore) {
                scoreTitleLabel = this.generateLabel("HIGH SCORE!", header2Size);
                this._scoreLabel = this.generateLabel(NJ.gameState.getScore(), largeSize, NJ.themes.specialLabelColor);

                bestTitleLabel = this.generateLabel(highscoreMessages[Math.floor(Math.random() * highscoreMessages.length)], subSize);

                this._statsMenu.addChild(scoreTitleLabel);
                this._statsMenu.addChild(this._scoreLabel);

                this._statsMenu.addChild(bestTitleLabel);

                this._statsMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.0025));
            } else {
                scoreTitleLabel = this.generateLabel("Score", header2Size);
                this._scoreLabel = this.generateLabel(NJ.gameState.getScore(), largeSize, NJ.themes.specialLabelColor);

                var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

                var divider = new NumboMenuItem(cc.size(dividerHeight, this._statsMenu.getContentSize().height * 0.8));
                divider.setTag(444);
                divider.setBackgroundImage(res.alertImage);
                divider.setBackgroundColor(NJ.themes.dividerColor);
                divider.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });

                bestTitleLabel = this.generateLabel("Best", header2Size);
                this._bestLabel = this.generateLabel(NJ.stats.getHighscore(key), largeSize, NJ.themes.specialLabelColor);

                var combinedHeight = bestTitleLabel.getContentSize().height + this._bestLabel.getContentSize().height;
                var combinedOriginY = combinedHeight / 2;
                //bestTitleLabel.setPositionY(this._statsMenu.getContentSize().height / 2 combinedHeight / 2);

                var scoreX = -cc.visibleRect.width / 4;

                scoreTitleLabel.setPosition(cc.p(scoreX, combinedOriginY - scoreTitleLabel.getContentSize().height / 2));
                this._scoreLabel.setPosition(cc.p(scoreX, scoreTitleLabel.getPositionY() - scoreTitleLabel.getContentSize().height / 2 - this._bestLabel.getContentSize().height / 2));

                scoreX += cc.visibleRect.width / 2;

                bestTitleLabel.setPosition(cc.p(scoreX, combinedOriginY - bestTitleLabel.getContentSize().height / 2));
                this._bestLabel.setPosition(cc.p(scoreX, this._scoreLabel.getPositionY()));

                this._statsMenu.addChild(scoreTitleLabel);
                this._statsMenu.addChild(this._scoreLabel);

                this._statsMenu.addChild(divider);

                this._statsMenu.addChild(bestTitleLabel);
                this._statsMenu.addChild(this._bestLabel);
            }

            this.addChild(this._statsMenu, 100);
        },

        _initShopUI: function() {
            this._shopMenu = new cc.Menu();
            this._shopMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.shopArea));
            var shopSize = this._shopMenu.getContentSize();
            this._shopMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x + shopSize.width,
                y: cc.visibleRect.top.y - this._headerMenu.getContentSize().height - this._statsMenu.getContentSize().height - shopSize.height / 2
            });

            var bubblesLabel = this.generateLabel("Bubbles", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._howManyBubblesLabel = this.generateLabel(NJ.stats.getCurrency(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header), NJ.themes.specialLabelColor);

            this._shopMenu.addChild(bubblesLabel);
            this._shopMenu.addChild(this._howManyBubblesLabel);

            this._shopMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.0025));

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

            var divider = new NumboMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.dividerColor);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: this._shopMenu.getContentSize().height / 2
            });

            this._shopMenu.addChild(divider);

            this.addChild(this._shopMenu, 100);
        },

        _initPromoUI: function() {
            if(NJ.settings.hasInteractedReview)
                return;

            this._promoMenu = new cc.Menu();
            this._promoMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.promoArea));
            var promoSize = this._promoMenu.getContentSize();
            this._promoMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x + promoSize.width,
                y: cc.visibleRect.top.y - this._headerMenu.getContentSize().height - this._statsMenu.getContentSize().height - this._shopMenu.getContentSize().height - promoSize.height / 2
            });

            var promoLabel = this.generateLabel("Review Numbo Jumbo", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            var buttonSize = cc.size(promoSize.height / 2.5, promoSize.height / 2.5);

            this._promoButton = new NumboMenuButton(buttonSize, function() {
                NJ.settings.hasInteractedReview = true;

                NJ.audio.playSound(res.clickSound);
                NJ.openAppDetails();
            }, this);
            this._promoButton.setBackgroundColor(NJ.themes.blockColors[1]);
            this._promoButton.setImageRes(res.rateImage);
            this._promoButton.runActionOnChildren(cc.sequence(cc.scaleBy(0.5, 1.25, 1.25).easing(cc.easeQuadraticActionInOut()), cc.scaleBy(0.5, 0.8, 0.8).easing(cc.easeQuadraticActionInOut())).repeatForever());
            this._promoButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._promoMenu.addChild(promoLabel);
            this._promoMenu.addChild(this._promoButton);

            this._promoMenu.alignItemsVerticallyWithPadding(10);

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

            var divider = this._generateSupportDivider();
            divider.setPositionY(this._promoMenu.getContentSize().height / 2);
            this._promoMenu.addChild(divider);

            this.addChild(this._promoMenu, 100);
        },

        _initToolUI: function() {

            this._super();

            var that = this;

            var toolSize = this._toolMenu.getContentSize();

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var retryButton = new NumboMenuButton(buttonSize, onRetry.bind(this), this);
            retryButton.setImageRes(res.retryImage);

            var menuButton = new NumboMenuButton(buttonSize, function() {
                that._onBack();
            }, this);
            menuButton.setImageRes(res.homeImage);

            var shopButton = new NumboMenuButton(buttonSize, onShop.bind(this), this);
            shopButton.setImageRes(res.shopImage);

            var shareButton = new NumboMenuButton(buttonSize, onShare.bind(this), this);
            shareButton.setImageRes(res.shareImage);

            var leaderboardButton = new NumboMenuButton(buttonSize, _onLeaderboard.bind(this), this);
            leaderboardButton.setImageRes(res.statsImage);

            var achievementsButton = new NumboMenuButton(buttonSize, _onAchievements.bind(this), this);
            achievementsButton.setImageRes(res.trophyImage);

            this._toolMenu.addChild(shareButton);
            this._toolMenu.addChild(retryButton);
            this._toolMenu.addChild(menuButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));
        },

        // makes menu elements transition in
        enter: function() {
            this._super();

            var easing = cc.easeBackOut();

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._statsMenu.getPositionY())).easing(easing));

            this._shopMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._shopMenu.getPositionY())).easing(easing));

            if(this._promoMenu)
                this._promoMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._promoMenu.getPositionY())).easing(easing));
        },

        // transition out
        leave: function(callback) {
            this._super(callback);

            var statsSize = this._statsMenu.getContentSize();
            var shopSize = this._shopMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - statsSize.width, this._statsMenu.getPositionY())).easing(easing));

            this._shopMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - shopSize.width, this._shopMenu.getPositionY())).easing(easing));

            if(this._promoMenu)
                this._promoMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x + this._promoMenu.getContentSize().width, this._promoMenu.getPositionY())).easing(easing));
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

        ///////////////
        // UI Events //
        ///////////////

        _onBack: function() {
            this._super();

            NJ.audio.playSound(res.clickSound);

            var that = this;

            this.leave(function() {
                if(that.onMenuCallback)
                    that.onMenuCallback();
            });
        },

////////////////
// UI Helpers //
////////////////

        _updateTheme: function() {
            this._super();

            if(this._promoButton)
                this._promoButton.setBackgroundColor(NJ.themes.blockColors[1]);

            if(this._scoreLabel)
                this._scoreLabel.setLabelColor(NJ.themes.specialLabelColor);

            if(this._bestLabel)
                this._bestLabel.setLabelColor(NJ.themes.specialLabelColor);

            if(this._howManyBubblesLabel)
                this._howManyBubblesLabel.setLabelColor(NJ.themes.specialLabelColor);
        }
    });
}());