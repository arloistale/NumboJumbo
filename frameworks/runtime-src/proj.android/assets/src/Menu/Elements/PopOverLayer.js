/**
 * Base definition for pop over layer that appears over the current layer.
 */

var PopOverLayer = cc.LayerColor.extend({

    // UI Data
    _popOverContainer: null,

    _headerMenu: null,
    _contentMenu: null,
    _toolMenu: null,

    _headerLabel: null,
    _contentLabel: null,

    // Geometry Data
    _containerSprite: null,

    // Callbacks Data
    _onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.init(cc.color(0, 0, 0, 128));

        this._initInput();

        this._initContainerUI();
        this._initHeaderUI();
        this._initContentUI();
        this._initToolUI();
    },

    // Initialize input depending on the device.
    _initInput: function() {
        var that = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key, event) {
                if(key == cc.KEY.back) {
                    that._onBack();
                }
            }
        }, this);
    },

    _initContainerUI: function() {
        var that = this;

        var containerSize = cc.size(cc.visibleRect.width * 0.8, cc.visibleRect.height * 0.35);

        var container = this._popOverContainer = new cc.Node();
        container.setContentSize(containerSize);
        container.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.visibleRect.center.x - cc.visibleRect.width,
            y: cc.visibleRect.center.y
        });

        this._containerSprite = new cc.Sprite(res.alertImage);
        this._containerSprite.setColor(NJ.themes.backgroundColor);
        var imageSize = this._containerSprite.getContentSize();
        this._containerSprite.setScale(containerSize.width / imageSize.width, containerSize.height / imageSize.height);

        this._containerSprite.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: containerSize.width / 2,
            y: containerSize.height / 2
        });

        container.addChild(this._containerSprite, -1);

        this.addChild(container);
    },

    _initHeaderUI: function() {
        var containerSize = this._popOverContainer.getContentSize();

        this._headerMenu = new cc.Menu();
        this._headerMenu.setContentSize(cc.size(containerSize.width, containerSize.height * NJ.uiSizes.popOverHeaderBar));
        this._headerMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: containerSize.width / 2,
            y: containerSize.height - this._headerMenu.getContentSize().height / 2
        });

        this._headerLabel = this.generateLabel("Default Label", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));

        this._headerMenu.addChild(this._headerLabel);

        this._popOverContainer.addChild(this._headerMenu);
    },

    _initContentUI: function() {
        var containerSize = this._popOverContainer.getContentSize();

        this._contentMenu = new cc.Menu();
        this._contentMenu.setContentSize(cc.size(containerSize.width,
            (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * containerSize.height));

        this._contentMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: containerSize.width / 2,
            y: containerSize.height / 2
        });

        this._contentLabel = this.generateLabel("Whoops! There should be a campaign message here but we forgot to include it. Sorry about that.", cc.size(containerSize.width, NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub)));
        this._contentLabel.setLabelBoundingWidth(containerSize.width);
        this._contentMenu.addChild(this._contentLabel);

        this._popOverContainer.addChild(this._contentMenu);
    },

    _initToolUI: function() {
        var that = this;

        var containerSize = this._popOverContainer.getContentSize();

        this._toolMenu = new cc.Menu();
        this._toolMenu.setContentSize(cc.size(containerSize.width, containerSize.height * NJ.uiSizes.popOverToolBar));
        var toolSize = this._toolMenu.getContentSize();
        this._toolMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: containerSize.width / 2,
            y: toolSize.height / 2
        });

        var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

        var backButton = new NumboMenuButton(buttonSize, function() {
            that._onBack();
        }, this);
        backButton.setImageRes(res.backImage);

        this._toolMenu.addChild(backButton);

        this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));

        this._popOverContainer.addChild(this._toolMenu, 100);
    },

    // makes menu elements transition in
    enter: function() {
        var easing = cc.easeBackOut();

        this._popOverContainer.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, this._popOverContainer.getPositionY())).easing(easing));
    },

    // transition out
    leave: function(callback) {
        var easing = cc.easeBackOut();

        this._popOverContainer.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - cc.visibleRect.width, this._popOverContainer.getPositionY())).easing(easing));

        this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
            if(callback)
                callback();
        })));
    },

    //////////////////
    // UI Modifiers //
    //////////////////

    setHeaderLabel: function(headerStr) {
        this._headerLabel.setLabelTitle(headerStr);
        this._headerMenu.alignItemsVertically();
    },

    setContentLabel: function(labelStr) {
        this._contentLabel.setLabelTitle(labelStr);
        this._contentMenu.alignItemsVertically();
    },

//////////////////
// UI Callbacks //
//////////////////

    setOnCloseCallback: function(callback) {
        this._onCloseCallback = callback;
    },

////////////////
// UI Helpers //
////////////////

    generateLabel: function(title, size) {
        var toggleItem = new NumboMenuItem(size);
        toggleItem.setLabelTitle(title);
        toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
        return toggleItem;
    },

    ///////////////
    // UI Events //
    ///////////////

    _onBack: function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        this.leave(function() {
            if(that._onCloseCallback)
                that._onCloseCallback();
        });
    }
});