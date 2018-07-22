
var NumboMenuLayer = BaseMenuLayer.extend({

    // Menu Data
    _jumboMenu: null,

    // Buttons Data
    _achievementsButton: null,
    _statsButton: null,
    _loginButton: null,
    _settingsButton: null,
    _shopButton: null,

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
    
    _token: null,

    ////////////////////
    // Initialization //
    ////////////////////

    ctor: function () {
        this._super();

        // promo listeners are initialized on menu once
        this._initPromoListeners();
        this._initModesUI();
        this._initAudio();

        this._updateTheme();

        // we init non critical modules here to give
        // a long buffer for loading
        // not a very elegant solution but necessary
        NJ.purchases.initCampaigns();
        
        this._checkLogin();

/*
        NJ.settings.hasLoadedMM = false;
        NJ.settings.hasLoadedMOV = false;
        NJ.settings.hasLoadedRE = false;
        NJ.settings.hasLoadedINF = false;
        NJ.saveSettings();
*/
        this.enter();
    },

    onExit: function() {
        if(this._shopMenuLayer)
            this._shopMenuLayer.release();

        this._shopButton.release();
        this._settingsButton.release();
        this._achievementsButton.release();
        this._loginButton.release();
        this._statsButton.release();

        this._super();
    },
    
    
    
    sendValidateRequest: function(options) {
    	var http = new XMLHttpRequest();
    	var request_url = "https://memtechlabs.com/";
    	
    	var params = '';
    	if(options.params) {
    		for(var key in options.params) {
    			params += '&' + key + '=' + options.params[key];
    			cc.log(params);
    		}
    	}
    	
    	http.open("POST", request_url+options.url, true);
    	//http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	http.setRequestHeader("Authorization", "Bearer "+this._token);
    	
    	http.onreadystatechange = function() {
    		var httpStatus = http.statusText;
    		//cc.log("A");
    		//cc.log(httpStatus);
    		if(http.responseText) {
    			var responseJSON = eval('('+http.responseText+')');
    			//cc.log("B");
    			cc.log(http.responseText);
    			cc.log(responseJSON);
    			
    			this.sendPostRequest({"url":"wp-json/jwt-auth/v1/token/validate"});
    			
    		} else {
    			var responseJSON = {};
    			//cc.log("No response");
    		}
    		
    			//cc.log("readyState");
    			//cc.log(http);
    		switch(http.readyState) {
    			case 4:
    				if(options.success) {
    					cc.log("C");
    					//cc.log(responseJSON);
    					options.success(responseJSON);
    				}
    		}
    	};
    	//params = {"username":"sampleuser@memtechlabs.com", "password":"@8Wj(ngHJO0ST0NfJ*tei5MK"};
    	//cc.log(params);
    	http.send()
    	//http.send(params);
    },
    
    sendPostRequest: function(options) {
    	var http = new XMLHttpRequest();
    	var request_url = "https://memtechlabs.com/";
    	
    	var params = '';
    	if(options.params) {
    		for(var key in options.params) {
    			params += '&' + key + '=' + options.params[key];
    			cc.log(params);
    		}
    	}
    	
    	http.open("POST", request_url+options.url, true);
    	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	//http.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbWVtdGVjaGxhYnMuY29tIiwiaWF0IjoxNTMxODM0MjM1LCJuYmYiOjE1MzE4MzQyMzUsImV4cCI6MTUzMjQzOTAzNSwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiNSJ9fX0.OOYDF2K8i2xSIjg6Orc1kkf2smqsyEsB-gOm9bYq8DM");
    	
    	http.onreadystatechange = function() {
    		var httpStatus = http.statusText;
    		//cc.log("A");
    		//cc.log(httpStatus);
    		if(http.responseText) {
    			var responseJSON = eval('('+http.responseText+')');
    			//cc.log("B");
    			cc.log(http.responseText);
    			//this._token = responseJSON.token;
    			//cc.log(this._token);
    			cc.log(responseJSON);
    			NJ.validateToken({"url":"wp-json/jwt-auth/v1/token/validate"}, responseJSON.token);
    			
    		} else {
    			var responseJSON = {};
    			//cc.log("No response");
    		}
    		
    			//cc.log("readyState");
    			//cc.log(http);
    		switch(http.readyState) {
    			case 4:
    				if(options.success) {
    					cc.log("C");
    					//cc.log(responseJSON);
    					options.success(responseJSON);
    				}
    		}
    	};
    	//params = {"username":"sampleuser@memtechlabs.com", "password":"@8Wj(ngHJO0ST0NfJ*tei5MK"};
    	//cc.log(params);
    	http.send(params.substr(1))
    	//http.send(params);
    },
    
    _checkLogin: function() {
    	this.sendPostRequest({"url":"wp-json/jwt-auth/v1/token/", "params":{"username":"sampleuser@memtechlabs.com", "password":"@8Wj(ngHJO0ST0NfJ*tei5MK"}});
		//this.sendPostRequest({"url":"wp-json/jwt-auth/v1/token/validate"});
    },

    _initPromoListeners: function() {
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "batch_unlock_feature",
            callback: function(event) {

            }
        }), 1001);
    },

    _initHeaderUI: function() {
        this._super();

        var logo = new NumboMenuItem(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
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
    },

    // init game modes buttons
    _initModesUI: function() {
        var that = this;

        this._jumboMenu = new cc.Menu();

        this._jumboMenu.setContentSize(cc.size(cc.visibleRect.width,
            (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

        this._jumboMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y
        });

        var buttonSize = cc.size(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton), NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.playButton));
        var titleSize = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2);

        this._modeData.mm.button = new NumboMenuButton(buttonSize, function() {
            that._onChooseGameMode(NJ.modekeys.minuteMadness);
        }, this);
        this._modeData.mm.button.setBackgroundColor(NJ.themes.blockColors[0]);
        //this._modeData.mm.button.setLabelTitle(NJ.modeNames[NJ.modekeys.minuteMadness]);
        this._modeData.mm.button.setLabelTitle("BARF");
        this._modeData.mm.button.setLabelSize(titleSize);
        this._modeData.mm.button.setImageRes(res.timedImage);
        this._modeData.mm.button.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });

        this._modeData.mov.button = new NumboMenuButton(buttonSize, function() {
            that._onChooseGameMode(NJ.modekeys.moves);
        }, this);
        this._modeData.mov.button.setBackgroundColor(NJ.themes.blockColors[1]);
        this._modeData.mov.button.setLabelTitle(NJ.modeNames[NJ.modekeys.moves]);
        this._modeData.mov.button.setLabelSize(titleSize);
        this._modeData.mov.button.setImageRes(res.movesImage);
        this._modeData.mov.button.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });

        this._modeData.re.button = new NumboMenuButton(buttonSize, function() {
            that._onChooseGameMode(NJ.modekeys.react);
        }, this);
        this._modeData.re.button.setBackgroundColor(NJ.themes.blockColors[2]);
        this._modeData.re.button.setLabelTitle(NJ.modeNames[NJ.modekeys.react]);
        this._modeData.re.button.setLabelSize(titleSize);
        this._modeData.re.button.setImageRes(res.stackImage);
        this._modeData.re.button.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });

        this._modeData.inf.button = new NumboMenuButton(buttonSize, function() {
            that._onChooseGameMode(NJ.modekeys.infinite);
        }, this);
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
    _initToolUI: function() {
        this._super();

        var toolSize = this._toolMenu.getContentSize();

        var that = this;

        var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

        var helpButton = new NumboMenuButton(buttonSize, this._onHelp.bind(this), this);
        helpButton.setImageRes(res.helpImage);

        this._shopButton = new NumboMenuButton(buttonSize, this._onShop.bind(this), this);
        this._shopButton.setImageRes(res.shopImage);
        this._shopButton.retain();

        this._settingsButton = new NumboMenuButton(buttonSize, this._onSettings.bind(this), this);
        this._settingsButton.setImageRes(res.settingsImage);
        this._settingsButton.retain();

        this._statsButton = new NumboMenuButton(buttonSize, this._onLeaderboard.bind(this), this);
        this._statsButton.setImageRes(res.statsImage);
        this._statsButton.retain();

        this._achievementsButton = new NumboMenuButton(buttonSize, this._onAchievements.bind(this), this);
        this._achievementsButton.setImageRes(res.trophyImage);
        this._achievementsButton.retain();

        this._loginButton = new NumboMenuButton(buttonSize, this._onLogin.bind(this), this);
        this._loginButton.setImageRes(res.loginImage);
        this._loginButton.retain();

        this._toolMenu.addChild(helpButton);

        if(cc.sys.isNative) {
            this._toolMenu.addChild(this._achievementsButton);
            this._toolMenu.addChild(this._statsButton);
        }

        this._toolMenu.addChild(this._shopButton);

        this._toolMenu.addChild(this._settingsButton);

        this._toolMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));
    },

    // initialize game audio
    _initAudio: function() {
        if(!NJ.settings.music)
            return;

        NJ.audio.playMusic(res.trackChill2);
    },

    // makes menu elements transition in
    enter: function() {
        this._super();

        var that = this;

        var easing = cc.easeBackOut();

        this.runAction(cc.sequence(cc.delayTime(0.7), cc.callFunc(function() {
            if(cc.sys.isNative) {
                if(NJ.purchases.campaignName) {
                    that._displayCampaignPopOver(function() {
                        // now try to login
                        if (!NJ.social.isLoggedIn() && !NJ.settings.hasAttemptedAutoSignin) {
                            NJ.settings.hasAttemptedAutoSignin = true;
                            NJ.social.login();
                        }
                    });
                } else {
                    // now try to login
                    if (!NJ.social.isLoggedIn() && !NJ.settings.hasAttemptedAutoSignin) {
                        NJ.settings.hasAttemptedAutoSignin = true;
                        NJ.social.login();
                    }
                }
            }
        })));

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

    // transition out
    leave: function(callback) {
        this._super(callback);

        var easing = cc.easeBackOut();

        var data;
        for(var key in this._modeData) {
            if(!this._modeData.hasOwnProperty(key))
                continue;

            data = this._modeData[key];

            data.button.runAction(cc.moveTo(0.4, data.startPos).easing(easing));
        }
    },

    ///////////////
    // UI Events //
    ///////////////

    _onBack: function() {
        this._super();

        cc.director.end();
    },

    // game modes

    _onChooseGameMode: function(key) {
        NJ.audio.playSound(res.clickSound);

        NJ.audio.stopMusic();

        this.leave(function() {
            var scene = new cc.Scene();
            var gameLayer = null;
            switch(key) {
                case NJ.modekeys.minuteMadness:
                    gameLayer = new TimedGameLayer();
                    break;
                case NJ.modekeys.moves:
                    gameLayer = new MovesGameLayer();
                    break;
                case NJ.modekeys.react:
                    gameLayer = new StackGameLayer();
                    break;
                case NJ.modekeys.infinite:
                    gameLayer = new InfiniteGameLayer();
                    break;
            }

            scene.addChild(gameLayer);
            cc.director.runScene(scene);
        });
    },

    // tools

    _onHelp: function() {
        NJ.audio.playSound(res.clickSound);
        NJ.audio.stopMusic();

        this.leave(function() {
            var scene = new cc.Scene();
            scene.addChild(new TutorialDriverLayer(true));
            cc.director.runScene(scene);
        });
    },

    _onLogin: function() {
        NJ.audio.playSound(res.clickSound);

        if(!NJ.social.isLoggedIn()) {
            NJ.social.login();
        } else {
            cc.log("Warning: tried to login when already login!");
        }
    },

    _onLeaderboard: function() {
         NJ.audio.playSound(res.clickSound);

         NJ.social.showLeaderboard();
    },

    _onAchievements: function() {
        NJ.audio.playSound(res.clickSound);

        NJ.social.showAchievements();
    },

    _onShop: function() {
        NJ.audio.playSound(res.clickSound);

        this.pause();

        var that = this;

        this.leave(function() {
            if(!that._shopMenuLayer) {
                that._shopMenuLayer = new ShopMenuLayer();
                that._shopMenuLayer.setOnCloseCallback(function () {
                    that.removeChild(that._shopMenuLayer);
                    that._shopMenuLayer = null;

                    that._updateTheme();

                    that.resume();
                    that.enter();
                });
                that._shopMenuLayer.retain();
            }

            that._shopMenuLayer.reset();

            that.addChild(that._shopMenuLayer, 999);
            that._shopMenuLayer.enter();
        });
    },

    _onSettings: function() {
        NJ.audio.playSound(res.clickSound);

        this.pause();

        var that = this;

        this.leave(function() {
            that._settingsMenuLayer = new SettingsMenuLayer();
            that._settingsMenuLayer.setOnCloseCallback(function() {
                that.removeChild(that._settingsMenuLayer);

                that.resume();
                that.enter();

                NJ.audio.playMusic(res.trackChill2);
            });

            that.addChild(that._settingsMenuLayer, 999);

            that._settingsMenuLayer.enter();
        });
    },

    // UI Helpers //

    // Displays a popover for the current campaign
    // This is purely cosmetic as the items are rewarded
    // as soon as the app is opened
    //
    // Must define a callback for when the popover is closed
    _displayCampaignPopOver: function(callback) {
        var that = this;

        this.pauseMenu();

        var campaignPopOver = new PopOverLayer();
        campaignPopOver.setHeaderLabel(NJ.purchases.campaignName.toUpperCase());

        if(NJ.purchases.campaignMessage)
            campaignPopOver.setContentLabel(NJ.purchases.campaignMessage);

        NJ.purchases.discardCampaignDetails();
        campaignPopOver.setOnCloseCallback(function() {

            that.removeChild(campaignPopOver);

            that.resumeMenu();

            if(callback)
                callback();
        });
        this.addChild(campaignPopOver, 500);

        campaignPopOver.enter();
    },

    _updateTheme: function() {
        this._super();

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