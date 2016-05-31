
var BackgroundLayer = cc.LayerColor.extend({

    ctor: function(staticSprites, dynamicSprites) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);
                                           
        this.init(NJ.themes.backgroundColor);
    },

    setBackgroundColor: function(newColor) {
        this.setColor(newColor);
    }
});