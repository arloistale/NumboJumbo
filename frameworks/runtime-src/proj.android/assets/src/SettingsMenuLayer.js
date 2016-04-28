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

        if(this.onCloseCallback)
            this.onCloseCallback();
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

    return cc.LayerColor.extend({

        // UI Data
        _menu: null,

        // Callbacks Data
        onMenuCallback: null,
        onCloseCallback: null,

////////////////////
// Initialization //
////////////////////

        ctor: function(bInGame) {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this.initUI(bInGame);
        },

        initUI: function(bInGame) {
            var that = this;

            this._menu = new cc.Menu();

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);

            var headerLabel = this.generateLabel(bInGame ? "Paused" : "Settings", refDim * NJ.uiSizes.header);

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

            this._menu.addChild(headerLabel);

            this._menu.addChild(musicLabel);
            this._menu.addChild(musicToggle);
            this._menu.addChild(soundsLabel);
            this._menu.addChild(soundsToggle);

            var buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.backImage);

            if(!bInGame) {
                this._menu.addChild(backButton);

                this._menu.alignItemsVerticallyWithPadding(10);
            } else {
                buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);
                var menuButton = new NJMenuButton(buttonSize, onMenu.bind(this), this);
                menuButton.setImageRes(res.homeImage);

                this._menu.addChild(backButton);
                this._menu.addChild(menuButton);

                this._menu.alignItemsVerticallyWithPadding(10);
            }

            this.addChild(this._menu, 100);
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