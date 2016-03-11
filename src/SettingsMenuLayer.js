/**
 * Created by jonathanlu on 1/19/16.
 */

var SettingsMenuLayer = cc.LayerColor.extend({

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

        this.init(cc.color(0, 0, 0, 255));

        this.initUI(bInGame);
    },

    initUI: function(bInGame) {
        var that = this;

        this._menu = new cc.Menu();

        var headerLabel = this.generateHeaderLabel(bInGame ? "Paused" : "Settings");

        this._menu.addChild(headerLabel);

        // generate music toggle
        var musicLabel = this.generateLabel("Music");
        var musicToggle = this.generateToggle(function() {
            that.onMusicControl();
        });
        var state = (NJ.settings.music ? 0 : 1);
        musicToggle.setSelectedIndex(state);

        // generate sounds toggle
        var soundsLabel = this.generateLabel("Sounds");
        var soundsToggle = this.generateToggle(function() {
            that.onSoundsControl();
        });
        state = (NJ.settings.sounds ? 0 : 1);
        soundsToggle.setSelectedIndex(state);

        this._menu.addChild(musicLabel);
        this._menu.addChild(soundsLabel);
        this._menu.addChild(musicToggle);
        this._menu.addChild(soundsToggle);

        var backButton = new MenuTitleButton(bInGame ? "Resume" : "Back", function () {
            that.onBack();
        }, this);

        backButton.setImageRes(res.buttonImage);

        if(!bInGame) {
            this._menu.addChild(backButton);

            this._menu.alignItemsInColumns(1, 2, 2, 1);
        } else {
            var menuButton = new MenuTitleButton("Menu", function () {
                that.onMenu();
            }, this);

            menuButton.setImageRes(res.buttonImage);

            this._menu.addChild(menuButton);
            this._menu.addChild(backButton);

            this._menu.alignItemsInColumns(1, 2, 2, 1, 1, 1);
        }

        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onMenu: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        // save any modified settings
        NJ.saveSettings();

        if(this.onMenuCallback)
            this.onMenuCallback();
    },

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        // save any modified settings
        NJ.saveSettings();

        if(this.onCloseCallback)
            this.onCloseCallback();
    },

    onMusicControl: function() {
        NJ.settings.music = !NJ.settings.music;

        if(NJ.settings.sounds)
	    cc.audioEngine.playEffect(res.clickSound, false);

        if(!NJ.settings.music)
            cc.audioEngine.stopMusic();
    },

    onSoundsControl: function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);
        else
            cc.audioEngine.stopAllEffects();
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

    generateHeaderLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
        cc.MenuItemFont.setFontSize(NJ.fontSizes.header);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.mainFont));
        cc.MenuItemFont.setFontSize(NJ.fontSizes.paragraph);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateToggle: function(callback) {
        cc.MenuItemFont.setFontSize(NJ.fontSizes.buttonSmall);
        var toggle = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),
            new cc.MenuItemFont("Off")
        );

        toggle.setColor(cc.color(255, 255, 255, 255));
        toggle.setCallback(callback);

        return toggle;
    }
});