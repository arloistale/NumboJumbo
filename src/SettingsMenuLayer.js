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
        var sp = new cc.Sprite(res.loading_png);
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = NJ.SCALE;
        this.addChild(sp, 0, 1);

        /*
        var cacheImage = cc.textureCache.addImage(res.buttonImage);
        var title = new cc.Sprite(cacheImage);
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height - 120;
        this.addChild(title);
*/

        var that = this;

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

        if(!bInGame) {
            var backButton = this.generateTitleButton("Back", function () {
                that.onBack();
            });

            this._menu = new cc.Menu(musicLabel, soundsLabel, musicToggle, soundsToggle, backButton);
            this._menu.alignItemsInColumns(2, 2, 1);
        } else {
            var menuButton = this.generateTitleButton("Menu", function () {
                that.onMenu();
            });

            var resumeButton = this.generateTitleButton("Resume", function () {
                that.onBack();
            });

            this._menu = new cc.Menu(musicLabel, soundsLabel, musicToggle, soundsToggle, menuButton, resumeButton);
            this._menu.alignItemsInColumns(2, 2, 1, 1, 1);
        }

        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onMenu: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);

        // save any modified settings
        NJ.saveSettings();
                                             
        // first send the analytics for the current game session
        NJ.sendAnalytics();

        if(this.onMenuCallback)
            this.onMenuCallback();
    },

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);

        // save any modified settings
        NJ.saveSettings();

        if(this.onCloseCallback)
            this.onCloseCallback();
    },

    onMusicControl: function() {
        NJ.settings.music = !NJ.settings.music;

        cc.audioEngine.playEffect(res.successTrack, false);

        if(!NJ.settings.music)
            cc.audioEngine.stopMusic();
    },

    onSoundsControl: function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);
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

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(28);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateToggle: function(callback) {
        cc.MenuItemFont.setFontSize(36);
        var toggle = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),
            new cc.MenuItemFont("Off")
        );
        toggle.setColor(cc.color(255, 255, 255, 255));
        toggle.setCallback(callback);

        return toggle;
    },

    generateTitleButton: function(title, callback) {
        var label = new cc.LabelTTF(title, b_getFontName(res.markerFont), 42);
        label.setColor(cc.color(255, 255, 255, 255));

        return new cc.MenuItemLabel(label, callback);
    }
});