var NumboHeaderLayer = (function() {

    // Label prefixes
    var scorePrefix = "Pts: ";
    var levelPrefix = "Lv: ";

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
        _scoreLabel: null,
        _levelLabel: null,

        // progress bar for level progress
        progressBarLayer: null,
        _turnsUntilPenalty: null,

        // callback
        onPauseCallback: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);

            this.initLabels();
            this.initProgressBar();
            this.initButtons();
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            var contentSize = this.getContentSize();

            // Score Labels
            var startPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.75);
            var elementSize = cc.size(contentSize.width * 0.2, contentSize.height * 0.5);
            var spriteSize;

            this._scoreLabel = new cc.LabelBMFont(scorePrefix, b_getFontName(res.mainFont));
            spriteSize = this._scoreLabel.getContentSize();
            this._scoreLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._scoreLabel.attr({
                anchorX: 0,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._scoreLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._scoreLabel);

            startPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.25);

            this._levelLabel = new cc.LabelBMFont(levelPrefix, b_getFontName(res.mainFont));
            this._levelLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._levelLabel.attr({
                anchorX: 0,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._levelLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._levelLabel);

            if(NJ.gameState.getJumboId() == 'basic') {
                this._levelLabel.setVisible(false);
            }
        },

        initProgressBar: function() {
            var contentSize = this.getContentSize();

            if(NJ.gameState.getJumboId() == "basic-turn-based")
                this._turnsUntilPenalty = 12;

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
            var pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            pauseButton.setImageRes(res.pauseImage);
            menu.addChild(pauseButton);

            this.addChild(menu);
        },

        // resets all elements
        reset: function() {
            var size = this.getContentSize();

            this.attr({
                x: cc.visibleRect.topLeft.x,
                y: cc.visibleRect.topLeft.y
            });

            this._scoreLabel.setString(" ");
            this._levelLabel.setString(" ");
            this._progressBar.setProgress(0);

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.topLeft.y - size.height));
            this.runAction(moveTo);
        },

////////////////
// UI setters //
////////////////

        updateValues: function() {
            this._scoreLabel.setString(scorePrefix + NJ.gameState.getScore());
            this._levelLabel.setString(levelPrefix + NJ.gameState.getLevel());

            if(NJ.gameState.getJumboId() == "basic") {
                var elapsedTime = (Date.now() - NJ.gameState.getStartTime()) / 1000;
                var timeFraction = 1 - elapsedTime / 60;
                this._progressBar.setProgress(timeFraction);
            }
            else if(NJ.gameState.getJumboId() == "basic-turn-based") {
                this._turnsUntilPenalty--;
                this._progressBar.setProgress(this._turnsUntilPenalty/12);
            }
        },

        updateTheme: function() {
            this._scoreLabel.setColor(NJ.themes.defaultLabelColor);
            this._levelLabel.setColor(NJ.themes.defaultLabelColor);
        },

// UI callbacks //

        setOnPauseCallback: function(callback) {
            this.onPauseCallback = callback;
        },


        getTurnsUntilPenalty: function() {
            return this._turnsUntilPenalty;
        },

        resetTurnsUntilPenalty: function() {
            this._turnsUntilPenalty = 12;
            this._progressBar.setProgress(this._turnsUntilPenalty/12);
        }
    });
}());