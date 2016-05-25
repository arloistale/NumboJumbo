/**
 * Created by jonathanlu on 1/19/16.
 */

var SettingsMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onMenu = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        // save any modified settings
        NJ.saveSettings();

        if(this.onMenuCallback)
            this.onMenuCallback();
    };

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        // save any modified settings
        NJ.saveSettings();

        this.leave();
    };

    var onMusicControl = function() {
        NJ.settings.music = !NJ.settings.music;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(!NJ.settings.music)
            cc.audioEngine.stopMusic();
    };

    var onSoundsControl = function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);
        else
            cc.audioEngine.stopAllEffects();
    };

    var onVibrationControl = function() {
        NJ.settings.vibration = !NJ.settings.vibration;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);
        else
            cc.audioEngine.stopAllEffects();
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _contentMenu: null,
        _toolMenu: null,

        // Callbacks Data
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

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);

            var headerLabel = this.generateLabel(this._isInGame ? "Paused" : "Settings", refDim * NJ.uiSizes.header);
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
                x: -this._contentMenu.getContentSize().width
            });

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);

            // generate music toggle
            var musicLabel = this.generateLabel("Music", refDim * NJ.uiSizes.header2);
            var musicToggle = this.generateToggle(onMusicControl.bind(this));
            var state = (NJ.settings.music ? 0 : 1);
            musicToggle.setSelectedIndex(state);

            // generate sounds toggle
            var soundsLabel = this.generateLabel("Sounds", refDim * NJ.uiSizes.header2);
            var soundsToggle = this.generateToggle(onSoundsControl.bind(this));
            state = (NJ.settings.sounds ? 0 : 1);
            soundsToggle.setSelectedIndex(state);

            // generate vibration toggle
            var vibrationLabel = this.generateLabel("Vibration", refDim * NJ.uiSizes.header2);
            var vibrationToggle = this.generateToggle(onVibrationControl.bind(this));
            state = (NJ.settings.vibration ? 0 : 1);
            vibrationToggle.setSelectedIndex(state);

            this._contentMenu.addChild(musicLabel);
            this._contentMenu.addChild(musicToggle);

            this._contentMenu.addChild(soundsLabel);
            this._contentMenu.addChild(soundsToggle);

            this._contentMenu.addChild(vibrationLabel);
            this._contentMenu.addChild(vibrationToggle);

            this._contentMenu.alignItemsInColumns(2, 2, 2);

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
            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(backButton);

            if(this._isInGame) {
                buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);
                var menuButton = new NJMenuButton(buttonSize, onMenu.bind(this), this);
                menuButton.setImageRes(res.homeImage);
                menuButton.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });

                this._toolMenu.addChild(menuButton);
            }

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function() {
            var that = this;

            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._contentMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y)).easing(easing));

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                if(that.onCloseCallback)
                    that.onCloseCallback();
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
            toggleItem.setTitle(title);
            toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
            return toggleItem;
        },

        generateToggle: function(callback) {
            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var onItem = new NJMenuItem(refDim * NJ.uiSizes.sub);
            onItem.setTitle("On");
            onItem.setLabelColor(NJ.themes.defaultLabelColor);
            var offItem = new NJMenuItem(refDim * NJ.uiSizes.sub);
            offItem.setTitle("Off");
            offItem.setLabelColor(NJ.themes.defaultLabelColor);
            var toggle = new cc.MenuItemToggle(
                onItem,
                offItem
            );

            toggle.setCallback(callback);

            return toggle;
        }
    });
}());