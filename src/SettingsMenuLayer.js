/**
 * Created by jonathanlu on 1/19/16.
 */

var SettingsMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onRetry = function() {
        NJ.audio.playSound(res.clickSound);

        var that = this;

        this.leave(function() {
            if(that._onRetryCallback)
                that._onRetryCallback();
        });
    };

    var onMenu = function() {
        NJ.audio.playSound(res.clickSound);

        // save any modified settings
        NJ.saveSettings();

        var that = this;

        this.leave(function() {
            if(that.onMenuCallback)
                that.onMenuCallback();
        });
    };

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

    var onMusicControl = function() {
        NJ.settings.music = !NJ.settings.music;

        NJ.audio.playSound(res.clickSound);

        if(!NJ.settings.music)
            NJ.audio.stopMusic();
    };

    var onSoundsControl = function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        NJ.audio.playSound(res.clickSound);
    };

    var onVibrationControl = function() {
        NJ.settings.vibration = !NJ.settings.vibration;

        this._updateTheme();

        NJ.audio.playSound(res.clickSound);
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _contentMenu: null,
        _toolMenu: null,

        // Geometry Data
        _headerDividerNode: null,
        _toolbarDividerNode: null,

        // Callbacks Data
        _onRetryCallback: null,
        onMenuCallback: null,
        onCloseCallback: null,

        // Data
        _isInGame: false,

////////////////////
// Initialization //
////////////////////

        ctor: function(isInGame) {
            this._super();

            this._isInGame = isInGame;

            this.init(NJ.themes.backgroundColor);

            this._initInput();

            this._initHeaderUI();
            this._initContentUI();
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
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var headerLabel = this.generateLabel(this._isInGame ? "PAUSED" : "SETTINGS", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
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

            /*
            // generate vibration toggle
            var vibrationLabel = this.generateLabel("Theme", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var vibrationToggle = this.generateToggle(onVibrationControl.bind(this), [
                { name: "Light", color: NJ.themes.specialLabelColor },
                { name: "Dark", color: NJ.themes.specialLabelColor }
            ]);
            state = (NJ.settings.vibration ? 0 : 1);
            vibrationToggle.setSelectedIndex(state);
*/

            this._contentMenu.addChild(musicLabel);
            this._contentMenu.addChild(musicToggle);

            this._contentMenu.addChild(divider);

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
            if(this._isInGame)
                backButton.setImageRes(res.playImage);
            else
                backButton.setImageRes(res.homeImage);

            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            if(this._isInGame) {
                buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

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

                this._toolMenu.addChild(retryButton);
                this._toolMenu.addChild(backButton);
                this._toolMenu.addChild(menuButton);
            } else {
                this._toolMenu.addChild(backButton);
            }

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

        setOnRetryCallback: function(callback) {
            this._onRetryCallback = callback;
        },

        setOnCloseCallback: function(callback) {
            this.onCloseCallback = callback;
        },

        setOnMenuCallback: function(callback) {
            this.onMenuCallback = callback;
        },

////////////////
// UI Helpers //
////////////////

        // generate dividers on headers and toolbars
        _generateBaseDividers: function() {
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

            var headerDivider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
            headerDivider.setBackgroundImage(res.alertImage);
            headerDivider.setBackgroundColor(NJ.themes.defaultLabelColor);
            headerDivider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2 + dividerHeight
            });
            this._headerMenu.addChild(headerDivider);

            var toolDivider = new NJMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
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
        }
    });
}());