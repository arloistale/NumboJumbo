
var NumboMenuLayer = (function() {

    return cc.LayerColor.extend({

        _menu: null,
        _jumboMenu: null,
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

            this._initModesUI();
            this._initToolsUI();
            this._initAudio();
        },

        // init game modes buttons
        _initModesUI: function() {
            this._jumboMenu = new cc.Menu();

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

            var mmButton, movButton, reButton, infButton;

            mmButton = new NJMenuButton(buttonSize, this._onChooseMinuteMadness.bind(this), this);
            mmButton.setBackgroundColor(NJ.themes.blockColors[0]);
            mmButton.setImageRes(res.playImage);

            movButton = new NJMenuButton(buttonSize, this._onChooseMoves.bind(this), this);
            movButton.setBackgroundColor(NJ.themes.blockColors[1]);
            movButton.setImageRes(res.playImage);

            reButton = new NJMenuButton(buttonSize, this._onChooseTurnBased.bind(this), this);
            reButton.setBackgroundColor(NJ.themes.blockColors[2]);
            reButton.setImageRes(res.playImage);

            infButton = new NJMenuButton(buttonSize, this._onChooseSurvival.bind(this), this);
            infButton.setBackgroundColor(NJ.themes.blockColors[3]);
            infButton.setImageRes(res.playImage);

            this._jumboMenu.addChild(mmButton);
            this._jumboMenu.addChild(movButton);
            this._jumboMenu.addChild(reButton);
            this._jumboMenu.addChild(infButton);

            this._jumboMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._jumboMenu.alignItemsInColumns(2, 2);

            this.addChild(this._jumboMenu, 100);
        },

        // initialize menu elements
        _initToolsUI: function() {
            this._menu = new cc.Menu();

            var that = this;

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

            buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var settingsButton = new NJMenuButton(buttonSize, this._onSettings.bind(this), this);
            settingsButton.setImageRes(res.settingsImage);

            var statsButton = new NJMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
            statsButton.setImageRes(res.statsImage);

            var achievementsButton = new NJMenuButton(buttonSize, this._onAchievements.bind(this), this);
            achievementsButton.setImageRes(res.trophyImage);

            this._menu.addChild(achievementsButton);
            this._menu.addChild(statsButton);
            this._menu.addChild(settingsButton);

            /*
             var shopButton = new NJMenuButton("Jumbos", onShop.bind(this), this);
             shopButton.setImageRes(res.buttonImage);
             menu.addChild(shopButton);
             */

            this._menu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._menu, 100);

            this._menu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.bottom.y + statsButton.getContentSize().height * 1.5 / 2
            });

            if(!NJ.social.isLoggedIn()) {
                NJ.social.login();
            }
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

        // game modes

        _onChooseMinuteMadness: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new MinuteMadnessLayer());
            cc.director.runScene(scene);
        },

        _onChooseMoves: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new MovesLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        },

        _onChooseTurnBased: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new TurnBasedFillUpGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        },

        _onChooseSurvival: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new SurvivalGameLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        },

        // tools

        _onLeaderboard: function() {
             if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

             NJ.social.showLeaderboard();
        },

        _onAchievements: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            NJ.social.showAchievements();
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