var NumboHeader = cc.LayerColor.extend({

    scoreValueLabel: null,

    ctor: function() {
        this._super();

        var headerSize = cc.size(cc.winSize.width, NJ.HEADER_HEIGHT);
        this.init(cc.color(255, 255, 255, 0), headerSize.width, headerSize.height);

        this.setPosition(0, cc.winSize.height);

        this.initLabels();

        var moveTo = cc.MoveTo.create(.4, cc.p(0, cc.winSize.height-NJ.HEADER_HEIGHT));
        this.runAction(moveTo);
    },

    initLabels: function() {
        contentSize = this.getContentSize();

        this.scoreValueLabel = new cc.LabelTTF("NUMBO JUMBO score: 0", res.markerFontTTF, 32);
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
    },

    setColor: function(color) {
        this.color = color;
    },

    writePrimaryValue: function(val) {
      this.scoreValueLabel.setString("NUMBO JUMBO score:\t" + Math.floor(val));
    }
});