var ToolbarLayer = (function() {

    // Touch Events

    var onToggleTheme = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this._onToggleThemeCallback)
            this._onToggleThemeCallback();
    };

    return cc.Layer.extend({

        // menu for buttons in the header
        buttonsMenu: null,

        _equationLabel: null,

        // callback
        _onToggleThemeCallback: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);

            this._initButtons();

            this._initLabels();

            this.reset();
        },

        _initLabels: function() {
            var contentSize = this.getContentSize();

            // Score Labels
            var startPos = cc.p(contentSize.width / 2, contentSize.height / 2);
            var elementSize = cc.size(contentSize.width * 0.5, contentSize.height * 0.5);
            var spriteSize;
        },

        // create buttons (probably the only button will be pause button but w/e)
        _initButtons: function() {
            var that = this;

            var contentSize = this.getContentSize();

            var buttonSize = cc.size(contentSize.height * 0.8, contentSize.height * 0.8);

            // initialize pause button
            var menu = new cc.Menu();
            menu.attr({
                x: contentSize.width - contentSize.height / 2,
                y: contentSize.height / 2
            });
            var toggleButton = new NJMenuButton(buttonSize, onToggleTheme.bind(this), this);
            //pauseButton.setImageRes(res.pauseImage);
            menu.addChild(toggleButton);

            this.addChild(menu);
        },

        //////////////////
        // Manipulation //
        //////////////////

        reset: function() {
            var size = this.getContentSize();

            this.attr({
                x: cc.visibleRect.bottomLeft.x,
                y: cc.visibleRect.bottomLeft.y - size.height
            });
        },

        // transition in
        enter: function() {
            var easing = cc.easeBackInOut();

            var moveTo = cc.moveTo(0.5, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.bottomLeft.y)).easing(easing);
            this.runAction(moveTo);
        },

        // transition out
        leave: function() {
            var size = this.getContentSize();

            var easing = cc.easeBackOut();

            var moveTo = cc.moveTo(0.5, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.bottomLeft.y - size.height)).easing(easing);
            this.runAction(moveTo);
        },

        // UI callbacks //

        setOnToggleThemeCallback: function(callback) {
            this._onToggleThemeCallback = callback;
        },

        updateTheme: function() {
            this._equationLabel.setColor(NJ.themes.defaultLabelColor);
        }
    });
}());