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

    var onBatteryControl = function() {
        NJ.settings.battery = !NJ.settings.battery;

        NJ.audio.playSound(res.clickSound);
    };

    return BaseMenuLayer.extend({

        // UI Data
        _contentMenu: null,

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
            this._isInGame = isInGame;

            this._super();

            this._initContentUI();
        },

        _initHeaderUI: function() {
            this._super();

            var headerLabel = this.generateLabel(this._isInGame ? "PAUSED" : "SETTINGS", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));

            this._headerMenu.addChild(headerLabel);
        },

        _initContentUI: function() {
            var that = this;

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._contentMenu.getContentSize().width / 2
            });

            var contentSize = this._contentMenu.getContentSize();

            // generate music toggle
            var musicY = contentSize.height / 2 - contentSize.height / 6;

            var musicLabel = this.generateLabel("Music", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            musicLabel.setPositionY(musicY + musicLabel.getContentSize().height / 2);
            var musicToggle = this.generateToggle(onMusicControl.bind(this));
            var state = (NJ.settings.music ? 0 : 1);
            musicToggle.setSelectedIndex(state);
            musicToggle.setPositionY(musicY - musicToggle.getContentSize().height / 2);

            // first divider
            var divider = this._generateSupportDivider();
            divider.setPositionY(musicY - contentSize.height / 6);

            // generate sounds toggle
            musicY -= contentSize.height / 3;
            var soundsLabel = this.generateLabel("Sounds", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var soundsToggle = this.generateToggle(onSoundsControl.bind(this));
            soundsLabel.setPositionY(musicY + soundsLabel.getContentSize().height / 2);
            state = (NJ.settings.sounds ? 0 : 1);
            soundsToggle.setSelectedIndex(state);
            soundsToggle.setPositionY(musicY - soundsToggle.getContentSize().height / 2);

            // second divider
            var dividerSecondary = this._generateSupportDivider();
            dividerSecondary.setPositionY(musicY - contentSize.height / 6);

            // generate battery toggle
            musicY -= contentSize.height / 3;
            var batteryLabel = this.generateLabel("Battery Saving", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var batteryToggle = this.generateToggle(onBatteryControl.bind(this));
            batteryLabel.setPositionY(musicY + batteryLabel.getContentSize().height / 2);
            state = (NJ.settings.battery ? 0 : 1);
            batteryToggle.setSelectedIndex(state);
            batteryToggle.setPositionY(musicY - batteryToggle.getContentSize().height / 2);

            this._contentMenu.addChild(musicLabel);
            this._contentMenu.addChild(musicToggle);

            this._contentMenu.addChild(divider);

            this._contentMenu.addChild(soundsLabel);
            this._contentMenu.addChild(soundsToggle);

            this._contentMenu.addChild(dividerSecondary);

            this._contentMenu.addChild(batteryLabel);
            this._contentMenu.addChild(batteryToggle);

            this.addChild(this._contentMenu);
        },

        _initToolUI: function() {

            this._super();

            var toolSize = this._toolMenu.getContentSize();

            var that = this;

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var backButton = new NumboMenuButton(buttonSize, function() {
                that._onBack();
            }, this);
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

                var retryButton = new NumboMenuButton(buttonSize, onRetry.bind(this), this);
                retryButton.setImageRes(res.retryImage);
                retryButton.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });

                var menuButton = new NumboMenuButton(buttonSize, onMenu.bind(this), this);
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

            this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));
        },

        reset: function() {
            this._super();

            this._contentMenu.setPositionX(-this._contentMenu.getContentSize().width);
        },

        // makes menu elements transition in
        enter: function() {
            this._super();

            var easing = cc.easeBackOut();

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            this._super(callback);

            var contentSize = this._contentMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y)).easing(easing));
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

        setOnRetryCallback: function(callback) {
            this._onRetryCallback = callback;
        },

        setOnCloseCallback: function(callback) {
            this.onCloseCallback = callback;
        },

        setOnMenuCallback: function(callback) {
            this.onMenuCallback = callback;
        }
    });
}());