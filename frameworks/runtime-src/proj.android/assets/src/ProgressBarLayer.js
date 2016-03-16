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

        this.draw.clear();
        this.draw.drawPoly([cc.p(x, y), cc.p(x+w, y), cc.p(x+w, y+h), cc.p(x, y+h)],
            cc.color(77, 77, 77, 100), 1, cc.color(0, 0, 0, 255));
        //this.draw.drawPoly([cc.p(x, y), cc.p(x+w, y), cc.p(x+w, y+(this.prog/this.denom*h)), cc.p(x, y+(this.prog/this.denom*h))],
        //    cc.color(0, 0, 255, 100), 1, cc.color(0, 0, 0, 255));

        var progW = this.prog/this.denom*w/2;
        var progH = this.prog/this.denom*h/2;

        var newColor = cc.color(0,0,0,100);
        if(NJ.gameState.getStage() == "normal") {
            newColor = cc.color(20 * NJ.gameState.getMultiplier(), 20 * NJ.gameState.getMultiplier(), 255, 100);
            this.prog = Math.max(0, this.prog + progress);
        }
        else if(NJ.gameState.getStage() == "bonus") {
            newColor = cc.color(255, 255, 0, 100);
        }
        else console.log("NO STAGE");

        this.draw.drawPoly([cc.p(x+(w/2)-progW, y+(h/2)+progH), cc.p(x+(w/2)+progW, y+(h/2)+progH),
            cc.p(x+(w/2)+progW, y+(h/2)-progH), cc.p(x+(w/2)-progW, y+(h/2)-progH)],
            newColor, 1, cc.color(0, 0, 0, 255));

        if (this.prog/this.denom >= 1)
            return true;
        return false;
    },

    reset: function(newDenom) {
        this.denom = newDenom;
        this.prog = this.denom/2;
        this.update(0);
    },

    decrement: function() {
        this.update(-.05);
        //console.log(this.prog);
    }
});