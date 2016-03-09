/**
 * Created by The Dylan on 3/8/2016.
 */
var ProgressBarLayer = cc.Layer.extend({
    gridSize: null,
    draw: null,
    prog: 0,
    denom: 0,

    ctor: function(gridSize, denom) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this.gridSize = gridSize;
        this.denom = denom;
        this.draw = new cc.DrawNode.create();
        this.addChild(this.draw);

        this.update(0);

    },

    update: function(progress) {
        var x = this.gridSize.x;
        var y = this.gridSize.y;
        var w = this.gridSize.width;
        var h = this.gridSize.height;
        this.prog += progress;

        this.draw.clear();
        this.draw.drawPoly([cc.p(x, y), cc.p(x+w, y), cc.p(x+w, y+h), cc.p(x, y+h)],
            cc.color(77, 77, 77, 100), 1, cc.color(0, 0, 0, 255));
        this.draw.drawPoly([cc.p(x, y), cc.p(x+w, y), cc.p(x+w, y+(this.prog/this.denom*h)), cc.p(x, y+(this.prog/this.denom*h))],
            cc.color(0, 0, 255, 100), 1, cc.color(0, 0, 0, 255));

        if (this.prog/this.denom >= 1)
            return true;
        return false;
    },

    reset: function() {
        this.prog = 0;
        this.update(0);
    },
    reset: function(newDenom) {
        this.denom = newDenom;
        this.prog = this.denom-this.prog;
        this.update(0);
    }
});