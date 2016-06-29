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

    var onBuyBubbles = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        if(cc.sys.isNative) {
            NJ.purchases.buy(NJ.purchases.itemKeys.coin1, function (product, error) {
                _logCount++;

                if (!error) {
                    that.devModeLog("Log " + _logCount + ": Success = " + product);
                    NJ.stats.addCurrency(25000);
                    that.updateCurrencyLabel();
                    NJ.stats.save();
                } else {
                    that.devModeLog("Log " + _logCount + ": Failure = " + product + " : " + error);
                }
            });
        } else {
            NJ.stats.addCurrency(25000);
            that.updateCurrencyLabel();
            NJ.stats.save();
        }
    };

    var onBuyDoubler = function() {
        NJ.audio.playSound(res.coinSound);

        if(NJ.stats.isDoubleEnabled())
            return;

        var that = this;

        if(cc.sys.isNative) {
            NJ.purchases.buy(NJ.purchases.itemKeys.doubler, function (product, error) {
                _logCount++;

                if (!error) {
                    that.devModeLog("Log " + _logCount + ": Success = " + product);
                    NJ.stats.enableDoubler();
                    NJ.stats.save();
                    that._enableDoubler();
                } else {
                    that.devModeLog("Log " + _logCount + ": Failure = " + product + " : " + error);
                }
            });
        } else {
            NJ.stats.enableDoubler();
            NJ.stats.save();
            that._enableDoubler();
        }
    };

    var onActivateTheme = function(index) {
        NJ.audio.playSound(res.coinSound);

        if(NJ.themes.getThemeIndex() == index)
            return;

        var that = this;

        var theme = NJ.themes.getThemeByIndex(index);

        if(theme.isPurchased) {
            NJ.themes.setThemeByIndex(index);
            NJ.saveThemes();
            that._updateTheme();
        } else {
            if(NJ.stats.getCurrency() >= theme.themeCost) {
                NJ.stats.addCurrency(-theme.themeCost);
                that.updateCurrencyLabel();
                NJ.stats.save();
                NJ.themes.purchaseThemeByIndex(index);
                NJ.themes.setThemeByIndex(index);
                NJ.saveThemes();
                that._updateTheme();
            } else {
                that.devModeLog("Log " + _logCount + ": Insufficient funds for purchase");
            }
        }
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _toolMenu: null,

        // shop UI Data
        _contentScrollView: null,

        _bubblesMenu: null,
        _themesMenu: null,
        _doublerMenu: null,

        _popoverMenu: null,

        _themeButtons: [],

        _currencyLabel: null,
        _currencyInfoLabel: null,

        _doublerInfoLabel: null,

        // Callbacks Data
        onCloseCallback: null,

        // number of times to open developer mode for shop
        _devCount: 0,

////////////////////
// Initialization //
////////////////////

        ctor: function(shouldShowBackButton) {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this._initInput();

            this._initHeaderUI();
            this._initContentUI();
            this._initBubblesUI();
            this._initThemesUI();
            this._initDoublerUI();
            this._initToolUI(shouldShowBackButton);

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

            this._headerMenu = new ccui.Layout();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var headerSize = this._headerMenu.getContentSize();

            var background = new cc.Sprite(res.alertImage);
            background.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: headerSize.width / 2,
                y: headerSize.height / 2
            });
            var backgroundSize = background.getContentSize();
            background.setColor(NJ.themes.backgroundColor);
            background.setScale(headerSize.width / backgroundSize.width, headerSize.height / backgroundSize.height);
            background.setTag(333);
            this._headerMenu.addChild(background);

            var headerLabel = this.generateLabel("SHOP", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: headerSize.width / 2,
                y: headerSize.height / 2
            });

            this._headerMenu.addChild(headerLabel);

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = this._generateHorizontalDivider();
            divider.setPosition(cc.visibleRect.width / 2, dividerHeight / 2);
            this._headerMenu.addChild(divider);

            this.addChild(this._headerMenu, 100);
        },

        _initContentUI: function() {
            var that = this;

            this._contentScrollView = new ccui.ScrollView();
            this._contentScrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this._contentScrollView.setTouchEnabled(true);
            this._contentScrollView.setBounceEnabled(true);
            this._contentScrollView.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (1 - NJ.uiSizes.header - NJ.uiSizes.toolbar)));
            this._contentScrollView.setInnerContainerSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (NJ.uiSizes.bubblesArea + NJ.uiSizes.themesArea + NJ.uiSizes.doublerArea)));
            this._contentScrollView.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y - cc.visibleRect.height
            });

            this.addChild(this._contentScrollView);
        },

        _initBubblesUI: function() {
            this._bubblesMenu = new ccui.Layout();
            this._bubblesMenu.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            this._bubblesMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.bubblesArea * cc.visibleRect.height));

            this._bubblesMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._contentScrollView.innerHeight - (cc.visibleRect.height * NJ.uiSizes.bubblesArea) / 2
            });

            var bubbleSize = this._bubblesMenu.getContentSize();

            // generate music toggle
            this._currencyLabel = this.generateLabel("Bubbles: " + NJ.stats.getCurrency(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var currencyLayout = new ccui.LinearLayoutParameter();
            var currencyMargin = new ccui.Margin(0, -this._currencyLabel.getContentSize().height / 2, 0, -this._currencyLabel.getContentSize().height / 2);
            currencyLayout.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
            currencyLayout.setMargin(currencyMargin);
            this._currencyLabel.setLayoutParameter(currencyLayout);
            this._currencyLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            var coinSize = cc.size(NJ.calculateScreenDimensionFromRatio(0.12), NJ.calculateScreenDimensionFromRatio(0.12));

            var buyCoinsButton = new ccui.Button(res.blockImage, res.blockImage, res.blockImage);//new NJMenuButton(cc.size(coinSize.height, coinSize.height), onBuyBubbles.bind(this), this);
            buyCoinsButton.setColor(NJ.themes.defaultButtonColor);
            buyCoinsButton.setScale(coinSize.width / buyCoinsButton.getContentSize().width, coinSize.height / buyCoinsButton.getContentSize().height);
            buyCoinsButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            var buttonLayout = new ccui.LinearLayoutParameter();
            var buttonMargin = new ccui.Margin(0, -coinSize.height / 2, 0, -coinSize.height / 2);
            buttonLayout.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
            buttonLayout.setMargin(buttonMargin);
            buyCoinsButton.setLayoutParameter(buttonLayout);
            //buyCoinsButton.setImageRes(res.plusImage);
            //buyCoinsButton.offsetLabel(cc.p(coinSize.height * 1.5, 0));

            // generate sounds toggle
            var coinProduct = NJ.purchases.getProductByName("coin1");
            this._currencyInfoLabel = this.generateLabel("25000 Bubbles - " + (coinProduct ? coinProduct.price : "?"), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            var infoLayout = new ccui.LinearLayoutParameter();
            var infoMargin = new ccui.Margin(0, 0, 0, 0);
            infoLayout.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
            infoLayout.setMargin(infoMargin);
            this._currencyInfoLabel.setLayoutParameter(infoLayout);

            this._currencyInfoLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._bubblesMenu.addChild(this._currencyLabel);
            this._bubblesMenu.addChild(buyCoinsButton);
            this._bubblesMenu.addChild(this._currencyInfoLabel);

            var divider = this._generateHorizontalDivider();
            divider.setPosition(cc.visibleRect.width / 2, this._contentScrollView.innerHeight - this._bubblesMenu.getContentSize().height);
            this._contentScrollView.addChild(divider);

            this._contentScrollView.addChild(this._bubblesMenu);
        },

        _initThemesUI: function() {
            return;

            var that = this;

            this._themeMenu = new ccui.Layout();
            this._themeMenu.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            this._themeMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.themesArea * cc.visibleRect.height));

            this._themeMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._contentScrollView.innerHeight - (cc.visibleRect.height * (NJ.uiSizes.bubblesArea + NJ.uiSizes.themesArea / 2))
            });

            var titleLabel = this.generateLabel("THEMES", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            this._themeMenu.addChild(titleLabel);

            var themes = NJ.themes.getList();

            var buttonSize = cc.size(cc.visibleRect.width * 0.8, cc.visibleRect.height * 0.1);
            var themeButton;

            this._themeButtons = [];

            for(var i = 0; i < themes.length; ++i) {
                (function() {
                    var index = i;

                    var isCurrentTheme = (NJ.themes.getThemeIndex() == i);

                    var themeButtonLayout = new ccui.LinearLayoutParameter();

                    var themeButton = new ccui.Button(res.alertImage, res.alertImage, res.alertImage);
                    themeButton.setScale(buttonSize.width / themeButton.getContentSize().width, buttonSize.height / themeButton.getContentSize().height);
                    themeButton.setLayoutParameter(themeButtonLayout);
                    themeButton.setTag(666);
                    var labelStr = themes[i].themeName + " - ";
                    if(!themes[i].isPurchased) {
                        labelStr += themes[i].themeCost + " Bubbles";
                    } else {
                        labelStr += isCurrentTheme ? "Active" : "Owned";
                    }
                    //themeButton.setLabelTitle(labelStr);
                    //themeButton.setLabelColor(isCurrentTheme ? themes[i].blockColors[0] : themes[i].defaultLabelColor);
                    //themeButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
                    //themeButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
                    //themeButton.setBackgroundColor(themes[i].backgroundColor);
                    themeButton.attr({
                        anchorX: 0.5,
                        anchorY: 0.5
                    });

                    that._themeMenu.addChild(themeButton);
                    that._themeButtons.push(themeButton);
                })();
            }

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.defaultLabelColor);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._themeMenu.getContentSize().height / 2
            });
            this._themeMenu.addChild(divider);

            this._contentScrollView.addChild(this._themeMenu);
        },

        _initDoublerUI: function() {
            return;

            this._doublerMenu = new ccui.Layout();
            this._doublerMenu.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            this._doublerMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.doublerArea * cc.visibleRect.height));

            this._doublerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._contentScrollView.innerHeight - (cc.visibleRect.height * (NJ.uiSizes.bubblesArea + NJ.uiSizes.themesArea + NJ.uiSizes.doublerArea / 2))
            });

            this._doublerInfoLabel = this.generateLabel("Earning bubbles too slowly?\nBuy the Bubble Doubler for doubled bubble rate!", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            var buyDoublerButton = new NJMenuButton(cc.size(NJ.calculateScreenDimensionFromRatio(0.12), NJ.calculateScreenDimensionFromRatio(0.12)), onBuyDoubler.bind(this), this);
            buyDoublerButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            buyDoublerButton.setImageRes(res.skipImage);

            var product = NJ.purchases.getProductByName("doubler");
            var priceLabel = this.generateLabel("Bubble Doubler - " + (product ? product.price : "?"), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._doublerMenu.addChild(this._doublerInfoLabel);
            this._doublerMenu.addChild(buyDoublerButton);

            if(NJ.stats.isDoubleEnabled())
                this._enableDoubler();
            else {
                this._doublerMenu.addChild(priceLabel);
            }

            this._doublerMenu.alignItemsVerticallyWithPadding(10);

            this._contentScrollView.addChild(this._doublerMenu);
        },

        _initToolUI: function(shouldShowBackButton) {

            this._toolMenu = new ccui.Layout();
            this._toolMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar));
            var toolSize = this._toolMenu.getContentSize();
            this._toolMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.bottom.y - toolSize.height / 2
            });

            var background = new cc.Sprite(res.alertImage);
            var backgroundSize = background.getContentSize();
            background.setColor(NJ.themes.backgroundColor);
            background.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: toolSize.width / 2,
                y: toolSize.height / 2
            });
            background.setScale(toolSize.width / backgroundSize.width, toolSize.height / backgroundSize.height);
            background.setTag(333);
            this._toolMenu.addChild(background);

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(shouldShowBackButton ? res.backImage : res.homeImage);

            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width / 2,
                y: toolSize.height / 2
            });

            this._toolMenu.addChild(backButton);

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = this._generateHorizontalDivider();
            divider.setPosition(cc.visibleRect.width / 2, toolSize.height - dividerHeight / 2);
            this._toolMenu.addChild(divider);

            this.addChild(this._toolMenu, 100);
        },

        _initDevMode: function() {
            this._currencyInfoLabel.setLabelTitle("Super secret dev mode!");
        },

        devModeLog: function(logStr) {
            if(_devCount >= 7) {
                this._currencyInfoLabel.setLabelTitle(logStr);
            }
        },

        // makes menu elements transition in
        enter: function() {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(this._headerMenu.getPositionX(), cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(this._toolMenu.getPositionX(), cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentScrollView.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._bubblesMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentScrollView.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y - cc.visibleRect.height)).easing(easing));

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

        _enableDoubler: function() {
            this._doublerInfoLabel.setLabelTitle("Bubble Doubler enabled.\nTwice the rate of earning bubbles!");
        },

        updateCurrencyLabel: function() {
            this._currencyLabel.setLabelTitle("Bubbles: " + NJ.stats.getCurrency());
        },

        _generateHorizontalDivider: function() {
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = new cc.Sprite(res.alertImage);
            divider.setColor(NJ.themes.defaultLabelColor);
            var dividerSize = cc.size(cc.visibleRect.width * 0.8, dividerHeight);
            var imageSize = divider.getContentSize();
            divider.setScale(dividerSize.width / imageSize.width, dividerSize.height / imageSize.height);
            divider.setTag(444);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            return divider;
        },

        generateLabel: function(title, size) {
            if(typeof size === 'number') {
                size = cc.size(cc.visibleRect.width, size);
            }
            var scale = 1;

            if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large)) {
                scale = 3;
            } else if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2)) {
                scale = 2;
            }

            var normalLabel = new ccui.TextBMFont();
            normalLabel.setFntFile(b_getFontName(res.mainFont, scale));
            normalLabel.setString(title);
            var imageSize = normalLabel.getContentSize();
            cc.log(size);
            cc.log(imageSize);
            normalLabel.setScale(size.height / imageSize.height, size.height / imageSize.height);
            normalLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            normalLabel.setColor(NJ.themes.defaultLabelColor);

            return normalLabel;
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

                                if(childrenChildren[j].getTag() == 333)
                                    childrenChildren[j].setBackgroundColor(NJ.themes.backgroundColor);
                                else if(childrenChildren[j].getTag() == 444)
                                    childrenChildren[j].setBackgroundColor(NJ.themes.defaultLabelColor);

                            } else if(childrenChildren[j])
                                childrenChildrenStack.push(childrenChildren[j].getChildren());
                        }
                    }
                }
            }

            var themes = NJ.themes.getList();
            var themeButton;

            for(i = 0; i < themes.length; ++i) {
                var index = i;

                themeButton = this._themeButtons[i];

                var isCurrentTheme = (NJ.themes.getThemeIndex() == i);

                var labelStr = themes[i].themeName + " - ";
                if(!themes[i].isPurchased) {
                    labelStr += themes[i].themeCost + "";
                } else {
                    labelStr += isCurrentTheme ? "Active" : "Owned";
                }
                themeButton.setLabelTitle(labelStr);
                themeButton.setLabelColor(isCurrentTheme ? themes[i].blockColors[0] : themes[i].defaultLabelColor);
                themeButton.setBackgroundColor(themes[i].backgroundColor);
            }
        }
    });
}());