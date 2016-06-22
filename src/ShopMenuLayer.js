/**
 * Created by jonathanlu on 1/19/16.
 */

var ShopMenuLayer = (function() {

    var _devCount = 0;
    var _logCount = 0;

    ///////////////
    // UI Events //
    ///////////////

    var onBack = function() {
        NJ.audio.playSound(res.clickSound);

        // save any modified settings
        NJ.saveSettings();

        var that = this;

        this.leave(function() {
            if(that.onCloseCallback)
                that.onCloseCallback();
        });
    };

    var onBuyCoins = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        NJ.purchases.buy(NJ.purchases.itemKeys.coin1, function(product, error) {
            _logCount++;
            cc.log("Log " + _logCount + ": " + product + " : " + error);
            if(!error) {
                that.devModeLog("Log " + _logCount + ": Success = " + product);
            } else {
                that.devModeLog("Log " + _logCount + ": Failure = " + product + " : " + error);
            }
        });
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _toolMenu: null,

        // shop UI Data
        _contentScrollView: null,

        _contentMenu: null,
        _themesMenu: null,

        _coinsInfoLabel: null,

        // Geometry Data
        _dividersNode: null,

        // Callbacks Data
        onCloseCallback: null,

        // number of times to open developer mode for shop
        _devCount: 0,

////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this._initInput();

            this._initHeaderUI();
            this._initContentUI();
            this._initThemesUI();
            this._initToolUI();

            this.enter();
        },

        // Initialize input depending on the device.
        _initInput: function() {
            var that = this;

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function(key, event) {
                    if(key == cc.KEY.back) {
                        (onBack.bind(that))();
                    }
                }
            }, this);
        },

        _initHeaderUI: function() {
            var that = this;

            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height
            });

            var headerLabel = this.generateLabel("SHOP", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2
            });
            headerLabel.setEnabled(true);
            headerLabel.setCallback(function() {
                _devCount++;

                if(_devCount >= 7) {
                    that._initDevMode();
                }
            }, this);

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initContentUI: function() {
            var that = this;

            this._contentScrollView = new ccui.ScrollView();
            this._contentScrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this._contentScrollView.setTouchEnabled(true);
            this._contentScrollView.setBounceEnabled();
            this._contentScrollView.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (1 - NJ.uiSizes.header - NJ.uiSizes.toolbar)));
            this._contentScrollView.setInnerContainerSize(cc.size(cc.visibleRect.width, 1000));
            this._contentScrollView.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y
            });

            this.addChild(this._contentScrollView);

            var sprite = new cc.Sprite(res.blockImage);

            sprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: 500
            });

            this._contentScrollView.addChild(sprite);

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                NJ.uiSizes.pointsArea * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: 500
            });

            // generate music toggle
            var coinsLabel = this.generateLabel("Points: " + NJ.stats.getCurrency(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var coinSize = coinsLabel.getContentSize();

            var buyCoinsButton = new NJMenuButton(cc.size(coinSize.height, coinSize.height), onBuyCoins.bind(this), this);
            //buyCoinsButton.setLabelTitle("1000");
            //buyCoinsButton.setLabelColor(NJ.themes.defaultLabelColor);
            buyCoinsButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            buyCoinsButton.setImageRes(res.promoImage);
            //buyCoinsButton.offsetLabel(cc.p(coinSize.height * 1.5, 0));

            // generate sounds toggle
            this._coinsInfoLabel = this.generateLabel("Shop purchases are coming\nsoon. Stock up as many points as you can!", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._contentMenu.addChild(coinsLabel);
            this._contentMenu.addChild(buyCoinsButton);

            this._contentMenu.addChild(this._coinsInfoLabel);

            this._contentMenu.alignItemsVerticallyWithPadding(10);

            this._contentScrollView.addChild(this._contentMenu);
        },

        _initThemesUI: function() {
            var that = this;

            this._themeMenu = new cc.Menu();
            this._themeMenu.setContentSize(cc.size(cc.visibleRect.width,
                0.3 * 3 * cc.visibleRect.height));

            this._themeMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._themeMenu.getContentSize().width
            });

            var titleLabel = this.generateLabel("THEMES", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            this._themeMenu.addChild(titleLabel);

            var themes = NJ.themes.getList();

            var buttonSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * 0.3);
            var themeButton;

            for(var i = 0; i < themes.length; ++i) {
                themeButton = new NJMenuButton(buttonSize, onBuyCoins.bind(this), this);
                themeButton.setLabelTitle(themes[i].themeName);
                themeButton.setLabelColor(NJ.themes.defaultLabelColor);
                themeButton.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });
                //buyCoinsButton.setImageRes(res.promoImage);
                //buyCoinsButton.offsetLabel(cc.p(coinSize.height * 1.5, 0));

                this._themeMenu.addChild(themeButton);
            }

            this._themeMenu.alignItemsInColumns(1, 3);

            this.addChild(this._themeMenu);
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

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.homeImage);

            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(backButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        _initDevMode: function() {
            this._coinsInfoLabel.setLabelTitle("Super secret dev mode!");
        },

        devModeLog: function(logStr) {
            if(_devCount >= 7) {
                this._coinsInfoLabel.setLabelTitle(logStr);
            }
        },

        // makes menu elements transition in
        enter: function() {
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._contentMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.left.x, cc.visibleRect.left.y)).easing(easing));

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                if(callback)
                    callback();
            })));
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

        generateLabel: function(title, size) {
            var toggleItem = new NJMenuItem(size);
            toggleItem.setLabelTitle(title);
            toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
            return toggleItem;
        }
    });
}());