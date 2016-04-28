var NumboHeaderLayer = (function() {

    // Touch Events

    var onPause = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onPauseCallback)
            this.onPauseCallback();
    };

    return cc.Layer.extend({

        // menu for buttons in the header
        buttonsMenu: null,

        // labels
        _scoreTitleLabel: null,
        _scoreValueLabel: null,
        _levelTitleLabel: null,
        _levelValueLabel: null,

        // progress bar for level progress
        progressBarLayer: null,

        // callback
        onPauseCallback: null,

        ctor: function() {
            this._super();

            var headerSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar);
            this.setContentSize(headerSize.width, headerSize.height);
            this.attr({
                x: cc.visibleRect.topLeft.x,
                y: cc.visibleRect.topLeft.y
            });

            this.initLabels();
            this.initProgressBar();
            this.initButtons();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.topLeft.y - headerSize.height));
            this.runAction(moveTo);
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            contentSize = this.getContentSize();

            // Score Labels
            var startPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.75);

            this._scoreTitleLabel = new cc.LabelTTF("Pts ", b_getFontName(res.mainFont), NJ.fontSizes.sub);
            this._scoreTitleLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: startPos.x,
                y: startPos.y
            });
            this._scoreTitleLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._scoreTitleLabel);

            this._scoreValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.mainFont), NJ.fontSizes.sub);
            this._scoreValueLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: startPos.x + this._scoreTitleLabel.getContentSize().width,
                y: startPos.y
            });
            this._scoreValueLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._scoreValueLabel);
            
            startPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.25);

            this._levelTitleLabel = new cc.LabelTTF("Lv ", b_getFontName(res.mainFont), NJ.fontSizes.sub);
            this._levelTitleLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: startPos.x,
                y: startPos.y
            });
            this._levelTitleLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._levelTitleLabel);

            this._levelValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.mainFont), NJ.fontSizes.sub);
            this._levelValueLabel.attr({
                scale: 1.0,
                anchorX: 0,
                anchorY: 0.5 + NJ.anchorOffsetY,
                x: startPos.x + this._levelTitleLabel.getContentSize().width,
                y: startPos.y
            });
            this._levelValueLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._levelValueLabel);
        },

        initProgressBar: function() {
            var contentSize = this.getContentSize();

            this._progressBar = new ProgressBarLayer(cc.rect(contentSize.width * 0.25, contentSize.height * 0.25, contentSize.width * 0.5, contentSize.height * 0.5));
            this.addChild(this._progressBar, -2);
        },

        // create buttons (probably the only button will be pause button but w/e)
        initButtons: function() {
            var that = this;

            var contentSize = this.getContentSize();

            var buttonSize = cc.size(contentSize.height * 0.8, contentSize.height * 0.8);

            // initialize pause button
            var menu = new cc.Menu();
            menu.attr({
                x: contentSize.width - contentSize.height / 2,
                y: contentSize.height / 2
            });
            var pauseButton = new NJMenuItem(buttonSize, onPause.bind(this), this);
            pauseButton.setImageRes(res.pauseImage);
            menu.addChild(pauseButton);

            this.addChild(menu);
        },

////////////////
// UI setters //
////////////////

        updateValues: function() {
            this._scoreValueLabel.setString(NJ.prettifier.formatNumber(NJ.gameState.getScore()));
            this._levelValueLabel.setString(NJ.gameState.getLevel());
            this._progressBar.setProgress(NJ.gameState.getLevelupProgress());
        },

        updateTheme: function() {
            this._scoreTitleLabel.setColor(NJ.themes.defaultLabelColor);
            this._scoreValueLabel.setColor(NJ.themes.defaultLabelColor);
            this._levelTitleLabel.setColor(NJ.themes.defaultLabelColor);
            this._levelValueLabel.setColor(NJ.themes.defaultLabelColor);
        },

// UI callbacks //

        setOnPauseCallback: function(callback) {
            this.onPauseCallback = callback;
        }
    });
}());