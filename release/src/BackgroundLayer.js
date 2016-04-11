
var BackgroundLayer = cc.LayerColor.extend({

    ctor: function(staticSprites, dynamicSprites) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);
                                           
        this.init(NJ.themes.backgroundColor);

        /*
        this.initStaticSprites(staticSprites);
        this.initDynamicSprites(dynamicSprites);
        this.initDuplicateSprites(dynamicSprites);
*/
        //this.schedule(this.updateBackground, 0.01);
    },

    setBackgroundColor: function(newColor) {
        /*var newColor = cc.color(255, 255, 255, 255);
        var level = NJ.gameState.getLevel() % 6;
        if(level == 1)
            newColor = cc.color(0, 0, 255, 255);
        if(level == 2)
            newColor = cc.color(255, 0, 0, 255);
        else if(level == 3)
            newColor = cc.color(0, 255, 0, 255);
        else if(level == 4)
            newColor = cc.color(255, 255, 0, 255);
        else if(level == 5)
            newColor = cc.color(255, 0, 102, 255);
        else if(level == 6)
            newColor = cc.color(0, 255, 204, 255);*/
        //cc.log("Level Color " + NJ.gameState.currentLevel);

        this.setColor(newColor);
    }
});