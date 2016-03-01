/**
 * Created by jonathanlu on 1/19/16.
 */

var GameOverMenuLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,
    _finalScoreLabel: null,

    // Callbacks Data
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
        var that = this;

        var headerLabel = this.generateLabel("OUT OF SPACE!", NJ.fontSizes.header);

        var finalScoreTitleLabel = this.generateLabel("Final Score");

        this._finalScoreLabel = this.generateLabel(NJ.stats.score + "", NJ.fontSizes.header2);

        var menuButton = new MenuTitleButton("Menu", function() {
            that.onMenu();
        }, this);
        menuButton.setImageRes(res.buttonImage);

        this._menu = new cc.Menu(headerLabel, finalScoreTitleLabel, this._finalScoreLabel, menuButton);
        this._menu.alignItemsVerticallyWithPadding(10);
        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onMenu: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);


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

    generateLabel: function(title, size) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(size || NJ.fontSizes.sub);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    setScore: function(score) {
        this._finalScore = Math.floor(score);

        this._finalScoreLabel.setString(this._finalScore);
    }
});