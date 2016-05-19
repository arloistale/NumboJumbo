
var NumboMenuLayer = (function() {

    return cc.LayerColor.extend({

        _menu: null,
        _jumboMenuLayer: null,
        _shopLayer: null,
        _settingsMenuLayer: null,

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

            this._initBackground();
            this._initUI();
            this._initAudio();
        },

        // initialize background for menu
        _initBackground: function() {
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
        },

        // initialize menu elements
        _initUI: function() {
            menu = new cc.Menu();

            var that = this;

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

            var playButton = new NJMenuButton(buttonSize, this._onPlay.bind(this), this);
            playButton.setBackgroundColor(NJ.themes.playButtonColor);
            playButton.setImageRes(res.playImage);

            buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var settingsButton = new NJMenuButton(buttonSize, this._onSettings.bind(this), this);
            settingsButton.setImageRes(res.settingsImage);

            var loginButton = new NJMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
            loginButton.setBackgroundColor(NJ.themes.loginButtonColor);
            loginButton.setImageRes(res.statsImage);

            buttonSize = cc.size(refDim * 0.75, refDim * NJ.uiSizes.textButton);

            var jumbosButton = new NJMenuButton(buttonSize, this._onJumbos.bind(this), this);
            jumbosButton.setBackgroundColor(NJ.themes.jumbosButtonColor);
            jumbosButton.setTitle("Game Modes");

            menu.addChild(playButton);

            menu.addChild(jumbosButton);
            menu.addChild(loginButton);
            menu.addChild(settingsButton);

            //var scoresButton = new NJMenuButton(buttonSize, onScores.bind(this), this);
            //scoresButton.setImageRes(res.buttonImage);
            //menu.addChild(scoresButton);
            /*
             var shopButton = new NJMenuButton("Jumbos", onShop.bind(this), this);
             shopButton.setImageRes(res.buttonImage);
             menu.addChild(shopButton);
             */

            menu.alignItemsInColumns(1, 1, 2);

            this.addChild(menu, 100);
        },

        // initialize game audio
        _initAudio: function() {
            if(!NJ.settings.music)
                return;

            cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
            cc.audioEngine.playMusic(res.menuTrack, true);
        },

        ///////////////
        // UI Events //
        ///////////////

        _onPlay: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            var that = this;

            cc.eventManager.pauseTarget(this, true);
            cc.LoaderScene.preload(g_game, function () {
                cc.audioEngine.stopMusic();
                cc.audioEngine.stopAllEffects();

                var scene = new cc.Scene();
                scene.addChild(new MinuteMadnessLayer());
                cc.director.runScene(new cc.TransitionFade(0.5, scene));
            }, this);
        },

        _onJumbos: function() {
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

        _onLeaderboard: function() {
             if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

             NJ.social.showLeaderboard();
        },

        _onShop: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            var that = this;

            cc.eventManager.pauseTarget(this, true);
            this._shopLayer = new ShopMenuLayer();
            this._shopLayer.setOnCloseCallback(function() {
                cc.eventManager.resumeTarget(that, true);
                that.removeChild(that._shopLayer);
            });
            this.addChild(this._shopLayer, 999);
        },

        _onSettings: function() {
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
}());