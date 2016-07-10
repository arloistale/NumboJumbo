/**
 * Base definition for pop over layer that appears over the current layer.
 */

var PopOverLayer = (function() {

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _contentMenu: null,
        _toolMenu: null,

        // Geometry Data
        _containerSprite: null,

        // Callbacks Data
        _onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

        ctor: function() {
            this._super();

            this.init(cc.color(255, 255, 255, 128));

            this._initInput();

            this._initContainerUI();
            this._initHeaderUI();
            //this._initContentUI();
            //this._initOptionsUI();
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
                        that._onBack();
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

            var headerLabel = this.generateLabel("", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initContainerUI: function() {
            var that = this;

            this._containerSprite = new ccui.Scale9Sprite(res.buttonImage);
            this._containerSprite.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.optionsArea - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._containerSprite.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._containerSprite.getContentSize().width
            });

            this.addChild(this._contentMenu);
        },

        _initContentUI: function() {
            var that = this;

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.optionsArea - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._contentMenu.getContentSize().width
            });

            // generate music toggle
            var musicY = this._contentMenu.getContentSize().height * 0.25;

            var musicLabel = this.generateLabel("Music", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            musicLabel.setPositionY(musicY + musicLabel.getContentSize().height / 2);
            var musicToggle = this.generateToggle(onMusicControl.bind(this));
            var state = (NJ.settings.music ? 0 : 1);
            musicToggle.setSelectedIndex(state);
            musicToggle.setPositionY(musicY - musicToggle.getContentSize().height / 2);

            // generate sounds toggle
            musicY = -this._contentMenu.getContentSize().height * 0.25;
            var soundsLabel = this.generateLabel("Sounds", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var soundsToggle = this.generateToggle(onSoundsControl.bind(this));
            soundsLabel.setPositionY(musicY + musicLabel.getContentSize().height / 2);
            state = (NJ.settings.sounds ? 0 : 1);
            soundsToggle.setSelectedIndex(state);
            soundsToggle.setPositionY(musicY - soundsToggle.getContentSize().height / 2);

            this._contentMenu.addChild(soundsLabel);
            this._contentMenu.addChild(soundsToggle);

            //this._contentMenu.addChild(vibrationLabel);
            //this._contentMenu.addChild(vibrationToggle);

            //this._contentMenu.alignItemsVerticallyWithPadding(this._contentMenu.getContentSize().height / 6);

            this.addChild(this._contentMenu);
        },

        _initOptionsUI: function() {
            var that = this;

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.optionsArea - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._contentMenu.getContentSize().width
            });

            // divider cuts the middle
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

            var divider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            divider.setTag(444);
            divider.setBackgroundImage(res.alertImage);
            divider.setBackgroundColor(NJ.themes.defaultLabelColor);
            divider.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            // generate music toggle
            var musicY = this._contentMenu.getContentSize().height * 0.25;

            var musicLabel = this.generateLabel("Music", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            musicLabel.setPositionY(musicY + musicLabel.getContentSize().height / 2);
            var musicToggle = this.generateToggle(onMusicControl.bind(this));
            var state = (NJ.settings.music ? 0 : 1);
            musicToggle.setSelectedIndex(state);
            musicToggle.setPositionY(musicY - musicToggle.getContentSize().height / 2);

            // generate sounds toggle
            musicY = -this._contentMenu.getContentSize().height * 0.25;
            var soundsLabel = this.generateLabel("Sounds", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var soundsToggle = this.generateToggle(onSoundsControl.bind(this));
            soundsLabel.setPositionY(musicY + musicLabel.getContentSize().height / 2);
            state = (NJ.settings.sounds ? 0 : 1);
            soundsToggle.setSelectedIndex(state);
            soundsToggle.setPositionY(musicY - soundsToggle.getContentSize().height / 2);

            this._contentMenu.addChild(soundsLabel);
            this._contentMenu.addChild(soundsToggle);

            //this._contentMenu.addChild(vibrationLabel);
            //this._contentMenu.addChild(vibrationToggle);

            //this._contentMenu.alignItemsVerticallyWithPadding(this._contentMenu.getContentSize().height / 6);

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
            backButton.setImageRes(res.backImage);

            this._toolMenu.addChild(backButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._contentMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y)).easing(easing));

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
        },

        generateToggle: function(callback, opts) {
            opts = opts || [
                    { name: "ON", color: NJ.themes.specialLabelColor },
                    { name: "OFF", color: NJ.themes.specialLabelColor }
                ];
            var items = [];
            var item;
            for(var i = 0; i < opts.length; ++i) {
                item = new NJMenuItem(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
                item.setLabelTitle(opts[i].name);
                item.setLabelColor(opts[i].color);
                items.push(item);
            }

            var toggle = new cc.MenuItemToggle(items[0], items[1]);

            toggle.setCallback(callback);

            return toggle;
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
}());