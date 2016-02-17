/**
 * Created by jonathanlu on 2/11/16.
 */

var Snippet = Feedback.extend({
    ctor: function() {
        this._super();

        this.label.setFontSize(56);

        this.setContentSize(this.label.getContentSize());
    }
});