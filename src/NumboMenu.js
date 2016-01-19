
var NumboMenu = cc.Layer.extend({

    ctor: function () {
        this._super();

        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        /*
        var sp = new cc.Sprite(res.loading_png);
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = NJ.SCALE;
        this.addChild(sp, 0, 1);
*/
        this.initBackground();
        this.initUI();
        this.initAudio();

        return true;
    },

    // initialize background for menu
    initBackground: function() {
        var backgroundSprite = new cc.Sprite(res.backgroundImage);
        backgroundSprite.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1,
            rotation: 0
        });
        this.addChild(backgroundSprite, 10, 1);
    },

    // initialize menu elements
    initUI: function() {
        var playButton = this.generateTitleButton("Play", this.onPlay);
        var settingsButton = this.generateTitleButton("Settings", this.onSettings);

        playButton.scale = NJ.SCALE;
        settingsButton.scale = NJ.SCALE;

        var menu = new cc.Menu(playButton, settingsButton);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 100, 2);
        menu.x = cc.winSize.width / 2;
        menu.y = cc.winSize.height / 2;// - 140;
    },

    // initialize game audio
    initAudio: function() {
        //if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(res.menuTrack, true);
        //}
    },

    onPlay: function(sender) {
        cc.audioEngine.playEffect(res.successTrack, false);

        //load resources
        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new cc.Scene();
            scene.addChild(new NumboGameLayer());
            //scene.addChild(new GameControlMenu());
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    onSettings: function(sender) {
        cc.audioEngine.playEffect(res.successTrack, false);

        var scene = new cc.Scene();
        scene.addChild(new SettingsMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },

    generateTitleButton: function(title, callback) {
        var normalSprite = new cc.Sprite(res.buttonImage);
        var selectedSprite = new cc.Sprite(res.buttonImage);
        var disabledSprite = new cc.Sprite(res.buttonImage);

        selectedSprite.setColor(cc.color(192, 192, 192, 255));
        disabledSprite.setColor(cc.color(64, 64, 64, 255));

        var normalLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        normalLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: normalSprite.getContentSize().width / 2,
            y: normalSprite.getContentSize().height / 2
        });

        var selectedLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        selectedLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: selectedSprite.getContentSize().width / 2,
            y: selectedSprite.getContentSize().height / 2
        });

        var disabledLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        disabledLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: disabledSprite.getContentSize().width / 2,
            y: disabledSprite.getContentSize().height / 2
        });

        normalSprite.addChild(normalLabel);
        selectedSprite.addChild(selectedLabel);
        disabledSprite.addChild(disabledLabel);

        return new cc.MenuItemSprite(normalSprite, selectedSprite, disabledSprite, callback, this);
    }
});

NumboMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new NumboMenu();
    scene.addChild(layer);
    return scene;
};