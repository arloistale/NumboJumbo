var NumboHeaderLayer = cc.LayerColor.extend({

    scoreValueLabel: null,

    onPauseCallback: null,

////////////////////
// Initialization //
////////////////////

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.winSize.width, NJ.HEADER_HEIGHT);
        this.init(cc.color(255, 255, 255, 0), headerSize.width, headerSize.height);

        this.setPosition(0, cc.winSize.height);

        this.initUI();

        var moveTo = cc.MoveTo.create(.4, cc.p(0, cc.winSize.height-NJ.HEADER_HEIGHT));
        this.runAction(moveTo);
    },

    // initialize labels for game stats
    initUI: function() {
        var that = this;

        // initialize score label
        this.scoreValueLabel = new cc.LabelTTF("0", b_getFontName(res.markerFontTTF), 32);
        this.scoreValueLabel.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.getContentSize().width / 2,
            y: this.getContentSize().height / 2
        });

        this.scoreValueLabel.enableStroke(cc.color(0, 0, 255, 255), 1);
        this.scoreValueLabel.setColor(cc.color(255, 146, 48, 255));
        this.addChild(this.scoreValueLabel);

        // initialize pause button
        this.pauseButton = this.generateTitleButton("Pause", function() {
            if(that.onPauseCallback)
                that.onPauseCallback();
        });

        this.addChild(this.pauseButton);
    },

////////////////
// UI setters //
////////////////

    setScoreValue: function(val) {
      this.scoreValueLabel.setString("" + Math.floor(val));
    },

// UI callbacks //

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    },

////////////////
// UI helpers //
////////////////

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
    }
});