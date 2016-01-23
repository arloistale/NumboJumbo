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

////////////////
// UI setters //
////////////////

    setScoreValue: function(val) {
      this.scoreValueLabel.setString("" + Math.floor(val));
    },

// UI callbacks //

    setOnPauseCallback: function(callback) {
        this.onPauseCallback = callback;
    }
});