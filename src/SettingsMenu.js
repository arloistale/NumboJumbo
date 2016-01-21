/**
 * Created by jonathanlu on 1/19/16.
 */

var SettingsMenu = cc.Layer.extend({

    ctor: function() {
        this._super();
        this.init();
    },

    init:function() {
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
        // generate music toggle
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFontTTF));
        cc.MenuItemFont.setFontSize(18);
        var title1 = new cc.MenuItemFont("Music");
        title1.setEnabled(false);
        title1.setColor(cc.color(255, 255, 255, 255));

        cc.MenuItemFont.setFontSize(26);
        var item1 = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),
            new cc.MenuItemFont("Off")
        );
        item1.setColor(cc.color(255, 255, 255, 255));
        item1.setCallback(this.onMusicControl);

        var state = (NJ.settings.music ? 0 : 1);
        item1.setSelectedIndex(state);

        // generate sounds toggle
        cc.MenuItemFont.setFontSize(18);
        var title2 = new cc.MenuItemFont("Sounds");
        title2.setEnabled(false);
        title2.setColor(cc.color(255, 255, 255, 255));

        cc.MenuItemFont.setFontSize(26);
        var item2 = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),
            new cc.MenuItemFont("Off")
        );
        item2.setColor(cc.color(255, 255, 255, 255));
        item2.setCallback(this.onSoundsControl);
        state = (NJ.settings.sounds ? 0 : 1);
        item2.setSelectedIndex(state);

        cc.MenuItemFont.setFontSize(26);
        var label = new cc.LabelTTF("Back", b_getFontName(res.markerFontTTF), 20);
        label.setColor(cc.color(255, 255, 255, 255));
        var back = new cc.MenuItemLabel(label, this.onBack);
        back.scale = 1.0;

        var menu = new cc.Menu(title1, title2, item1, item2, back);
        menu.alignItemsInColumns(2, 2, 1);
        this.addChild(menu);

        back.y -= 50;

        return true;
    },

    onBack: function(sender) {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);

        // save any modified settings
        NJ.saveSettings();

        var scene = new cc.Scene();
        scene.addChild(new NumboMenu());
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
    },

    onMusicControl: function() {
        NJ.settings.music = !NJ.settings.music;

        if(NJ.settings.music)
            cc.audioEngine.playMusic(res.menuTrack);
        else
            cc.audioEngine.stopMusic();
    },

    onSoundsControl: function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);
        else
            cc.audioEngine.stopAllEffects();
    }
});