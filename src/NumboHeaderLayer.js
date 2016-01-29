var NumboHeaderLayer = cc.LayerColor.extend({

    scoreValueLabel: null,
    scoreValueText: null,

    levelText: null,
    levelLabel: null,

    blocksToLevelLabel: null,
    blocksToLevelText: null,

    feedbackLabel: null,

    // callback
    onPauseCallback: null,

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.winSize.width, NJ.HEADER_HEIGHT);
        this.init(cc.color(255, 255, 255, 0), headerSize.width, headerSize.height);

        this.setPosition(0, cc.winSize.height);

        this.initLabels();
        this.initButtons();

        var moveTo = cc.MoveTo.create(.4, cc.p(0, cc.winSize.height - NJ.HEADER_HEIGHT));
        this.runAction(moveTo);
    },

    initLabels: function() {
        contentSize = this.getContentSize();

        // Score Labels
        this.scoreValueText = new cc.LabelTTF("Score", b_getFontName(res.markerFontTTF), 24);
        this.scoreValueText.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 130
        });
        this.scoreValueText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueText.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.scoreValueText);

        this.scoreValueLabel = new cc.LabelTTF("0", b_getFontName(res.markerFontTTF), 32);
        this.scoreValueLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 155
        });
        this.scoreValueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.scoreValueLabel);

        // Blocks til Levelup Labels
        this.blocksToLevelText = new cc.LabelTTF("Level up in", b_getFontName(res.markerFontTTF), 20);
        this.blocksToLevelText.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 64
        });
        this.blocksToLevelText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.blocksToLevelText.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.blocksToLevelText);

        this.blocksToLevelLabel = new cc.LabelTTF("15", b_getFontName(res.markerFontTTF), 32);
        this.blocksToLevelLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 90
        });
        this.blocksToLevelLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.blocksToLevelLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.blocksToLevelLabel);

        // Level Labels
        this.levelText = new cc.LabelTTF("Level", b_getFontName(res.markerFontTTF), 20);
        this.levelText.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2
        });
        this.levelText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelText.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.levelText);

        this.levelLabel = new cc.LabelTTF("1", b_getFontName(res.markerFontTTF), 32);
        this.levelLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 26
        });
        this.levelLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.levelLabel);

        // In-game Feedback Labels
        this.feedbackLabel = new cc.LabelTTF("", b_getFontName(res.markerFontTTF), 32);
        this.feedbackLabel.attr({
            scale: 1.0,
            anchorX: .5,
            anchorY: .5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });
        this.feedbackLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.feedbackLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.feedbackLabel);

    },

    initButtons: function() {
        var that = this;

        var contentSize = this.getContentSize();
        var minDim = Math.min(contentSize.width, contentSize.height);

        // initialize pause button
        var button = new ccui.Button();
        button.setTitleFontName(b_getFontName(res.markerFontTTF));
        button.setTitleFontSize(26);
        button.setTitleText("Pause");
        button.attr({
            scale: 0.5,
            anchorX: 1,
            anchorY: 1,
            x: contentSize.width - minDim * 0.1,
            y: contentSize.height - minDim * 0.1
        });
        button.loadTextureNormal(res.buttonImage);
        button.addTouchEventListener(function (ref, touchEventType) {
            if(touchEventType === ccui.Widget.TOUCH_ENDED)
                that.onPauseCallback();

        }, this);

        this.addChild(button);
    },

    giveFeedback: function(feedback) {
        this.feedbackLabel.setString(feedback);
    },

////////////////
// UI setters //
////////////////

    setScoreValue: function(scoreVal, blocksVal, levelVal) {
        this.scoreValueLabel.setString(Math.floor(scoreVal));
        this.blocksToLevelLabel.setString(blocksVal);
        this.levelLabel.setString(levelVal);
    },

// UI callbacks //

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    }
});