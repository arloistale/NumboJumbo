/**
 * Created by jonathanlu on 2/11/16.
 */

var Banner = Feedback.extend({

    ctor: function() {
        this._super();

        this.label.setFontSize(72);

        this.setContentSize(this.label.getContentSize());
    }
});