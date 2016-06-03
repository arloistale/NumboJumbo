
var NumboMenuLayer = (function() {

    return cc.LayerColor.extend({

        // Menu Data
        _headerMenu: null,
        _jumboMenu: null,
        _toolMenu: null,

        // Buttons Data
        _achievementsButton: null,
        _statsButton: null,
        _loginButton: null,
        _settingsButton: null,

        // Mode Buttons Data
        _modeData: {
            mm: {
                button: null,
                startPos: null,
                endPos: null
            },

            mov: {
                button: null,
                startPos: null,
                endPos: null
            },

            re: {
                button: null,
                startPos: null,
                endPos: null
            },

            inf: {
                button: null,
                startPos: null,
                endPos: null
            }
        },

        _settingsMenuLayer: null,

        ////////////////////
        // Initialization //
        ////////////////////

        ctor: function () {
            this._super();

            NJ.themes.toggle(NJ.settings.vibration ? 0 : 1);
            this.init(NJ.themes.backgroundColor);

            this._initHeaderUI();
            this._initModesUI();
            this._initToolsUI();

            this._updateTheme();

            this._initAudio();

            this.enter();
        },

        onExit: function() {
            this._super();

            this._settingsButton.release();
            this._achievementsButton.release();
            this._loginButton.release();
            this._statsButton.release();
        },

        _initHeaderUI: function() {
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar * 2));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
            });

            var logo = new NJMenuItem(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar * 2));
            logo.setImageRes(res.logoImage);
            var logoSize = logo.getContentSize();
            var rawSize = logo.getRawImageSize();
            logo.setImageSize(cc.size(logoSize.height * rawSize.width / rawSize.height, logoSize.height));
            logo.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._headerMenu.addChild(logo);

            this._headerMenu.alignItemsHorizontally();

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
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y * 0.95
            });

            var buttonSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton));
            var titleSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2);

            this._modeData.mm.button = new NJMenuButton(buttonSize, this._onChooseMinuteMadness.bind(this), this);
            this._modeData.mm.button.setBackgroundColor(NJ.themes.blockColors[0]);
            this._modeData.mm.button.setLabelTitle(NJ.modeNames[NJ.modekeys.minuteMadness]);
            this._modeData.mm.button.setLabelSize(titleSize);
            this._modeData.mm.button.setImageRes(res.timedImage);
            this._modeData.mm.button.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._modeData.mov.button = new NJMenuButton(buttonSize, this._onChooseMoves.bind(this), this);
            this._modeData.mov.button.setBackgroundColor(NJ.themes.blockColors[1]);
            this._modeData.mov.button.setLabelTitle(NJ.modeNames[NJ.modekeys.moves]);
            this._modeData.mov.button.setLabelSize(titleSize);
            this._modeData.mov.button.setImageRes(res.movesImage);
            this._modeData.mov.button.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._modeData.re.button = new NJMenuButton(buttonSize, this._onChooseTurnBased.bind(this), this);
            this._modeData.re.button.setBackgroundColor(NJ.themes.blockColors[2]);
            this._modeData.re.button.setLabelTitle(NJ.modeNames[NJ.modekeys.react]);
            this._modeData.re.button.setLabelSize(titleSize);
            this._modeData.re.button.setImageRes(res.stackImage);
            this._modeData.re.button.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._modeData.inf.button = new NJMenuButton(buttonSize, this._onChooseSurvival.bind(this), this);
            this._modeData.inf.button.setBackgroundColor(NJ.themes.blockColors[3]);
            this._modeData.inf.button.setLabelTitle(NJ.modeNames[NJ.modekeys.infinite]);
            this._modeData.inf.button.setLabelSize(titleSize);
            this._modeData.inf.button.setImageRes(res.infiniteImage);
            this._modeData.inf.button.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._modeData.mov.startPos = cc.p(cc.visibleRect.width / 2 + buttonSize.width * 0.85, buttonSize.height * 0.85);
            this._modeData.mm.startPos = cc.p(-cc.visibleRect.width / 2 - buttonSize.width * 0.85, buttonSize.height * 0.85);
            this._modeData.re.startPos = cc.p(-cc.visibleRect.width / 2 - buttonSize.width * 0.85, -buttonSize.height * 0.85);
            this._modeData.inf.startPos = cc.p(cc.visibleRect.width / 2 + buttonSize.width * 0.85, -buttonSize.height * 0.85);

            this._modeData.mov.endPos = cc.p(buttonSize.width * 0.85, buttonSize.height * 0.85);
            this._modeData.mm.endPos = cc.p(-buttonSize.width * 0.85, buttonSize.height * 0.85);
            this._modeData.re.endPos = cc.p(-buttonSize.width * 0.85, -buttonSize.height * 0.85);
            this._modeData.inf.endPos = cc.p(buttonSize.width * 0.85, -buttonSize.height * 0.85);

            this._modeData.mov.button.setPosition(this._modeData.mov.startPos);
            this._modeData.mm.button.setPosition(this._modeData.mm.startPos);
            this._modeData.re.button.setPosition(this._modeData.re.startPos);
            this._modeData.inf.button.setPosition(this._modeData.inf.startPos);

            this._modeData.mov.button.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            this._modeData.mm.button.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            this._modeData.re.button.offsetLabel(cc.p(0, -buttonSize.height / 1.5));
            this._modeData.inf.button.offsetLabel(cc.p(0, -buttonSize.height / 1.5));

            this._jumboMenu.addChild(this._modeData.mm.button);
            this._jumboMenu.addChild(this._modeData.mov.button);
            this._jumboMenu.addChild(this._modeData.re.button);
            this._jumboMenu.addChild(this._modeData.inf.button);

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

            this._settingsButton = new NJMenuButton(buttonSize, this._onSettings.bind(this), this);
            this._settingsButton.setImageRes(res.settingsImage);
            this._settingsButton.retain();

            this._statsButton = new NJMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
            this._statsButton.setImageRes(res.statsImage);
            this._statsButton.retain();

            this._achievementsButton = new NJMenuButton(buttonSize, this._onAchievements.bind(this), this);
            this._achievementsButton.setImageRes(res.trophyImage);
            this._achievementsButton.retain();

            this._loginButton = new NJMenuButton(buttonSize, function() {
                if(!NJ.social.isLoggedIn()) {
                    NJ.social.login();
                } else {
                    cc.log("Warning: tried to login when already login!");
                }
            }, this);
            this._loginButton.setImageRes(res.loginImage);
            this._loginButton.retain();

            this._toolMenu.addChild(helpButton);

            if(cc.sys.isNative) {
                if (NJ.social.isLoggedIn()) {
                    this._toolMenu.addChild(this._achievementsButton);
                    this._toolMenu.addChild(this._statsButton);
                } else {
                    if (cc.sys.os == cc.sys.OS_IOS) {
                        NJ.social.login();

                        NJ.social.setListener({
                            onConnectionStatusChanged: function (status) {
                                cc.log("Connection status changed");
                                cc.log(status);

                                switch (status) {
                                    case 1000:
                                        that.leaveTools(function () {
                                            that._toolMenu.removeChild(that._settingsButton);

                                            that._toolMenu.addChild(that._achievementsButton);
                                            that._toolMenu.addChild(that._statsButton);
                                            that._toolMenu.addChild(that._settingsButton);

                                            that._toolMenu.alignItemsHorizontallyWithPadding(10);

                                            that.enterTools();
                                        });
                                        break;
                                }
                            }
                        });
                    } else {
                        this._toolMenu.addChild(this._loginButton);

                        NJ.social.setListener({
                            onConnectionStatusChanged: function (status) {
                                cc.log("Connection status changed");
                                cc.log(status);

                                switch (status) {
                                    case 1000:
                                        that.leaveTools(function () {
                                            that._toolMenu.removeChild(that._settingsButton);
                                            that._toolMenu.removeChild(that._loginButton);

                                            that._toolMenu.addChild(that._achievementsButton);
                                            that._toolMenu.addChild(that._statsButton);
                                            that._toolMenu.addChild(that._settingsButton);

                                            that._toolMenu.alignItemsHorizontallyWithPadding(10);

                                            that.enterTools();
                                        });
                                        break;
                                }
                            }
                        });
                    }
                }
            }

            this._toolMenu.addChild(this._settingsButton);

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        // initialize game audio
        _initAudio: function() {
            if(!NJ.settings.music)
                return;

            cc.audioEngine.setMusicVolume(NJ.MUSIC_VOLUME);
            cc.audioEngine.playMusic(res.trackChill2, true);
        },

        // makes menu elements transition in
        enter: function() {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
            this.enterTools();

            var data;
            var delay = 0.4;
            for(var key in this._modeData) {
                if(!this._modeData.hasOwnProperty(key))
                    continue;

                data = this._modeData[key];

                data.button.runAction(cc.moveTo(delay, data.endPos).easing(easing));

                delay += 0.075;
            }
        },

        enterTools: function() {
            var easing = cc.easeBackOut();
            var toolSize = this._toolMenu.getContentSize();

            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
            this.leaveTools();

            var data;
            for(var key in this._modeData) {
                if(!this._modeData.hasOwnProperty(key))
                    continue;

                data = this._modeData[key];

                data.button.runAction(cc.moveTo(0.4, data.startPos).easing(easing));
            }

            if(callback) {
                this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function () {
                    callback();
                })));
            }
        },

        leaveTools: function(callback) {
            var toolSize = this._toolMenu.getContentSize();

            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(cc.easeBackOut()));

            if(callback) {
                this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function () {
                    callback();
                })));
            }
        },

        ///////////////
        // UI Events //
        ///////////////

        // game modes

        _onChooseMinuteMadness: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new TimedGameLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseMoves: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new MovesGameLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseTurnBased: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new StackGameLayer());
                cc.director.runScene(scene);
            });
        },

        _onChooseSurvival: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new InfiniteGameLayer());
                cc.director.runScene(scene);
            });
        },

        // tools

        _onHelp: function() {
            if(NJ.settings.sounds)
                cc.audioEngine.playEffect(res.clickSound, false);

            cc.audioEngine.stopMusic();
            cc.eventManager.pauseTarget(this, true);

            this.leave(function() {
                var scene = new cc.Scene();
                scene.addChild(new TutorialDriverLayer(true));
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
                        cc.audioEngine.playMusic(res.trackChill2);

                    that._updateTheme();
                });

                that.addChild(that._settingsMenuLayer, 999);
            });
        },

        _updateTheme: function() {
            this.setColor(NJ.themes.backgroundColor);

            var index = 0;

            for(var key in this._modeData) {
                if(!this._modeData.hasOwnProperty(key))
                    continue;

                this._modeData[key].button.setBackgroundColor(NJ.themes.blockColors[index]);
                this._modeData[key].button.setLabelColor(NJ.themes.defaultLabelColor);

                index++;
            }
        }
    });
}());