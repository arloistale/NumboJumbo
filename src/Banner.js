/**
 * Created by jonathanlu on 2/11/16.
 */

var Banner = Feedback.extend({

    ctor: function() {
        this._super();

        this.setTag(NJ.tags.PAUSABLE);

        this.label.setFontSize(NJ.fontSizes.sub);
        //this.label.enableStroke(cc.color(0, 0, 0, 255), 5);

        this.setContentSize(this.label.getContentSize());
    }
});