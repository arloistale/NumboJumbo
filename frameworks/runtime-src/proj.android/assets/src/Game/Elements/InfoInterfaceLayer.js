var InfoInterfaceLayer = cc.Layer.extend({

        // labels
        _primaryLabel: null,
        _secondaryLabel: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);
            this.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y
            });

            this.initLabels();

            this.reset();
            //this.enter();
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            var contentSize = this.getContentSize();

            // Primary Label
            var subDim = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub);
            var spriteSize;

            this._primaryLabel = new cc.LabelBMFont("Default Text", b_getFontName(res.mainFont));
            spriteSize = this._primaryLabel.getContentSize();
            this._primaryLabel.setScale(subDim / spriteSize.height, subDim / spriteSize.height);
            this._primaryLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._primaryLabel.setColor(NJ.themes.defaultLabelColor);
            this._primaryLabel.setOpacity(128);
            this.addChild(this._primaryLabel);

            // Secondary Label
            this._secondaryLabel = new cc.LabelBMFont("Moar Default Text", b_getFontName(res.mainFont));
            this._secondaryLabel.setScale(subDim / spriteSize.height, subDim / spriteSize.height);
            this._secondaryLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });
            this._secondaryLabel.setColor(NJ.themes.defaultLabelColor);
            this._secondaryLabel.setOpacity(128);
            this.addChild(this._secondaryLabel);
        },

        // resets all elements
        reset: function() {
            var contentSize = this.getContentSize();

            this._primaryLabel.setString(" ");
            this._secondaryLabel.setString(" ");

            this._primaryLabel.setPosition(0, cc.visibleRect.height / 2 + this._primaryLabel.getContentSize().height / 2);
            this._secondaryLabel.setPosition(0, -cc.visibleRect.height / 2 - this._secondaryLabel.getContentSize().height / 2);
        },

        // makes the info transition in
        enter: function() {
            var contentSize = this.getContentSize();

            var easing = cc.easeBackOut();

            this._primaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._primaryLabel.getPositionX(), contentSize.height / 2 - this._primaryLabel.getContentSize().height / 2)).easing(easing));

            this._secondaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._secondaryLabel.getPositionX(), -contentSize.height / 2 + this._secondaryLabel.getContentSize().height / 2)).easing(easing));

        },

        // transition out
        leave: function() {
            var easing = cc.easeBackOut();

            var contentSize = this.getContentSize();

            this._primaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._primaryLabel.getPositionX(), cc.visibleRect.height / 2 + this._primaryLabel.getContentSize().height / 2)).easing(easing));

            this._secondaryLabel.runAction(cc.moveTo(0.4,
                cc.p(this._secondaryLabel.getPositionX(), -cc.visibleRect.height / 2 - this._secondaryLabel.getContentSize().height / 2)).easing(easing));
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