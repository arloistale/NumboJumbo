
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

            this._initModesUI();
            this._initToolsUI();
            this._initAudio();
        },

        // init game modes buttons
        _initModesUI: function() {
            this._jumboMenu = new cc.Menu();

            this._jumboMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

            var mmButton, movButton, reButton, infButton;

            mmButton = new NJMenuButton(buttonSize, this._onChooseMinuteMadness.bind(this), this);
            mmButton.setBackgroundColor(NJ.themes.blockColors[0]);
            mmButton.setImageRes(res.playImage);
            mmButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var mmLabel = new NJMenuItem(refDim * NJ.uiSizes.sub);
            mmLabel.setTitle("Minute Madness");
            mmLabel.setLabelColor(NJ.themes.defaultLabelColor);
            mmLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            movButton = new NJMenuButton(buttonSize, this._onChooseMoves.bind(this), this);
            movButton.setBackgroundColor(NJ.themes.blockColors[1]);
            movButton.setImageRes(res.playImage);
            movButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var movLabel = new NJMenuItem(refDim * NJ.uiSizes.sub);
            movLabel.setTitle("Moves");
            movLabel.setLabelColor(NJ.themes.defaultLabelColor);
            movLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            reButton = new NJMenuButton(buttonSize, this._onChooseTurnBased.bind(this), this);
            reButton.setBackgroundColor(NJ.themes.blockColors[2]);
            reButton.setImageRes(res.playImage);
            reButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var reLabel = new NJMenuItem(refDim * NJ.uiSizes.sub);
            reLabel.setTitle("Numbers React");
            reLabel.setLabelColor(NJ.themes.defaultLabelColor);
            reLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            infButton = new NJMenuButton(buttonSize, this._onChooseSurvival.bind(this), this);
            infButton.setBackgroundColor(NJ.themes.blockColors[3]);
            infButton.setImageRes(res.playImage);
            infButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            var infLabel = new NJMenuItem(refDim * NJ.uiSizes.sub);
            infLabel.setTitle("Infinite");
            infLabel.setLabelColor(NJ.themes.defaultLabelColor);
            infLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            movButton.setPosition(-buttonSize.width / 1.5, buttonSize.height / 1.5);
            mmButton.setPosition(buttonSize.width / 1.5, buttonSize.height / 1.5);
            reButton.setPosition(-buttonSize.width / 1.5, -buttonSize.height / 1.5);
            infButton.setPosition(buttonSize.width / 1.5, -buttonSize.height / 1.5);

            movLabel.setPosition(-buttonSize.width / 1.5, 0);
            mmLabel.setPosition(buttonSize.width / 1.5, 0);
            reLabel.setPosition(-buttonSize.width / 1.5, -buttonSize.height * 1.3);
            infLabel.setPosition(buttonSize.width / 1.5, -buttonSize.height * 1.3);

            this._jumboMenu.addChild(mmButton);
            this._jumboMenu.addChild(movButton);
            this._jumboMenu.addChild(reButton);
            this._jumboMenu.addChild(infButton);

            this._jumboMenu.addChild(mmLabel);
            this._jumboMenu.addChild(movLabel);
            this._jumboMenu.addChild(reLabel);
            this._jumboMenu.addChild(infLabel);

            this.addChild(this._jumboMenu, 100);
        },

        // initialize menu elements
        _initToolsUI: function() {
            this._menu = new cc.Menu();

            var that = this;

            var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
            var buttonSize = cc.size(refDim * NJ.uiSizes.playButton, refDim * NJ.uiSizes.playButton);

            buttonSize = cc.size(refDim * NJ.uiSizes.optionButton, refDim * NJ.uiSizes.optionButton);

            var helpButton = new NJMenuButton(buttonSize, this._onHelp.bind(this), this);
            helpButton.setImageRes(res.helpImage);

            var settingsButton = new NJMenuButton(buttonSize, this._onSettings.bind(this), this);
            settingsButton.setImageRes(res.settingsImage);

            var statsButton = new NJMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
            statsButton.setImageRes(res.statsImage);

            var achievementsButton = new NJMenuButton(buttonSize, this._onAchievements.bind(this), this);
            achievementsButton.setImageRes(res.trophyImage);

            this._menu.addChild(helpButton);
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

        _onHelp: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            var scene = new cc.Scene();
            scene.addChild(new TutorialDriverLayer());
            cc.director.runScene(new cc.TransitionFade(0.5, scene));
        },

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