
var NumboMenuLayer = (function() {

    var menu = null;
    var jumboMenuLayer = null;
    var instructionsLayer = null;
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

        var rotatePoint = new cc.RotateBy(250, 360); // <- Rotate the node by 360 degrees in 5 seconds.
        var rotateForever = new cc.RepeatForever(rotatePoint); // <- Keeps the node rotating forever.
        //backgroundSprite.runAction(rotateForever);
    };

    // initialize menu elements
    var initUI = function() {
        menu = new cc.Menu();

        var that = this;

        var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
        var buttonSize = cc.size(refDim * NJ.buttonSizes.play, refDim * NJ.buttonSizes.play);

        var playButton = new NJButton(buttonSize, onPlay.bind(this), this);
        playButton.setImageRes(res.playImage);
        menu.addChild(playButton);

        buttonSize = cc.size(refDim * NJ.buttonSizes.opt, refDim * NJ.buttonSizes.opt);

        var instructionsButton = new NJButton(buttonSize, onInstructions.bind(this), this);
        instructionsButton.setImageRes(res.buttonImage);
        menu.addChild(instructionsButton);

        loginButton = new NJButton(buttonSize, onLogin.bind(this), this);
        loginButton.setImageRes(res.buttonImage);
        toggleLoginButton();

        menu.addChild(loginButton);

        var scoresButton = new NJButton(buttonSize, onScores.bind(this), this);
        scoresButton.setImageRes(res.buttonImage);
        //menu.addChild(scoresButton);
/*
        var shopButton = new NJButton("Jumbos", onShop.bind(this), this);
        shopButton.setImageRes(res.buttonImage);
        menu.addChild(shopButton);
*/
        var settingsButton = new NJButton(buttonSize, onSettings.bind(this), this);
        settingsButton.setImageRes(res.buttonImage);
        menu.addChild(settingsButton);

        menu.alignItemsVerticallyWithPadding(15);

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
        jumboMenuLayer = new JumboMenuLayer();
        jumboMenuLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(jumboMenuLayer);
        });
        this.addChild(jumboMenuLayer, 999);
    };

    var onInstructions = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        var that = this;

        cc.eventManager.pauseTarget(this, true);
        instructionsLayer = new InstructionsLayer();
        instructionsLayer.setOnCloseCallback(function() {
            cc.eventManager.resumeTarget(that, true);
            that.removeChild(instructionsLayer);
        });
        this.addChild(instructionsLayer, 999);
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
            loginButton.setTitle("Logout");
            loginButton.setCallback(onLogout.bind(this), this);
        } else {
            loginButton.setTitle("Connect");
            loginButton.setCallback(onLogin.bind(this), this);
        }
    };

    return cc.LayerColor.extend({

        ////////////////////
        // Initialization //
        ////////////////////

        ctor: function () {
            this._super();

            this.init(cc.color("#000000"));

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