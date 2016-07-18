var InfoInterfaceLayer = cc.Layer.extend({

        // labels
        _primaryLabel: null,
        _secondaryLabel: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);
            this.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this.initLabels();

            this.reset();
            //this.enter();
            cc.log("yay");
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            var contentSize = this.getContentSize();

            // Primary Label
            var elementSize = cc.size(contentSize.width * 0.2, contentSize.height * 0.35);
            var spriteSize;

            this._primaryLabel = new cc.LabelBMFont("Default Text", b_getFontName(res.mainFont));
            spriteSize = this._primaryLabel.getContentSize();
            this._primaryLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._primaryLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._primaryLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._primaryLabel);

            // Secondary Label
            this._secondaryLabel = new cc.LabelBMFont("Moar Default Text", b_getFontName(res.mainFont));
            this._secondaryLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._secondaryLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._secondaryLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._secondaryLabel);
        },

        // resets all elements
        reset: function() {
            this._primaryLabel.setString(" ");
            this._secondaryLabel.setString(" ");

            this._primaryLabel.setPosition(cc.visibleRect.width / 2, cc.visibleRect.height + this._primaryLabel.getContentSize().height / 2);
            this._secondaryLabel.setPosition(cc.visibleRect.width / 2, cc.visibleRect.height - this._secondaryLabel.getContentSize().height / 2);
        },

        // makes the info transition in
        enter: function() {
            var contentSize = this.getContentSize();

            var easing = cc.easeBackOut();

            this._primaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._primaryLabel.getPositionX(), contentSize.height - this._primaryLabel.getContentSize().height / 2)).easing(easing));

            this._secondaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._secondaryLabel.getPositionX(), this._secondaryLabel.getContentSize().height / 2)).easing(easing));

        },

        // transition out
        leave: function() {
            var easing = cc.easeBackOut();

            var contentSize = this.getContentSize();

            this._primaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._primaryLabel.getPositionX(), contentSize.height / 2 + cc.visibleRect.height / 2 + this._primaryLabel.getContentSize().height / 2)).easing(easing));

            this._secondaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._secondaryLabel.getPositionX(), contentSize.height / 2 - cc.visibleRect.height / 2 - this._secondaryLabel.getContentSize().height / 2)).easing(easing));
        },

////////////////
// UI setters //
////////////////

        setPrimaryInfo: function(info) {
            this._primaryLabel.setString(info);
        },

        setSecondaryInfo: function(info) {
            this._secondaryLabel.setString(info);
        },

        updateTheme: function() {
            this._primaryLabel.setColor(NJ.themes.defaultLabelColor);
            this._secondaryLabel.setColor(NJ.themes.defaultLabelColor);
        }
    });