/**
 * Created by The Dylan on 3/8/2016.
 */
var ProgressBarLayer = cc.Layer.extend({
    _gridSize: null,
    _barNode: null,
    prog: 0,
    denom: 0,

    ctor: function(gridSize, denom) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._gridSize = gridSize;
        this.denom = denom;
        this._barNode = new cc.DrawNode.create();
        this.addChild(this._barNode);

        this.update(0);
    },

    update: function(progress) {
        var x = this._gridSize.x;
        var y = this._gridSize.y;
        var w = this._gridSize.width;
        var h = this._gridSize.height;

        this._barNode.clear();
        this._barNode.drawPoly([cc.p(x, y), cc.p(x + w, y), cc.p(x + w, y + h), cc.p(x, y + h)],
            cc.color(77, 77, 77, 100), 0, cc.color("#000000"));
        //this._barNode.drawPoly([cc.p(x, y), cc.p(x+w, y), cc.p(x+w, y+(this.prog/this.denom*h)), cc.p(x, y+(this.prog/this.denom*h))],
        //    cc.color(0, 0, 255, 100), 1, cc.color(0, 0, 0, 255));

        var progH = this.prog / this.denom * h;

        var newColor = cc.color(0,0,0,100);
        if(NJ.gameState.getStage() == "normal") {
            newColor = cc.color(20 * NJ.gameState.getMultiplier(), 20 * NJ.gameState.getMultiplier(), 166, 100);
            this.prog = Math.max(0, this.prog + progress);
        }
        else if(NJ.gameState.getStage() == "bonus") {
            newColor = cc.color(255, 255, 0, 100);
        }
        else console.log("NO STAGE");

        this._barNode.drawPoly([cc.p(x, y), cc.p(x + w, y),
            cc.p(x + w, y + progH), cc.p(x, y + progH)],
            newColor, 0, cc.color("#000000"));

        if (this.prog / this.denom >= 1)
            return true;

        return false;
    },

    reset: function(newDenom) {
        this.denom = newDenom;
        this.prog = 0;
        this.update(0);
    },

    decrement: function() {
        this.update(-.05);
        //console.log(this.prog);
    }
});