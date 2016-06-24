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

    var onMenu = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        this.leave(function() {
            if(that.onMenuCallback)
                that.onMenuCallback();
        });
    };

    var onShare = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;
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

                that._updateTheme();
            });

            that.addChild(that._shopMenuLayer, 999);
        });
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _statsMenu: null,
        _shopMenu: null,
        _promoMenu: null,
        _toolMenu: null,

        _scoreLabel: null,
        _bestLabel: null,
        _currencyLabel: null,

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
            this._super();

            // mode key is used to retrieve high score data
            this._modeKey = modeKey;
            this._isHighscore = isHighscore;

            // init background
            var backgroundColor = NJ.themes.backgroundColor;
            this.init(backgroundColor);

            // this order must be exact as each menu calculates its geometry in order based on the previous menu
            this._initHeaderUI();
            this._initStatsUI();
            this._initShopUI();
            this._initPromoUI();
            this._initToolUI();

            this._generateBaseDividers();

            this._initInput();

            this.enter();
        },

        _initInput: function() {
            var that = this;

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function(key, event) {
                    if(key == cc.KEY.back) {
                        (onMenu.bind(that))();
                    }
                }
            }, this);
        },

        _initHeaderUI: function() {
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var headerLabel = this.generateLabel(NJ.modeNames[this._modeKey].toUpperCase(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initStatsUI: function() {
            var key = this._modeKey;

            this._statsMenu = new cc.Menu();

            this._statsMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - (!NJ.settings.hasInteractedReview ? NJ.uiSizes.promoArea : 0) - NJ.uiSizes.toolbar) * cc.visibleRect.height));

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

            var bestTitleLabel, scoreTitleLabel;

            if(this._isHighscore) {
                scoreTitleLabel = this.generateLabel("HIGH SCORE", headerSize);
                this._scoreLabel = this.generateLabel(NJ.gameState.getScore(), largeSize, NJ.themes.specialLabelColor);

                bestTitleLabel = this.generateLabel(highscoreMessages[Math.floor(Math.random() * highscoreMessages.length)], header2Size);

                this._statsMenu.addChild(scoreTitleLabel);
                this._statsMenu.addChild(this._scoreLabel);

                this._statsMenu.addChild(bestTitleLabel);

                this._statsMenu.alignItemsVerticallyWithPadding(10);
            } else {
                scoreTitleLabel = this.generateLabel("Score", header2Size);
                this._scoreLabel = this.generateLabel(NJ.gameState.getScore(), largeSize, NJ.themes.specialLabelColor);

                var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

                var divider = new NJMenuItem(cc.size(dividerHeight, this._statsMenu.getContentSize().height * 0.8));
                divider.setTag(444);
                divider.setBackgroundImage(res.alertImage);
                divider.setBackgroundColor(NJ.themes.defaultLabelColor);
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

                //this._statsMenu.alignItemsInRows(2, 2);
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

            var howManyBubblesLabel = this.generateLabel(NJ.stats.getCurrency(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            this._shopMenu.addChild(bubblesLabel);
            this._shopMenu.addChild(howManyBubblesLabel);

            this._shopMenu.alignItemsVerticallyWithPadding(10);

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.defaultLabelColor);
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

            this._promoButton = new NJMenuButton(buttonSize, function() {
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

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.defaultLabelColor);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: this._promoMenu.getContentSize().height / 2
            });

            this._promoMenu.addChild(divider);

            this.addChild(this._promoMenu, 100);
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

            var shopButton = new NJMenuButton(buttonSize, onShop.bind(this), this);
            shopButton.setImageRes(res.shopImage);
            shopButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var shareButton = new NJMenuButton(buttonSize, onShare.bind(this), this);
            shareButton.setImageRes(res.homeImage);
            shareButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(menuButton);
            this._toolMenu.addChild(retryButton);
            this._toolMenu.addChild(shopButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.02));

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._statsMenu.getPositionY())).easing(easing));

            if(this._promoMenu)
                this._promoMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._promoMenu.getPositionY())).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var statsSize = this._statsMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._statsMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - statsSize.width, this._statsMenu.getPositionY())).easing(easing));

            if(this._promoMenu)
                this._promoMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x + this._promoMenu.getContentSize().width, this._promoMenu.getPositionY())).easing(easing));

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

        // generate dividers on headers and toolbars
        _generateBaseDividers: function() {
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var headerDivider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            headerDivider.setTag(444);
            headerDivider.setBackgroundImage(res.alertImage);
            headerDivider.setBackgroundColor(NJ.themes.defaultLabelColor);
            headerDivider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2 + dividerHeight
            });
            this._headerMenu.addChild(headerDivider);

            var toolDivider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            toolDivider.setTag(444);
            toolDivider.setBackgroundImage(res.alertImage);
            toolDivider.setBackgroundColor(NJ.themes.defaultLabelColor);
            toolDivider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: this._toolMenu.getContentSize().height / 2 - dividerHeight
            });
            this._toolMenu.addChild(toolDivider);
        },

        generateLabel: function(title, size, color) {
            var toggleItem = new NJMenuItem(size);
            toggleItem.setLabelTitle(title);
            toggleItem.setLabelColor(color || NJ.themes.defaultLabelColor);
            return toggleItem;
        },

        _updateTheme: function() {
            this.setColor(NJ.themes.backgroundColor);

            var i;

            var children = this.getChildren();

            for(i = 0; i < children.length; i++) {
                if(children[i].mType && children[i].mType == "NJMenuItem")
                    children[i].updateTheme();
                else {
                    var childrenChildrenStack = [children[i].getChildren()];

                    while(childrenChildrenStack.length > 0) {
                        var childrenChildren = childrenChildrenStack.pop();

                        for(var j = 0; j < childrenChildren.length; ++j) {
                            if(childrenChildren[j] && childrenChildren[j].getTag() != 666 && childrenChildren[j].mType && childrenChildren[j].mType == "NJMenuItem") {
                                childrenChildren[j].updateTheme();

                                if(childrenChildren[j].getTag() == 444)
                                    childrenChildren[j].setBackgroundColor(NJ.themes.defaultLabelColor);

                            } else if(childrenChildren[j])
                                childrenChildrenStack.push(childrenChildren[j].getChildren());
                        }
                    }
                }
            }

            if(this._promoButton)
                this._promoButton.setBackgroundColor(NJ.themes.blockColors[1]);

            if(this._scoreLabel)
                this._scoreLabel.setLabelColor(NJ.themes.specialLabelColor);

            if(this._bestLabel)
                this._bestLabel.setLabelColor(NJ.themes.specialLabelColor);
        }
    });
}());