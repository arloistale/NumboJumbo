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

        if(cc.sys.isNative) {
            NJ.purchases.buy(NJ.purchases.itemKeys.coin1, function (product, error) {
                _logCount++;

                if (!error) {
                    that.devModeLog("Log " + _logCount + ": Success = " + product);
                    NJ.stats.addCurrency(25000);
                    that._coinsLabel.setLabelTitle("Points: " + NJ.stats.getCurrency());
                    NJ.stats.save();
                } else {
                    that.devModeLog("Log " + _logCount + ": Failure = " + product + " : " + error);
                }
            });
        } else {
            NJ.stats.addCurrency(25000);
            that._coinsLabel.setLabelTitle("Points: " + NJ.stats.getCurrency());
            NJ.stats.save();
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
                that._coinsLabel.setLabelTitle("Points: " + NJ.stats.getCurrency());
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

        _pointsMenu: null,
        _themesMenu: null,

        _popoverMenu: null,

        _themeButtons: [],

        _coinsLabel: null,
        _coinsInfoLabel: null,

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
            this._initPointsUI();
            this._initThemesUI();
            this._initToolUI();

            this._generateBaseDividers();

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
                anchorY: 0.5,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var background = new NJMenuItem(this._headerMenu.getContentSize());
            background.setTag(333);
            background.setBackgroundImage(res.alertImage);
            background.setBackgroundColor(NJ.themes.backgroundColor);
            this._headerMenu.addChild(background);

            var headerLabel = this.generateLabel("SHOP", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            headerLabel.setEnabled(true);
            headerLabel.setCallback(function() {
                _devCount++;

                if(_devCount >= 7) {
                    that._initDevMode();
                }
            }, this);

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu, 100);
        },

        _initContentUI: function() {
            var that = this;

            this._contentScrollView = new ccui.ScrollView();
            this._contentScrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this._contentScrollView.setTouchEnabled(true);
            this._contentScrollView.setBounceEnabled(true);
            this._contentScrollView.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (1 - NJ.uiSizes.header - NJ.uiSizes.toolbar)));
            this._contentScrollView.setInnerContainerSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * (NJ.uiSizes.pointsArea + NJ.uiSizes.themesArea)));
            this._contentScrollView.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y - cc.visibleRect.height
            });

            this.addChild(this._contentScrollView);
        },

        _initPointsUI: function() {
            this._pointsMenu = new cc.Menu();
            this._pointsMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.pointsArea * cc.visibleRect.height));

            this._pointsMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._contentScrollView.innerHeight - (cc.visibleRect.height * NJ.uiSizes.pointsArea) / 2
            });

            // generate music toggle
            this._coinsLabel = this.generateLabel("Points: " + NJ.stats.getCurrency(), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var coinSize = this._coinsLabel.getContentSize();

            var buyCoinsButton = new NJMenuButton(cc.size(coinSize.height, coinSize.height), onBuyCoins.bind(this), this);
            //buyCoinsButton.setLabelTitle("1000");
            //buyCoinsButton.setLabelColor(NJ.themes.defaultLabelColor);
            buyCoinsButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            buyCoinsButton.setImageRes(res.plusImage);
            //buyCoinsButton.offsetLabel(cc.p(coinSize.height * 1.5, 0));

            // generate sounds toggle
            this._coinsInfoLabel = this.generateLabel("Buy or earn points for pretty themes!", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._pointsMenu.addChild(this._coinsLabel);
            this._pointsMenu.addChild(buyCoinsButton);

            this._pointsMenu.addChild(this._coinsInfoLabel);

            this._pointsMenu.alignItemsVerticallyWithPadding(10);

            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var divider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.defaultLabelColor);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._pointsMenu.getContentSize().height / 2
            });
            this._pointsMenu.addChild(divider);

            this._contentScrollView.addChild(this._pointsMenu);
        },

        _initThemesUI: function() {
            var that = this;

            this._themeMenu = new cc.Menu();
            this._themeMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.themesArea * cc.visibleRect.height));

            this._themeMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this._contentScrollView.width / 2,
                y: this._contentScrollView.innerHeight - (cc.visibleRect.height * (NJ.uiSizes.pointsArea + NJ.uiSizes.themesArea / 2))
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

                    themeButton = new NJMenuButton(buttonSize, function() {
                        (onActivateTheme.bind(this))(index);
                    }, that);
                    themeButton.setTag(666);
                    var labelStr = themes[i].themeName + " - ";
                    if(!themes[i].isPurchased) {
                        labelStr += themes[i].themeCost + "";
                    } else {
                        labelStr += isCurrentTheme ? "Active" : "Owned";
                    }
                    themeButton.setLabelTitle(labelStr);
                    themeButton.setLabelColor(isCurrentTheme ? themes[i].blockColors[0] : themes[i].defaultLabelColor);
                    themeButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
                    //themeButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
                    themeButton.setBackgroundImage(res.alertImage);
                    themeButton.setBackgroundColor(themes[i].backgroundColor);
                    themeButton.attr({
                        anchorX: 0.5,
                        anchorY: 0.5
                    });
                    //buyCoinsButton.setImageRes(res.promoImage);
                    //buyCoinsButton.offsetLabel(cc.p(coinSize.height * 1.5, 0));

                    that._themeMenu.addChild(themeButton);
                    that._themeButtons.push(themeButton);
                })();
            }

            this._themeMenu.alignItemsVerticallyWithPadding(cc.visibleRect.height * 0.07);

            this._contentScrollView.addChild(this._themeMenu);
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

            var background = new NJMenuItem(this._toolMenu.getContentSize());
            background.setTag(333);
            background.setBackgroundImage(res.alertImage);
            background.setBackgroundColor(NJ.themes.backgroundColor);
            this._toolMenu.addChild(background);

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.homeImage);

            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(backButton);

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
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentScrollView.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._pointsMenu.getContentSize();
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

        generateLabel: function(title, size) {
            var toggleItem = new NJMenuItem(size);
            toggleItem.setLabelTitle(title);
            toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
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