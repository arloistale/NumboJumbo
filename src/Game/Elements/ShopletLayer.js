/**
 * The shoplet layer is a simplified shop window that
 * displays a single item for purchase.
 */
var ShopletLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onBuyConverters = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        const converterPurchaseData = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.converter);

        if(NJ.stats.getNumConverters() + converterPurchaseData.amount <= NJ.stats.MAX_NUM_CONVERTERS) {
            if (NJ.stats.getCurrency() >= converterPurchaseData.price) {
                NJ.stats.addCurrency(-converterPurchaseData.price);
                NJ.stats.addConverters(converterPurchaseData.amount);
                that.updateCurrencyLabel();
                that.updatePowerups();
                NJ.stats.save();
            }
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
                that.updatePowerups();
                NJ.stats.save();
            }
        }
    };

    var onBuyHints = function() {
        NJ.audio.playSound(res.coinSound);

        var that = this;

        const hintsPurchaseData = NJ.purchases.getInGameItemByKey(NJ.purchases.ingameItemKeys.hint);

        if(NJ.stats.getNumHints() + hintsPurchaseData.amount <= NJ.stats.MAX_NUM_HINTS) {
            if (NJ.stats.getCurrency() >= hintsPurchaseData.price) {
                NJ.stats.addCurrency(-hintsPurchaseData.price);
                NJ.stats.addHints(hintsPurchaseData.amount);
                that.updateCurrencyLabel();
                that.updatePowerups();
                NJ.stats.save();
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
                that.updatePowerups();
                NJ.stats.save();
            }
        }
    };

    return BaseMenuLayer.extend({

        // shop UI Data

        _itemMenu: null,

        _buyItemButton: null,

        _currencyLabel: null,
        _currencyInfoLabel: null,

        // Callbacks Data
        onCloseCallback: null,

        // Item Data
        _itemKey: null,

/////////////////////
// Initialization //
////////////////////

        ctor: function(itemKey) {
            this._super();

            this._itemKey = itemKey;

            this._initItemUI();

            this.updatePowerups();
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

        _initItemUI: function() {
            var that = this;

            var item = NJ.purchases.getInGameItemByKey(this._itemKey);
            if(!item)
                return;

            this._itemMenu = new cc.Menu();
            this._itemMenu.setContentSize(cc.size(cc.visibleRect.width, NJ.uiSizes.powerupsArea * cc.visibleRect.height));

            this._currentYPos -= cc.visibleRect.height * NJ.uiSizes.powerupsArea / 2;

            this._itemMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x - cc.visibleRect.width,
                y: cc.visibleRect.center.y
            });

            // generate music toggle
            var powerupsLabel = this.generateLabel(item.name, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            // create a menu item container to store buttons and
            var coinSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.shopButton));
            var labelSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._buyItemButton = new NumboMenuButton(cc.size(coinSize.height, coinSize.height), function() {
                switch(that._itemKey) {
                    case NJ.purchases.ingameItemKeys.converter:
                        (onBuyConverters.bind(that))();
                        break;
                    case NJ.purchases.ingameItemKeys.hint:
                        (onBuyHints.bind(that))();
                        break;
                    case NJ.purchases.ingameItemKeys.scrambler:
                        (onBuyScramblers.bind(that))();
                        break;
                    case NJ.purchases.ingameItemKeys.stopper:
                        (onBuyStoppers.bind(that))();
                        break;
                }
            }, this);
            this._buyItemButton.setBackgroundColor(NJ.themes.hintsColor);
            this._buyItemButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._buyItemButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._buyItemButton.setLabelTitle(" ");
            this._buyItemButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            this._buyItemButton.offsetLabel(cc.p(this._buyItemButton.getContentSize().width / 1.1, 0));
            this._buyItemButton.setImageRes(item.iconRes);

            var itemDescriptionLabel = this.generateLabel(item.description, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            var buyItemLabel = this.generateLabel(item.amount + " " + item.name + "\n" + item.price, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));

            this._itemMenu.addChild(powerupsLabel);
            this._itemMenu.addChild(itemDescriptionLabel);
            this._itemMenu.addChild(this._buyItemButton);
            this._itemMenu.addChild(buyItemLabel);

            this._itemMenu.alignItemsVerticallyWithPadding(NJ.calculateScreenDimensionFromRatio(0.025));

            this.addChild(this._itemMenu);
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
            backButton.setImageRes(res.backImage);

            this._toolMenu.addChild(backButton);
        },

        // makes menu elements transition in
        enter: function() {
            this._super();

            var easing = cc.easeBackOut();

            this._itemMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._itemMenu.getPositionY())).easing(easing));
        },

        // transition out
        leave: function(callback) {
            this._super(callback);

            var easing = cc.easeBackOut();

            this._itemMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - cc.visibleRect.width, this._itemMenu.getPositionY())).easing(easing));
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

        updateCurrencyLabel: function() {
            this._currencyLabel.setLabelTitle(NJ.stats.getCurrency() + " Bubbles");
        },

        updatePowerups: function() {
            var item = NJ.purchases.getInGameItemByKey(this._itemKey);

            switch(this._itemKey) {
                case NJ.purchases.ingameItemKeys.converter:
                    this._buyItemButton.setLabelTitle(NJ.stats.getNumConverters() + "");
                    break;
                case NJ.purchases.ingameItemKeys.hint:
                    this._buyItemButton.setLabelTitle(NJ.stats.getNumHints() + "");
                    break;
                case NJ.purchases.ingameItemKeys.scrambler:
                    this._buyItemButton.setLabelTitle(NJ.stats.getNumScramblers() + "");
                    break;
                case NJ.purchases.ingameItemKeys.stopper:
                    this._buyItemButton.setLabelTitle(NJ.stats.getNumStoppers() + "");
                    break;
            }

            if(NJ.stats.getCurrency() < item.price) {
                this._buyItemButton.setEnabled(false);
                this._buyItemButton.setChildrenOpacity(128);
            }
        },

        _updateTheme: function() {
            this._super();

            if(this._currencyLabel)
                this._currencyLabel.setLabelColor(NJ.themes.specialLabelColor);

            if(this._buyItemButton)
                this._buyItemButton.setBackgroundColor(NJ.themes.hintsColor);
        }
    });
}());