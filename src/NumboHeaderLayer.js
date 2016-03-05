var NumboHeaderLayer = cc.Layer.extend({

    statsMenu: null,
    buttonsMenu: null,

    scoreValueLabel: null,

    multiplierLabel: null,

    // callback
    onPauseCallback: null,

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.visibleRect.width, NJ.HEADER_HEIGHT);
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

        var scoreTitleLabel = new cc.LabelTTF("Score: ", b_getFontName(res.markerFont), NJ.fontSizes.sub);
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

        this.scoreValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);
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

        // Level Labels
        var levelTitleLabel = new cc.LabelTTF("Level: ", b_getFontName(res.markerFont), NJ.fontSizes.sub);
        levelTitleLabel.attr({
            scale: 1.0,
            anchorX: 0,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: levelStartPos.x,
            y: levelStartPos.y
        });
        levelTitleLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        levelTitleLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(levelTitleLabel);

        this.levelValueLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontSizes.header2);
        this.levelValueLabel.attr({
            scale: 1.0,
            anchorX: 0,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: levelStartPos.x + levelTitleLabel.getContentSize().width,
            y: levelStartPos.y
        });
        this.levelValueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.levelValueLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.levelValueLabel);

        this.multiplierLabel = new cc.LabelTTF("Default String", b_getFontName(res.markerFont), NJ.fontScalingFactor * NJ.fontSizes.header2);
        this.multiplierLabel.attr({
            scale: 1.0 / NJ.fontScalingFactor,
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY,
            x: contentSize.width / 2,
            y: contentSize.height / 2
        });
        this.multiplierLabel.enableStroke(cc.color(0, 0, 255, 255), 6);
        this.multiplierLabel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.multiplierLabel);
    },

    initButtons: function() {
        var that = this;

        var contentSize = this.getContentSize();

        // initialize pause button
        var button = new ccui.Button();
        button.attr({
            anchorX: 0.5,
            anchorY: 0.5 + NJ.anchorOffsetY
        });
        button.setTitleFontName(b_getFontName(res.markerFont));
        button.setTitleFontSize(NJ.fontScalingFactor * NJ.fontSizes.buttonMedium);
        button.setScale(1.0 / NJ.fontScalingFactor);
        button.setTitleText("Pause");
        var titleSize = button.getTitleRenderer().getContentSize();
        var buttonSize = cc.size(titleSize.width * 2, titleSize.height * 2);
        button.setContentSize(buttonSize.width, buttonSize.height);
        button.ignoreContentAdaptWithSize(false);
        button.loadTextureNormal(res.buttonImage);
        button.setPosition(contentSize.width - buttonSize.width / 2 * 1.1, contentSize.height / 2);

        button.addTouchEventListener(function (ref, touchEventType) {
            if(touchEventType === ccui.Widget.TOUCH_ENDED)
                that.onPauseCallback();
        }, this);

        this.addChild(button);
    },

////////////////
// UI setters //
////////////////

    updateValues: function() {
        this.scoreValueLabel.setString(NJ.gameState.getScore());

        this.multiplierLabel.setString("x" + NJ.gameState.getMultiplier());
    },

// UI callbacks //

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    }
});