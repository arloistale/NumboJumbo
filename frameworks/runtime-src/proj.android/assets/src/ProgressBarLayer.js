/**
 * Created by The Dylan on 3/8/2016.
 */
var ProgressBarLayer = cc.Layer.extend({
    _barRect: null,
    _barNode: null,

    ////////////////////
    // Initialization //
    ////////////////////

    ctor: function(barRect) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._barRect = barRect;
        this._init();

        this.setProgress(0);
    },

    _init: function() {
        var x = this._barRect.x;
        var y = this._barRect.y;
        var w = this._barRect.width;
        var h = this._barRect.height;

        // initialize a background of the bar
        var backgroundNode = new cc.DrawNode.create();
        backgroundNode.drawPoly([cc.p(x, y), cc.p(x + w, y),
                cc.p(x + w, y + h), cc.p(x, y + h)],
            cc.color("#424242"), 0, cc.color("#000000"));
        this.addChild(backgroundNode, -3);

        // initialize the bar node covering the background
        this._barNode = new cc.DrawNode.create();
        this.addChild(this._barNode, 1);
    },

    /**
     * Set the how much of the bar rect for the bar to be drawn
     * @param progress Percentage of bar rect (0 - 1) Number to be drawn
     */
    setProgress: function(progress) {
        var x = this._barRect.x;
        var y = this._barRect.y;
        var w = this._barRect.width;
        var h = this._barRect.height;

        this._barNode.clear();

        // TODO: NOT good
        if(progress == 0) {
            this._barNode.drawPoly([cc.p(x, y), cc.p(x, y),
                    cc.p(x, y), cc.p(x, y)],
                cc.color(255, 255, 255, 0), 0, cc.color(255, 255, 255, 0));

            return;
        }

        var progW = progress * w;

        var newColor = cc.color("#3F51B5");

        this._barNode.drawPoly([cc.p(x, y), cc.p(x + progW, y),
            cc.p(x + progW, y + h), cc.p(x, y + h)],
            newColor, 0, cc.color(255, 255, 255, 0));

        // pulse the bar a bit
        var scaleAction = cc.scaleTo(0.5, 1.02, 1.02).easing(cc.easeElasticOut());
        var unScaleAction = cc.scaleTo(0.5, 1, 1).easing(cc.easeQuinticActionIn());
        this.stopAllActions();
        this.runAction(cc.sequence(scaleAction, unScaleAction));
    }
});