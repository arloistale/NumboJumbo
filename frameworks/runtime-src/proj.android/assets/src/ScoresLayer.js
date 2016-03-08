/**
 * Created by jonathanlu on 1/19/16.
 */

var ScoresLayer = cc.LayerColor.extend({

    // UI Data
    _menu: null,

    // Callbacks Data
    onCloseCallback: null,

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
        sp.anchorY = 0 + NJ.anchorOffsetY;
        sp.scale = NJ.SCALE;
        this.addChild(sp, 0, 1);

        var that = this;

        this._menu = new cc.Menu();

        var titleLabel = this.generateLabel("Scores");
        this._menu.addChild(titleLabel);

        // load scores
        if(cc.sys.localStorage.getItem('stats')) {
            statsListJSON = cc.sys.localStorage.getItem('stats');
            cc.assert(statsListJSON, "Invalid stats file");

            var statsList = JSON.parse(statsListJSON);
            statsList.sort(function(a, b) {
                return b.score - a.score;
            });
            statsList = statsList.slice(0, 8);

            for(var i = 0; i < statsList.length; i++) {
                cc.log(statsList[i].score);
            }

            var scoreLabel = null;
            var statPackage = null;
            var timestamp, score, level;
            for(var i = 0; i < statsList.length; i++) {
                statPackage = statsList[i];

                timestamp = new Date(statPackage.timestamp);

                score = statPackage.score;
                level = statPackage.level;

                scoreLabel = this.generateScoreLabel(timestamp.formatAMPM() + "          Level: " + level + "          Score: " + score);

                this._menu.addChild(scoreLabel);
            }
        } else {
            var emptyLabel = this.generateScoreLabel("Oh no, there's nothing here!");
            this._menu.addChild(emptyLabel);
        }

        var backButton = new MenuTitleButton("Back", function () {
            that.onBack();
        }, this);

        backButton.setImageRes(res.buttonImage);

        this._menu.addChild(backButton);

        this._menu.alignItemsVertically();

        this.addChild(this._menu, 100);
    },

///////////////
// UI Events //
///////////////

    onBack: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onCloseCallback)
            this.onCloseCallback();
    },

//////////////////
// UI Callbacks //
//////////////////

    setOnCloseCallback: function(callback) {
        this.onCloseCallback = callback;
    },

////////////////
// UI Helpers //
////////////////

    generateLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(NJ.fontSizes.header);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    },

    generateScoreLabel: function(title) {
        cc.MenuItemFont.setFontName(b_getFontName(res.markerFont));
        cc.MenuItemFont.setFontSize(NJ.fontSizes.sub);
        var toggleLabel = new cc.MenuItemFont(title);
        toggleLabel.setEnabled(false);
        toggleLabel.setColor(cc.color(255, 255, 255, 255));
        return toggleLabel;
    }
});