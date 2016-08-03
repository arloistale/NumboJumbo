/**
 * Created by jonathanlu on 1/19/16.
 */

var ShopMenuLayer = (function() {

    var _devCount = 0;
    var _logCount = 0;

    ///////////////
    // UI Events //
    ///////////////

    var onBuyDoubler = function() {
        NJ.audio.playSound(res.coinSound);

        if(NJ.stats.isDoubleEnabled())
            return;

        var that = this;

        if(cc.sys.isNative) {
            NJ.purchases.buy(NJ.purchases.itemIAPKeys.doubler, function (product, error) {
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

    var onBuyStoppers = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        const stopperPurchaseData = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.stopper);

        if(NJ.stats.getNumStoppers() + stopperPurchaseData.amount <= NJ.stats.MAX_NUM_STOPPERS) {
            if (NJ.stats.getCurrency() >= stopperPurchaseData.price) {
                NJ.stats.addCurrency(-stopperPurchaseData.price);
                NJ.stats.addStoppers(stopperPurchaseData.amount);
                that.updateCurrencyLabel();
                that.updateItems();
                NJ.stats.save();
            } else {
                that.devModeLog("Log " + _logCount + ": Insufficient funds for purchase");
            }
        }
    };

    var onBuyConverters = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        const converterPurchaseData = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.converter);

        if(NJ.stats.getNumConverters() + converterPurchaseData.amount <= NJ.stats.MAX_NUM_CONVERTERS) {
            if (NJ.stats.getCurrency() >= converterPurchaseData.price) {
                NJ.stats.addCurrency(-converterPurchaseData.price);
                NJ.stats.addConverters(converterPurchaseData.amount);
                that.updateCurrencyLabel();
                that.updateItems();
                NJ.stats.save();
            } else {
                that.devModeLog("Log " + _logCount + ": Insufficient funds for purchase");
            }
        }
    };

    var onBuyScramblers = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        const scramblersPurchaseData = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.scrambler);

        if(NJ.stats.getNumScramblers() + scramblersPurchaseData.amount <= NJ.stats.MAX_NUM_SCRAMBLERS) {
            if (NJ.stats.getCurrency() >= scramblersPurchaseData.price) {
                NJ.stats.addCurrency(-scramblersPurchaseData.price);
                NJ.stats.addScramblers(scramblersPurchaseData.amount);
                that.updateCurrencyLabel();
                that.updateItems();
                NJ.stats.save();
            } else {
                that.devModeLog("Log " + _logCount + ": Insufficient funds for purchase");
            }
        }
    };

    var onActivateTheme = function(index) {
        NJ.audio.playSound(res.coinSound);

        if(NJ.themes.getActiveThemeIndex() == index)
            return;

        var that = this;

        var theme = NJ.themes.getThemeByIndex(index);

        if(theme.isPurchased) {
            NJ.themes.activateThemeByIndex(index);
            NJ.themes.save();
            that._updateTheme();
        } else {
            if(NJ.stats.getCurrency() >= theme.themeCost) {
                NJ.stats.addCurrency(-theme.themeCost);
                that.updateCurrencyLabel();
                NJ.stats.save();
                NJ.themes.purchaseThemeByIndex(index);
                NJ.themes.activateThemeByIndex(index);
                NJ.themes.save();
                that._updateTheme();
            } else {
                that.devModeLog("Log " + _logCount + ": Insufficient funds for purchase");
            }
        }
    };

    return BaseMenuLayer.extend({

        // shop UI Data
        _contentScrollView: null,

        _bubblesMenu: null,
        _powerupsMenu: null,
        _themesMenu: null,
        _doublerMenu: null,

        _popoverMenu: null,

        _themeButtons: [],

        _buyScramblersButton: null,
        _buyConvertersButton: null,
        _buyStoppersButton: null,

        _currencyLabel: null,
        _currencyInfoLabel: null,

        _doublerInfoLabel: null,

        // Callbacks Data
        onCloseCallback: null,

        // Geometry Data
        _themesAreaSize: 0,
        _currentYPos: 0,

        // number of times to open developer mode for shop
        _devCount: 0,

/////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this._initContentUI();

            this._initPowerupsUI();
            this._initThemesUI();
            this._initBubblesUI();

            this.updateItems();
        },

        _initHeaderUI: function() {
            this._super();

            var headerLabel = this.generateLabel("SHOP", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));

            this._currencyLabel = this.generateLabel(NJ.stats.getCurrency() + " Bubbles", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._currencyLabel.setColor(NJ.themes.specialLabelColor);

            this._headerMenu.addChild(headerLabel);
            this._headerMenu.addChild(this._currencyLabel);

            this._headerMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.0025));

            var background = new NumboMenuItem(this._headerMenu.getContentSize());
            background.setTag(333);
            background.setBackgroundImage(res.alertImage);
            background.setBackgroundColor(NJ.themes.backgroundColor);

            this._headerMenu.addChild(background, -1);
        },

        _initContentUI: function() {
            var that = this;

            this._themesAreaSize = 0.18 + 0.20 * NJ.themes.getNumThemes();

            this._contentScrollView = new ccui.ScrollView();
            this._contentScrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this._contentScrollView.setScrollBarEnabled(false);
            this._contentScrollView.setTouchEnabled(true);
            this._contentScrollView.setBounceEnabled(true);
            this._contentScrollView.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (1 - NJ.uiSizes.header - NJ.uiSizes.toolbar)));
            this._contentScrollView.setInnerContainerSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (NJ.uiSizes.bubblesArea + NJ.uiSizes.powerupsArea + this._themesAreaSize)));
            this._contentScrollView.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y - cc.visibleRect.height
            });

            this._currentYPos = this._contentScrollView.innerHeight;

            this.addChild(this._contentScrollView, 0);
        },

        _initBubblesUI: function() {

            var that = this;

            this._bubblesMenu = new cc.Menu();
            this._bubblesMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.bubblesArea * cc.visibleRect.height));

            this._currentYPos -= cc.visibleRect.height * NJ.uiSizes.bubblesArea / 2;

            this._bubblesMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._currentYPos
            });

            this._currentYPos -= cc.visibleRect.height * NJ.uiSizes.bubblesArea / 2;

            this._doublerTitleLabel = this.generateLabel("BUBBLE DOUBLER", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            this._doublerInfoLabel = this.generateLabel("Earning bubbles too slowly?\nBuy the Bubble Doubler for doubled bubble rate!", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            var buyDoublerButton = new NumboMenuButton(cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton),
                NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton)), onBuyDoubler.bind(this), this);
            buyDoublerButton.setImageRes(res.skipImage);

            var product = NJ.purchases.getProductByName("doubler");
            var priceLabel = this.generateLabel("" + (product ? product.price : "?"), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._bubblesMenu.addChild(this._doublerTitleLabel);
            this._bubblesMenu.addChild(this._doublerInfoLabel);

            // only add the doubler button if we haven't purchased yet
            if(NJ.stats.isDoubleEnabled()) {
                this._enableDoubler();
            } else {
                this._bubblesMenu.addChild(buyDoublerButton);
                this._bubblesMenu.addChild(priceLabel);
            }

            this._bubblesMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.025));

            this._contentScrollView.addChild(this._bubblesMenu);
        },

        _initPowerupsUI: function() {
            this._powerupsMenu = new cc.Menu();
            this._powerupsMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.powerupsArea * cc.visibleRect.height));

            this._currentYPos -= cc.visibleRect.height * NJ.uiSizes.powerupsArea / 2;

            this._powerupsMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._currentYPos
            });

            this._currentYPos -= cc.visibleRect.height * NJ.uiSizes.powerupsArea / 2;

            // generate music toggle
            var powerupsLabel = this.generateLabel("POWER-UPS", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            // create a menu item container to store buttons and
            var coinSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton));
            var labelSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            var buttonContainer = new cc.MenuItem();
            buttonContainer.setContentSize(cc.visibleRect.width, coinSize.height + labelSize.height + NJ.calculateScreenDimensionFromRatio(0.025));
            buttonContainer.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var stopperItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.stopper);
            var converterItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.converter);
            var scramblerItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.scrambler);

            this._buyConvertersButton = new NumboMenuButton(cc.size(coinSize.height, coinSize.height), onBuyConverters.bind(this), this);
            this._buyConvertersButton.setBackgroundColor(NJ.themes.convertersColor);
            this._buyConvertersButton.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width / 4,
                y: buttonContainer.getContentSize().height / 2 + this._buyConvertersButton.getContentSize().height / 2
            });
            this._buyConvertersButton.setLabelTitle(NJ.stats.getNumConverters() + "");
            this._buyConvertersButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            this._buyConvertersButton.offsetLabel(cc.p(this._buyConvertersButton.getContentSize().width / 1.1, 0));
            this._buyConvertersButton.setImageRes(res.convertImage);

            var buyConvertersLabel = this.generateLabel(converterItem.amount + " " + converterItem.name + "\n" + converterItem.price, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            buyConvertersLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width / 4,
                y: buttonContainer.getContentSize().height / 2 - buyConvertersLabel.getContentSize().height / 2 - NJ.calculateScreenDimensionFromRatio(0.025)
            });

            this._buyStoppersButton = new NumboMenuButton(cc.size(coinSize.height, coinSize.height), onBuyStoppers.bind(this), this);
            this._buyStoppersButton.setBackgroundColor(NJ.themes.stoppersColor);
            this._buyStoppersButton.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width / 2,
                y: buttonContainer.getContentSize().height / 2 + this._buyStoppersButton.getContentSize().height / 2
            });
            this._buyStoppersButton.setLabelTitle(NJ.stats.getNumStoppers() + "");
            this._buyStoppersButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            this._buyStoppersButton.offsetLabel(cc.p(this._buyStoppersButton.getContentSize().width / 1.1, 0));
            this._buyStoppersButton.setImageRes(res.convertImage);

            var buyStoppersLabel = this.generateLabel(stopperItem.amount + " " + stopperItem.name + "\n" + stopperItem.price, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            buyStoppersLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width / 2,
                y: buttonContainer.getContentSize().height / 2 - buyConvertersLabel.getContentSize().height / 2 - NJ.calculateScreenDimensionFromRatio(0.025)
            });

            this._buyScramblersButton = new NumboMenuButton(cc.size(coinSize.height, coinSize.height), onBuyScramblers.bind(this), this);
            this._buyScramblersButton.setBackgroundColor(NJ.themes.scramblersColor);
            this._buyScramblersButton.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width * 0.75,
                y: buttonContainer.getContentSize().height / 2 + this._buyScramblersButton.getContentSize().height / 2
            });
            this._buyScramblersButton.setLabelTitle(NJ.stats.getNumScramblers() + "");
            this._buyScramblersButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            this._buyScramblersButton.offsetLabel(cc.p(this._buyScramblersButton.getContentSize().width / 1.1, 0));
            this._buyScramblersButton.setImageRes(res.scrambleImage);

            var buyScramblersLabel = this.generateLabel(scramblerItem.amount + " " + scramblerItem.name + "\n" + scramblerItem.price, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            buyScramblersLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.width * 0.75,
                y: buttonContainer.getContentSize().height / 2 - buyScramblersLabel.getContentSize().height / 2 - NJ.calculateScreenDimensionFromRatio(0.025)
            });

            buttonContainer.addChild(this._buyStoppersButton);
            buttonContainer.addChild(buyStoppersLabel);

            buttonContainer.addChild(this._buyConvertersButton);
            buttonContainer.addChild(buyConvertersLabel);

            buttonContainer.addChild(this._buyScramblersButton);
            buttonContainer.addChild(buyScramblersLabel);

            this._powerupsMenu.addChild(powerupsLabel);
            this._powerupsMenu.addChild(buttonContainer);

            this._powerupsMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.025));

            var divider = this._generateSupportDivider();
            divider.setPositionY(-this._powerupsMenu.getContentSize().height / 2);
            this._powerupsMenu.addChild(divider);

            this._contentScrollView.addChild(this._powerupsMenu);
        },

        _initThemesUI: function() {
            var that = this;

            this._themeMenu = new cc.Menu();
            this._themeMenu.setContentSize(cc.size(cc.visibleRect.width, this._themesAreaSize * cc.visibleRect.height));

            this._currentYPos -= cc.visibleRect.height * this._themesAreaSize * 0.48 ;

            this._themeMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._currentYPos
            });

            this._currentYPos -= cc.visibleRect.height * this._themesAreaSize / 2;

            // initialize themes title

            var titleLabel = this.generateLabel("THEMES", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            titleLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._themeMenu.addChild(titleLabel);

            // get color themes sorted by price
            var themes = NJ.themes.getListSortedByCost();

            var buttonSize = cc.size(cc.visibleRect.width * 0.8, cc.visibleRect.height * 0.1);
            var blockSize = cc.size(buttonSize.height * 0.5, buttonSize.height * 0.5);
            var themeButton;

            const numbersToShow = [1, 2, 3, 6];

            this._themeButtons = [];

            for(var i = 0; i < themes.length; ++i) {
                (function() {
                    var index = themes[i].index;

                    var isCurrentTheme = (NJ.themes.getActiveThemeIndex() == index);

                    themeButton = new NumboMenuButton(buttonSize, function() {
                        (onActivateTheme.bind(that))(index);
                    }, that);
                    themeButton.setTag(666);
                    var labelStr = themes[i].themeName + " - ";
                    if(!themes[i].isPurchased) {
                        labelStr += themes[i].themeCost + "";
                    } else {
                        labelStr += isCurrentTheme ? "Active" : "Owned";
                    }
                    themeButton.setLabelTitle(labelStr);
                    themeButton.setLabelColor(isCurrentTheme ? themes[i].blockColors[0] : NJ.themes.defaultLabelColor);
                    themeButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
                    themeButton.offsetLabel(cc.p(0, -buttonSize.height / 1.25));
                    themeButton.setBackgroundImage(res.alertImage);
                    themeButton.setBackgroundColor(themes[i].backgroundColor);
                    themeButton.attr({
                        anchorX: 0.5,
                        anchorY: 0.5
                    });

                    // add block color samples

                    var numberMenu = new cc.Menu();
                    numberMenu.setContentSize(buttonSize);
                    numberMenu.attr({
                        anchorX: 0.5,
                        anchorY: 0.5,
                        x: buttonSize.width / 2,
                        y: buttonSize.height / 2
                    });

                    var currNumber;
                    var numberItem;

                    for(var j = 0; j < numbersToShow.length; ++j) {
                        currNumber = numbersToShow[j];

                        numberItem = new NumboMenuItem(blockSize);
                        numberItem.setTag(666);
                        numberItem.setBackgroundImage(res.blockImage);
                        numberItem.setBackgroundColor(themes[i].blockColors[currNumber - 1]);
                        numberItem.setLabelTitle(currNumber + (currNumber != 1 ? "" : " "));
                        numberItem.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
                        numberItem.setLabelColor(cc.color("#ffffff"));
                        numberItem.attr({
                            anchorX: 0.5,
                            anchorY: 0.5
                        });
                        numberMenu.addChild(numberItem);
                    }

                    numberMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.05));

                    themeButton.addChild(numberMenu);

                    that._themeMenu.addChild(themeButton);
                    that._themeButtons.push(themeButton);
                })();
            }

            this._themeMenu.alignItemsVerticallyWithPadding(cc.visibleRect.height * 0.1);

            var divider = this._generateSupportDivider();
            divider.setPositionY(-this._themeMenu.getContentSize().height / 2);
            this._themeMenu.addChild(divider);

            this._contentScrollView.addChild(this._themeMenu);
        },

        _initToolUI: function() {
            this._super();

            var that = this;

            var toolSize = this._toolMenu.getContentSize();

            var background = new NumboMenuItem(this._toolMenu.getContentSize());
            background.setTag(333);
            background.setBackgroundImage(res.alertImage);
            background.setBackgroundColor(NJ.themes.backgroundColor);
            this._toolMenu.addChild(background);

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var backButton = new NumboMenuButton(buttonSize, function() {
                that._onBack();
            }, this);
            backButton.setImageRes(res.homeImage);

            this._toolMenu.addChild(backButton);
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
            this._super();

            var easing = cc.easeBackOut();

            this._contentScrollView.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            this._super(callback);

            var easing = cc.easeBackOut();

            this._contentScrollView.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y - cc.visibleRect.height)).easing(easing));
        },

        ///////////////
        // UI Events //
        ///////////////

        _onBack: function() {
            NJ.audio.playSound(res.clickSound);

            // save any modified settings
            NJ.saveSettings();

            var that = this;

            this.leave(function() {
                if(that.onCloseCallback)
                    that.onCloseCallback();
            });
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
            this._doublerInfoLabel.setLabelTitle("Nice, Bubble Doubler enabled!\nTwice the rate of earning bubbles.");
        },

        updateCurrencyLabel: function() {
            this._currencyLabel.setLabelTitle(NJ.stats.getCurrency() + " Bubbles");
        },

        updateItems: function() {
            this._buyStoppersButton.setLabelTitle(NJ.stats.getNumStoppers() + "");
            this._buyScramblersButton.setLabelTitle(NJ.stats.getNumScramblers() + "");
            this._buyConvertersButton.setLabelTitle(NJ.stats.getNumConverters() + "");

            var currency = NJ.stats.getCurrency();

            var stoppersItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.stopper);
            var convertersItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.converter);
            var scramblersItem = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.scrambler);

            if(currency < stoppersItem.price) {
                this._buyStoppersButton.setEnabled(false);
                this._buyStoppersButton.setChildrenOpacity(128);
            }

            if(currency < convertersItem.price) {
                this._buyConvertersButton.setEnabled(false);
                this._buyConvertersButton.setChildrenOpacity(128);
            }

            if(currency < scramblersItem.price) {
                this._buyScramblersButton.setEnabled(false);
                this._buyScramblersButton.setChildrenOpacity(128);
            }

            var themes = NJ.themes.getListSortedByCost();

            var themeButton;

            for(var i = 0; i < themes.length; ++i) {
                themeButton = this._themeButtons[i];

                if(!themes[i].isPurchased && currency < themes[i].themeCost) {
                    //themeButton.setEnabled(false);
                } else {
                    //if(!theme)
                    //themeButton.setEnabled(true);
                }
            }
        },

        _updateTheme: function() {
            this._super();

            if(this._currencyLabel)
                this._currencyLabel.setLabelColor(NJ.themes.specialLabelColor);

            if(this._buyStoppersButton)
                this._buyStoppersButton.setBackgroundColor(NJ.themes.stoppersColor);

            if(this._buyScramblersButton)
                this._buyScramblersButton.setBackgroundColor(NJ.themes.scramblersColor);

            if(this._buyConvertersButton)
                this._buyConvertersButton.setBackgroundColor(NJ.themes.convertersColor);

            if(!this._themeMenu)
                return;

            var themes = NJ.themes.getListSortedByCost();

            var themeButton;

            for(var i = 0; i < themes.length; ++i) {
                var index = themes[i].index;

                themeButton = this._themeButtons[i];

                var isCurrentTheme = (NJ.themes.getActiveThemeIndex() == index);

                var labelStr = themes[i].themeName + " - ";
                if(!themes[i].isPurchased) {
                    labelStr += themes[i].themeCost + "";
                } else {
                    labelStr += isCurrentTheme ? "Active" : "Owned";
                }
                themeButton.setLabelTitle(labelStr);
                themeButton.setLabelColor(isCurrentTheme ? themes[i].blockColors[0] : NJ.themes.defaultLabelColor);
                themeButton.setBackgroundColor(themes[i].backgroundColor);
            }
        }
    });
}());