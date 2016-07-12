
var BackgroundLayer = cc.LayerColor.extend({

    ctor: function() {
        this._super();
                                           
        this.init(NJ.themes.backgroundColor);
    },

    setBackgroundColor: function(newColor) {
        this.setColor(newColor);
    }
});