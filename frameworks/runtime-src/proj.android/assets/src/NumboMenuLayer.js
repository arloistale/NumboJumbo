
var NumboMenuLayer = (function() {

    return cc.LayerColor.extend({

        _headerMenu: null,
        _jumboMenu: null,
        _toolMenu: null,

        _shopLayer: null,
        _settingsMenuLayer: null,

        ////////////////////
        // Initialization //
        ////////////////////

        ctor: function () {
            this._super();

            this.init(NJ.themes.backgroundColor);

            this._initHeaderUI();
            this._initModesUI();
            this._initToolsUI();

            this._initAudio();

            this.enter();
        },

        _initHeaderUI: function() {
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var logo = new NJMenuItem(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            logo.setImageRes(res.logoImage);
            var logoSize = logo.getContentSize();
            var rawSize = logo.getRawImageSize();
            logo.setImageSize(cc.size(logoSize.height * rawSize.width / rawSize.height, logoSize.height));
            logo.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._headerMenu.addChild(logo);

            this.addChild(this._headerMenu);
        },

        // init game modes buttons
        _initModesUI: function() {
            this._jumboMenu = new cc.Menu();

            this._jumboMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._jumboMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.left.x - this._jumboMenu.getContentSize().width / 2
            });

            var buttonSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton));
            var titleSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2);

            var mmButton, movButton, reButton, infButton;

            mmButton = new NJMenuButton(buttonSize, this._onChooseMinuteMadness.bind(this), this);
            mmButton.setBackgroundColor(NJ.themes.blockColors[0]);
            mmButton.setLabelTitle("Timed");
            mmButton.setLabelSize(titleSize);
            mmButton.setImageRes(res.playImage);
            mmButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            movButton = new NJMenuButton(buttonSize, this._onChooseMoves.bind(this), this);
            movButton.setBackgroundColor(NJ.themes.blockColors[1]);
            movButton.setLabelTitle("Moves");
            movButton.setLabelSize(titleSize);
            movButton.setImageRes(res.playImage);
            movButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            reButton = new NJMenuButton(buttonSize, this._onChooseTurnBased.bind(this), this);
            reButton.setBackgroundColor(NJ.themes.blockColors[2]);
            reButton.setLabelTitle("Tower");
            reButton.setLabelSize(titleSize);
            reButton.setImageRes(res.playImage);
            reButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            infButton = new NJMenuButton(buttonSize, this._onChooseSurvival.bind(this), this);
            infButton.setBackgroundColor(NJ.themes.blockColors[3]);
            infButton.setLabelTitle("Infinite");
            infButton.setLabelSize(titleSize);
            infButton.setImageRes(res.playImage);
            infButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            movButton.setPosition(-buttonSize.width * 0.9, buttonSize.height * 0.9);
            mmButton.setPosition(buttonSize.width * 0.9, buttonSize.height * 0.9);
            reButton.setPosition(-buttonSize.width * 0.9, -buttonSize.height * 0.9);
            infButton.setPosition(buttonSize.width * 0.9, -buttonSize.height * 0.9);

            movButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            mmButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            reButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            infButton.offsetLabel(cc.p(0, -buttonSize.height / 1.5));

            this._jumboMenu.addChild(mmButton);
            this._jumboMenu.addChild(movButton);
            this._jumboMenu.addChild(reButton);
            this._jumboMenu.addChild(infButton);

            this.addChild(this._jumboMenu, 100);
        },

        // initialize menu elements
        _initToolsUI: function() {
            this._toolMenu = new cc.Menu();
            this._toolMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar));
            var toolSize = this._toolMenu.getContentSize();
            this._toolMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.bottom.y - toolSize.height / 2
            });

            var that = this;

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var helpButton = new NJMenuButton(buttonSize, this._onHelp.bind(this), this);
            helpButton.setImageRes(res.helpImage);

            var settingsButton = new NJMenuButton(buttonSize, this._onSettings.bind(this), this);
            settingsButton.setImageRes(res.settingsImage);

            var statsButton = new NJMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
            statsButton.setImageRes(res.statsImage);

            var achievementsButton = new NJMenuButton(buttonSize, this._onAchievements.bind(this), this);
            achievementsButton.setImageRes(res.trophyImage);

            this._toolMenu.addChild(helpButton);
            this._toolMenu.addChild(achievementsButton);
            this._toolMenu.addChild(statsButton);
            this._toolMenu.addChild(settingsButton);

            /*
             var shopButton = new NJMenuButton("Jumbos", onShop.bind(this), this);
             shopButton.setImageRes(res.buttonImage);
             menu.addChild(shopButton);
             */

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);

            if(!NJ.social.isLoggedIn()) {
                NJ.social.login();
            }
        },

        // initialize game audio
        _initAudio: function() {
            if(!NJ.settings.music)
                return;

            cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
            cc.audioEngine.playMusic(res.trackPadMellow, true);
        },

        // makes menu elements transition in
        enter: function() {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._jumboMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(cc.easeBackOut()));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._jumboMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._jumboMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.left.x - contentSize.width / 2, cc.visibleRect.center.y)).easing(cc.easeBackOut()));

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                if(callback)
                    callback();
            })));
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

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new MinuteMadnessLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseMoves: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new MovesLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseTurnBased: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new TurnBasedFillUpGameLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseSurvival: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new SurvivalGameLayer());
                cc.director.runScene(scene);
            });
        },

        // tools

        _onHelp: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            cc.eventManager.pauseTarget(this, true);

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new TutorialDriverLayer());
                cc.director.runScene(scene);
            });
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
            this.leave(function() {
                that._settingsMenuLayer = new SettingsMenuLayer();
                that._settingsMenuLayer.setOnCloseCallback(function() {
                    cc.eventManager.resumeTarget(that, true);
                    that.removeChild(that._settingsMenuLayer);

                    that.enter();

                    if(NJ.settings.music && !cc.audioEngine.isMusicPlaying())
                        cc.audioEngine.playMusic(res.trackPadMellow);
                });

                that.addChild(that._settingsMenuLayer, 999);
            });
        }
    });
}());