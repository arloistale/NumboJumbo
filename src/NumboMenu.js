
var NumboMenu = cc.Layer.extend({

    ctor: function () {
        this._super();

        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        var sp = new cc.Sprite(res.loading_png);
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = MW.SCALE;
        this.addChild(sp, 0, 1);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;
        var newGameNormal = new cc.Sprite(res.menu_png, cc.rect(0, 0, singalWidth, singalHeight));
        var newGameSelected = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight, singalWidth, singalHeight));
        var newGameDisabled = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight * 2, singalWidth, singalHeight));

        var gameSettingsNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth, 0, singalWidth, singalHeight));
        var gameSettingsSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight, singalWidth, singalHeight));
        var gameSettingsDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight * 2, singalWidth, singalHeight));

        var aboutNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, 0, singalWidth, singalHeight));
        var aboutSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight, singalWidth, singalHeight));
        var aboutDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight * 2, singalWidth, singalHeight));

        var flare = new cc.Sprite(res.flare_jpg);
        this.addChild(flare, 15, 10);
        flare.visible = false;
        var newGame = new cc.MenuItemSprite(newGameNormal, newGameSelected, newGameDisabled, function () {
            this.onButtonEffect();
            //this.onNewGame();
            flareEffect(flare, this, this.onNewGame);
        }.bind(this));
        var gameSettings = new cc.MenuItemSprite(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
        var about = new cc.MenuItemSprite(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);

        newGame.scale = MW.SCALE;
        gameSettings.scale = MW.SCALE;
        about.scale = MW.SCALE;

        var menu = new cc.Menu(newGame, gameSettings, about);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;

        var label = new cc.LabelTTF("Powered by Cocos2d-JS", "Arial", 21);
        label.setColor(cc.color(MW.FONTCOLOR));
        this.addChild(label, 1);
        label.x = winSize.width  / 2;
        label.y = 80;

        /*
        this._ship = new cc.Sprite("#ship03.png");
        this.addChild(this._ship, 0, 4);
        this._ship.x = Math.random() * winSize.width;
        this._ship.y = 0;
        this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * winSize.width, this._ship.y + winSize.height + 100)));
*/

        this.initBackground();
        this.initUI();
        this.initAudio();

        return true;
    },

    // initialize background for menu
    initBackground: function() {
        var size = cc.winSize;

        var logo = new cc.Sprite(res.logo_png);
        logo.attr({
            anchorX: 0,
            anchorY: 0,
            x: 0,
            y: MW.LOGOY,
            scale: MW.SCALE
        });
        this.addChild(logo, 10, 1);

        var logoBack = new cc.Sprite(res.logoBack_png);
        logoBack.attr({
            anchorX: 0,
            anchorY: 0,
            x: 60,
            y: MW.LOGOY + logo.height,
            scale: MW.SCALE
        });
        this.addChild(logoBack, 9);
    },

    // initialize UI elements into the scene
    initUI: function() {
        this._numboHeader = new NumboHeader();
        this.addChild(this._numboHeader, 999);
    },

    // initialize game audio
    initAudio: function() {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(res.menuTrack, true);
        }

        // start the music
        cc.audioEngine.playMusic(res.backgroundTrack);
    },

    onPlay: function(sender) {
        //load resources
        cc.LoaderScene.preload(g_mainGame, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new cc.Scene();
            scene.addChild(new GameLayer());
            scene.addChild(new GameControlMenu());
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    }
});

var MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainGameLayer();
        this.addChild(layer);
    }
});

