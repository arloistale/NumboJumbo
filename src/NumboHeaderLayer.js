var NumboHeaderLayer = cc.LayerColor.extend({

    scoreValueLabel: null,
    scoreValueText: null,
    blocksToLevelLabel: null,
    blocksToLevelText: null,
    feedbackLabel: null,
    onPauseCallback: null,

    pauseButton: null,

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.winSize.width, NJ.HEADER_HEIGHT);
        this.init(cc.color(255, 255, 255, 0), headerSize.width, headerSize.height);

        this.setPosition(0, cc.winSize.height);

        this.initLabels();
        this.initButtons();

        var moveTo = cc.MoveTo.create(.4, cc.p(0, cc.winSize.height-NJ.HEADER_HEIGHT));
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
            y: this.getContentSize().height / 2 - 65
        });
        this.scoreValueText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueText.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.scoreValueText);

        this.scoreValueLabel = new cc.LabelTTF("", b_getFontName(res.markerFontTTF), 32);
        this.scoreValueLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 8,
            y: this.getContentSize().height / 2 - 90
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
            y: this.getContentSize().height / 2
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
            y: this.getContentSize().height / 2 - 25
        });
        this.blocksToLevelLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.blocksToLevelLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.blocksToLevelLabel);

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
        this.pauseButton = this.generateTitleButton("Pause", this.onPause);
    },

    onPause: function() {
        var scene = cc.getRunningScene();
        scene.addChild(new SettingsMenu());
        cc.director.pause();
    },

    writePrimaryValue: function(scoreVal, blocksVal) {
        this.scoreValueLabel.setString(Math.floor(scoreVal));
        this.blocksToLevelLabel.setString(blocksVal);
    },

    giveFeedback: function(feedback) {
        this.feedbackLabel.setString(feedback);
    },

    generateTitleButton: function(title, callback) {
        var normalSprite = new cc.Sprite(res.buttonImage);
        var selectedSprite = new cc.Sprite(res.buttonImage);
        var disabledSprite = new cc.Sprite(res.buttonImage);

        selectedSprite.setColor(cc.color(192, 192, 192, 255));
        disabledSprite.setColor(cc.color(64, 64, 64, 255));

        var normalLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        normalLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: normalSprite.getContentSize().width / 2,
            y: normalSprite.getContentSize().height / 2
        });

        var selectedLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        selectedLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: selectedSprite.getContentSize().width / 2,
            y: selectedSprite.getContentSize().height / 2
        });

        var disabledLabel = new cc.LabelTTF(title, b_getFontName(res.markerFontTTF), 32);
        disabledLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: disabledSprite.getContentSize().width / 2,
            y: disabledSprite.getContentSize().height / 2
        });

        normalSprite.addChild(normalLabel);
        selectedSprite.addChild(selectedLabel);
        disabledSprite.addChild(disabledLabel);

        return new cc.MenuItemSprite(normalSprite, selectedSprite, disabledSprite, callback, this);
    },

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    }
});