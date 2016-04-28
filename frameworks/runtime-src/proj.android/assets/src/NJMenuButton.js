/**
 * Created by jonathanlu on 4/26/16.
 */

var NJMenuButton = NJMenuItem.extend({

    ctor: function(size, callback, target) {
        this._super(size, callback, target);

        this.setBackgroundImage(res.buttonImage);

        this.setEnabled(true);
    }
});