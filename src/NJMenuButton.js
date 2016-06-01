/**
 * Created by jonathanlu on 4/26/16.
 */

var NJMenuButton = NJMenuItem.extend({


    // Highlight Data
    _highlightSprite: null,
    _highlightScale: null,

    _isHighlightEnabled: false,

    ctor: function(size, callback, target) {
        this._super(size, callback, target);

        if(size.height >= NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.large)) {
            this.setBackgroundImage(res.blockImage2x);
        } else {
            this.setBackgroundImage(res.blockImage);
        }

        this.setEnabled(true);
    }
});