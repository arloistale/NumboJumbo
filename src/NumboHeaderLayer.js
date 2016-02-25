var NumboHeaderLayer = cc.LayerColor.extend({

    scoreValueLabel: null,
    scoreValueText: null,

    levelText: null,
    levelLabel: null,

    blocksToLevelLabel: null,
    blocksToLevelText: null,

    multiplierLabel: null,

    // callback
    onPauseCallback: null,

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.visibleRect.width, NJ.HEADER_HEIGHT);
        this.init(cc.color(255, 0, 0, 255), headerSize.width, headerSize.height);
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

        var scoreLabelPos = cc.p(contentSize.width / 8, contentSize.height / 2);

        // Score Labels
        this.scoreValueText = new cc.LabelTTF("Score: ", b_getFontName(res.markerFont), NJ.fontSizes.sub);
        this.scoreValueText.attr({
            scale: 1.0,
            anchorX: 0,
            anchorY: 0.5,
            x: scoreLabelPos.x,
            y: scoreLabelPos.y
        });
        this.scoreValueText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueText.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.scoreValueText);

        this.scoreValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);
        this.scoreValueLabel.attr({
            scale: 1.0,
            anchorX: 0,
            anchorY: 0.5,
            x: scoreLabelPos.x,
            y: scoreLabelPos.y - contentSize.height * 0.6
        });
        this.scoreValueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.scoreValueLabel);

        // Blocks til Levelup Labels
        this.blocksToLevelText = new cc.LabelTTF("Level up in", b_getFontName(res.markerFont), NJ.fontSizes.sub);
        this.blocksToLevelText.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: contentSize.width / 2,
            y: contentSize.height / 2 - 64
        });
        this.blocksToLevelText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.blocksToLevelText.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.blocksToLevelText);

        this.blocksToLevelLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);

        this.blocksToLevelLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: contentSize.width / 8,
            y: contentSize.height / 2 - 90
        });
        this.blocksToLevelLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.blocksToLevelLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.blocksToLevelLabel);

        var levelLabelPos = cc.p(scoreLabelPos + contentSize / 8, contentSize.height / 2);

        // Level Labels
        this.levelText = new cc.LabelTTF("Level", b_getFontName(res.markerFont), NJ.fontSizes.sub);
        this.levelText.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: contentSize.width / 8,
            y: contentSize.height / 2
        });
        this.levelText.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelText.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.levelText);

        this.levelLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);
        this.levelLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: contentSize.width / 8,
            y: contentSize.height / 2 - 26
        });
        this.levelLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.levelLabel);

        this.multiplierLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);
        this.multiplierLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: contentSize.width / 8,
            y: contentSize.height / 2 - 240
        });
        this.multiplierLabel.enableStroke(cc.color(0, 0, 255, 255), 6);
        this.multiplierLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.multiplierLabel);
    },

    initButtons: function() {
        var that = this;

        var contentSize = this.getContentSize();
        var minDim = Math.min(contentSize.width, contentSize.height);

        // initialize pause button
        var button = new ccui.Button();
        button.setTitleFontName(b_getFontName(res.markerFont));
        button.setTitleFontSize(NJ.fontSizes.buttonMedium);
        button.setTitleText("Pause");
        button.attr({
            scale: 1.0,
            anchorX: 1,
            anchorY: 0.5,
            x: contentSize.width - minDim * 0.1,
            y: contentSize.height / 2
        });
        button.loadTextureNormal(res.buttonImage);
        button.addTouchEventListener(function (ref, touchEventType) {
            if(touchEventType === ccui.Widget.TOUCH_ENDED)
                that.onPauseCallback();
        }, this);

        this.addChild(button);
    },

////////////////
// UI setters //
////////////////

    setScoreValue: function(scoreVal, blocksVal, levelVal) {
        this.scoreValueLabel.setString(scoreVal);
        //this.blocksToLevelLabel.setString(blocksVal);
        this.levelLabel.setString(levelVal);
    },

    setMultiplierValue: function(multVal) {
        this.multiplierLabel.setString("X " + multVal);
    },

    getMultiplier: function() {
        return this.multiplierLabel.getString().substr(2);
    },

// UI callbacks //

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    }
});