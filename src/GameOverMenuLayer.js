/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,

    _finalScoreLabel: null,

    onMenuCallback: null,
    
////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        this.init(cc.color(0, 0, 0, 255));

        this.initUI();
    },

    initUI: function() {
        var sp = new cc.Sprite(res.loading_png);
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = NJ.SCALE;
        this.addChild(sp, 0, 1);

        /*
        var cacheImage = cc.textureCache.addImage(res.buttonImage);
        var title = new cc.Sprite(cacheImage);
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height - 120;
        this.addChild(title);
*/

        var that = this;

        var headerLabel = this.generateLabel("OUT OF SPACE!");

        var finalScoreTitleLabel = this.generateLabel("Final Score");

        this._finalScoreLabel = this.generateLabel(NJ.stats.score + "");

        var menuButton = this.generateTitleButton("Menu", function() {
            that.onMenu();
        });

        this._menu = new cc.Menu(headerLabel, finalScoreTitleLabel, this._finalScoreLabel, menuButton);
        this._menu.alignItemsVerticallyWithPadding(30);
        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onMenu: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.successTrack, false);


        if(this.onMenuCallback)
            this.onMenuCallback();
    },
    
//////////////////
// UI Callbacks //
//////////////////
    
    setOnMenuCallback: function(callback) {
        this.onMenuCallback = callback;
    },
    
////////////////
// UI Helpers //
////////////////

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(42);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateTitleButton: function(title, callback) {
        cc.MenuItemFont.setFontSize(26);
        var label = new cc.LabelTTF(title, b_getFontName(res.markerFont), 20);
        label.setColor(cc.color(255, 255, 255, 255));

        return new cc.MenuItemLabel(label, callback);
    },

    setScore: function(score) {
        this._finalScore = Math.floor(score);

        this._finalScoreLabel.setString(this._finalScore);
    }
});