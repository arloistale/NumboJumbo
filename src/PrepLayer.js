/**
 * Created by jonathanlu on 1/19/16.
 */

var PrepLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onMenu = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        var that = this;

        this.leave(function() {
            if(that.onMenuCallback)
                that.onMenuCallback();
        });
    };

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        var that = this;

        this.leave(function() {
            if(that.onCloseCallback)
                that.onCloseCallback();
        });
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _contentMenu: null,
        _toolMenu: null,

        // Geometry Data
        _dividersNode: null,

        // Callbacks Data
        _onRetryCallback: null,
        onMenuCallback: null,
        onCloseCallback: null,

        // Data
        _primaryRes: null,
        _primaryColor: cc.color("#ffffff"),
        _titleStr: "",
        _primaryStr: "",

////////////////////
// Initialization //
////////////////////

        ctor: function(primaryRes, primaryColor, titleStr, primaryStr) {
            this._super();

            this._primaryRes = primaryRes;
            this._primaryColor = primaryColor;
            this._titleStr = titleStr;
            this._primaryStr = primaryStr;

            this.init(NJ.themes.backgroundColor);

            this._initHeaderUI();
            this._initContentUI();
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

            var headerLabel = this.generateLabel(this._titleStr, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2
            });

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initContentUI: function() {
            var that = this;

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._contentMenu.getContentSize().width,
                y: cc.visibleRect.center.y * 1.2
            });

            var buttonSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton));

            var primaryIcon = new NJMenuButton(buttonSize);
            primaryIcon.setImageRes(this._primaryRes);
            primaryIcon.setBackgroundColor(this._primaryColor);
            primaryIcon.setEnabled(false);
            var primaryLabel = this.generateLabel(this._primaryStr, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

            this._contentMenu.addChild(primaryIcon);
            this._contentMenu.addChild(primaryLabel);

            this._contentMenu.alignItemsVerticallyWithPadding(cc.visibleRect.height * 0.2);

            this.addChild(this._contentMenu);
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
            backButton.setImageRes(res.nextImage);
            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(backButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y * 1.2)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._contentMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y * 1.2)).easing(easing));

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

        setOnMenuCallback: function(callback) {
            this.onMenuCallback = callback;
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