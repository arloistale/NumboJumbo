/**
 * Created by The Dylan on 3/8/2016.
 */
var ProgressBarLayer = cc.Layer.extend({
    _gridSize: null,
    _barNode: null,

    ctor: function(gridSize) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this._gridSize = gridSize;
        this._barNode = new cc.DrawNode.create();
        this.addChild(this._barNode);

        this.setProgress(0);
    },

    setProgress: function(progress) {
        var x = this._gridSize.x;
        var y = this._gridSize.y;
        var w = this._gridSize.width;
        var h = this._gridSize.height;

        this._barNode.clear();

        var progW = progress * w;

        var newColor = cc.color(0,0,0,100);
        if(NJ.gameState.getStage() == "normal")
            newColor = cc.color(20, 20, 166, 100);
        else if(NJ.gameState.getStage() == "bonus")
            newColor = cc.color(255, 255, 0, 100);

        this._barNode.drawPoly([cc.p(x, y), cc.p(x + progW, y),
            cc.p(x + progW, y + h), cc.p(x, y + h)],
            newColor, 0, cc.color("#000000"));

        return true;
    }
});