
var NumboMenuLayer = (function() {

    var menu = null;
    var jumboMenuLayer = null;
    var scoresLayer = null;
    var shopLayer = null;
    var settingsMenuLayer = null;

    var loginButton = null;

    //////////////////////////
    // Extra Initialization //
    //////////////////////////

    // initialize background for menu
    var initBackground = function() {
        /*
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
        */
    };

    // initialize menu elements
    var initUI = function() {
        menu = new cc.Menu();

        var that = this;

        var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
        var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

        var playButton = new NJMenuItem(buttonSize, onPlay.bind(this), this);
        playButton.setBackgroundColor(NJ.themes.playButtonColor);
        playButton.setImageRes(res.playImage);

        buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

        var settingsButton = new NJMenuItem(buttonSize, onSettings.bind(this), this);
        settingsButton.setImageRes(res.settingsImage);

        loginButton = new NJMenuItem(buttonSize, onLogin.bind(this), this);
        loginButton.setBackgroundColor(NJ.themes.loginButtonColor);
        loginButton.setImageRes(res.statsImage);
        toggleLoginButton();

        buttonSize = cc.size(refDim * 0.75, refDim * NJ.uiSizes.textButton);

        var jumbosButton = new NJMenuItem(buttonSize, onJumbos.bind(this), this);
        jumbosButton.setBackgroundColor(NJ.themes.jumbosButtonColor);
        jumbosButton.setTitle("Jumbos");

        menu.addChild(playButton);

        menu.addChild(jumbosButton);
        menu.addChild(loginButton);
        menu.addChild(settingsButton);

        //var scoresButton = new NJMenuItem(buttonSize, onScores.bind(this), this);
        //scoresButton.setImageRes(res.buttonImage);
        //menu.addChild(scoresButton);
/*
        var shopButton = new NJMenuItem("Jumbos", onShop.bind(this), this);
        shopButton.setImageRes(res.buttonImage);
        menu.addChild(shopButton);
*/

        menu.alignItemsInColumns(1, 1, 2);

        this.addChild(menu, 100);
    };

    // initialize game audio
    var initAudio = function() {
        if(!NJ.settings.music)
            return;

        cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
        cc.audioEngine.playMusic(res.menuTrack, true);
    };

    ///////////////
    // UI Events //
    ///////////////

    var onPlay = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        cc.LoaderScene.preload(g_game, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            // Init stats data.
            NJ.gameState.chooseJumbo("basic");

            var scene = new cc.Scene();
            scene.addChild(new NumboGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        }, this);
    };

    var onJumbos = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        jumboMenuLayer = new JumboMenuLayer();
        jumboMenuLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(jumboMenuLayer);
        });
        this.addChild(jumboMenuLayer, 999);
    };

    var onLogin = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        NJ.social.facebookLogin(function(error, user) {
            cc.log("Logged in successfully: " + user);

            toggleLoginButton();
        });
    };

    var onLogout = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        NJ.social.facebookLogout();
        toggleLoginButton();
    };

    var onScores = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        scoresLayer = new ScoresLayer();
        scoresLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(scoresLayer);
        });
        this.addChild(scoresLayer, 999);
    };

    var onShop = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        shopLayer = new ShopMenuLayer();
        shopLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(shopLayer);
        });
        this.addChild(shopLayer, 999);
    };

    var onSettings = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        settingsMenuLayer = new SettingsMenuLayer();
        settingsMenuLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(settingsMenuLayer);

            if(NJ.settings.music)
                cc.audioEngine.playMusic(res.menuTrack);
        });

        this.addChild(settingsMenuLayer, 999);
    };

    ////////////////
    // UI Helpers //
    ////////////////

    // toggles login based on whether user is currently connected to facebook
    var toggleLoginButton = function() {
        if(NJ.social.isLoggedIn()) {
            loginButton.setCallback(onLogout.bind(this), this);
        } else {
            loginButton.setCallback(onLogin.bind(this), this);
        }
    };

    return cc.LayerColor.extend({

        ////////////////////
        // Initialization //
        ////////////////////

        ctor: function () {
            this._super();

            this.init(NJ.themes.backgroundColor);

            /*
             var sp = new cc.Sprite(res.loading_png);
             sp.anchorX = 0;
             sp.anchorY = 0;
             sp.scale = NJ.SCALE;
             this.addChild(sp, 0, 1);
             */

            initBackground.bind(this)();
            initUI.bind(this)();
            initAudio.bind(this)();
        }
    });
}());

NumboMenuLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new NumboMenuLayer();
    scene.addChild(layer);
    return scene;
};