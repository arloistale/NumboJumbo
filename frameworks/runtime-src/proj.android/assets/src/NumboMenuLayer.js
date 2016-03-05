
var NumboMenuLayer = cc.Layer.extend({

    _menu: null,
    _jumboMenuLayer: null,
    _instructionsLayer: null,
    _scoresLayer: null,
    _settingsMenuLayer: null,
    
////////////////////
// Initialization //
////////////////////

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
    },

    // initialize background for menu
    initBackground: function() {
        var backgroundSprite = new cc.Sprite(res.backgroundImage);
        backgroundSprite.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1,
            rotation: 0
        });
        this.addChild(backgroundSprite, 10, 1);

        var rotatePoint = new cc.RotateBy(250, 360); // <- Rotate the node by 360 degrees in 5 seconds.
        var rotateForever = new cc.RepeatForever(rotatePoint); // <- Keeps the node rotating forever.
        backgroundSprite.runAction(rotateForever);
    },

    // initialize menu elements
    initUI: function() {
        var that = this;

        var playButton = new MenuTitleButton("Play!", function() {
            that.onPlay();
        }, this);

        var instructionsButton = new MenuTitleButton("How?", function() {
            that.onInstructions();
        }, this);

        var dummyLabel = new cc.MenuItemFont(" ");

        var scoresButton = new MenuTitleButton("Scores", function() {
            that.onScores();
        }, this);

        var settingsButton = new MenuTitleButton("Settings", function() {
            that.onSettings();
        }, this);

        playButton.setImageRes(res.buttonImage);
        instructionsButton.setImageRes(res.buttonImage);
        scoresButton.setImageRes(res.buttonImage);
        settingsButton.setImageRes(res.buttonImage);

        this._menu = new cc.Menu(playButton, instructionsButton, dummyLabel, settingsButton);
        this._menu.alignItemsVerticallyWithPadding(15);
        this.addChild(this._menu, 100);
    },

    // initialize game audio
    initAudio: function() {
        if(!NJ.settings.music)
            return;

        cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
        cc.audioEngine.playMusic(res.menuTrack, true);
    },

///////////////
// UI Events //
///////////////

    onPlay: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        this._jumboMenuLayer = new JumboMenuLayer();
        this._jumboMenuLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(that._jumboMenuLayer);
        });
        this.addChild(this._jumboMenuLayer, 999);
    },

    onInstructions: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        this._instructionsLayer = new InstructionsLayer();
        this._instructionsLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(that._instructionsLayer);
        });
        this.addChild(this._instructionsLayer, 999);
    },

    onScores: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        this._scoresLayer = new ScoresLayer();
        this._scoresLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(that._scoresLayer);
        });
        this.addChild(this._scoresLayer, 999);
    },

    onSettings: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);
            
        var that = this;

        cc.eventManager.pauseTarget(this, true);
        this._settingsMenuLayer = new SettingsMenuLayer();
        this._settingsMenuLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(that._settingsMenuLayer);

            if(NJ.settings.music)
                cc.audioEngine.playMusic(res.menuTrack);
        });
        this.addChild(this._settingsMenuLayer, 999);
    }
});

NumboMenuLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new NumboMenuLayer();
    scene.addChild(layer);
    return scene;
};