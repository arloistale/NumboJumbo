var NumboHeaderLayer = (function() {

    // Touch Events

    var onPause = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onPauseCallback)
            this.onPauseCallback();
    };

    return cc.Layer.extend({

        statsMenu: null,
        buttonsMenu: null,

        scoreValueLabel: null,

        // callback
        onPauseCallback: null,

        _barNode: null,

        ctor: function() {
            this._super();

            var headerSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar);
            this.setContentSize(headerSize.width, headerSize.height);
            this.attr({
                x: cc.visibleRect.topLeft.x,
                y: cc.visibleRect.topLeft.y
            });

            this.initLabels();
            this.initButtons();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.topLeft.y - headerSize.height));
            this.runAction(moveTo);
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            contentSize = this.getContentSize();

            // Score Labels
            var scoreStartPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.5);

            var scoreTitleLabel = new cc.LabelTTF("Score: ", b_getFontName(res.mainFont), NJ.fontSizes.sub);
            scoreTitleLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: scoreStartPos.x,
                y: scoreStartPos.y
            });
            scoreTitleLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            scoreTitleLabel.setColor(cc.color(255, 255, 255, 255));
            this.addChild(scoreTitleLabel);

            this.scoreValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.mainFont), NJ.fontSizes.header2);
            this.scoreValueLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: scoreStartPos.x + scoreTitleLabel.getContentSize().width,
                y: scoreStartPos.y
            });
            this.scoreValueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
            this.scoreValueLabel.setColor(cc.color(255, 255, 255, 255));
            this.addChild(this.scoreValueLabel);
        },

        initButtons: function() {
            var that = this;

            var contentSize = this.getContentSize();

            var buttonSize = cc.size(contentSize.height * 0.75, contentSize.height * 0.75);

            // initialize pause button
            var menu = new cc.Menu();
            menu.attr({
                x: contentSize.width - contentSize.height / 2,
                y: contentSize.height / 2
            });
            var pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            pauseButton.setImageRes(res.pauseImage);
            menu.addChild(pauseButton);

            this.addChild(menu);
        },

////////////////
// UI setters //
////////////////

        updateValues: function() {
            this.scoreValueLabel.setString(NJ.prettifier.formatNumber(NJ.gameState.getScore()));
        },

// UI callbacks //

        setOnPauseCallback: function(callback) {
            this.onPauseCallback = callback;
        }
    });
}());