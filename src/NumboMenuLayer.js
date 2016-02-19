
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
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2,
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

        var playButton = this.generateTitleButton("Play!", function() {
            that.onPlay();
        });

        var instructionsButton = this.generateTitleButton("How?", function() {
            that.onInstructions();
        });

        var dummyLabel = this.generateLabel(" ");

        var scoresButton = this.generateTitleButton("Scores", function() {
            that.onScores();
        });

        var settingsButton = this.generateTitleButton("Settings", function() {
            that.onSettings();
        });

        this._menu = new cc.Menu(playButton, instructionsButton, dummyLabel, scoresButton, settingsButton);
        this._menu.alignItemsVerticallyWithPadding(15);
        this.addChild(this._menu, 100);
        this._menu.x = cc.winSize.width / 2;
        this._menu.y = cc.winSize.height / 2;
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
            cc.audioEngine.playEffect(res.tongue_click, false);

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
            cc.audioEngine.playEffect(res.tongue_click, false);

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
            cc.audioEngine.playEffect(res.tongue_click, false);

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
            cc.audioEngine.playEffect(res.tongue_click, false);
            
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
    },
    
////////////////
// UI Helpers //
////////////////

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(48);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateTitleButton: function(title, callback) {
        var normalSprite = new cc.Sprite(res.buttonImage);
        var selectedSprite = new cc.Sprite(res.buttonImage);
        var disabledSprite = new cc.Sprite(res.buttonImage);

        selectedSprite.setColor(cc.color(192, 192, 192, 255));
        disabledSprite.setColor(cc.color(64, 64, 64, 255));

        var normalLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), 32);
        normalLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: normalSprite.getContentSize().width / 2,
            y: normalSprite.getContentSize().height / 2
        });

        var selectedLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), 32);
        selectedLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: selectedSprite.getContentSize().width / 2,
            y: selectedSprite.getContentSize().height / 2
        });

        var disabledLabel = new cc.LabelTTF(title, b_getFontName(res.markerFont), 32);
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

NumboMenuLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new NumboMenuLayer();
    scene.addChild(layer);
    return scene;
};