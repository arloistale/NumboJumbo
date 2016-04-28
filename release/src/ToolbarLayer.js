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

        // callback
        _onToggleThemeCallback: null,

        ctor: function() {
            this._super();

            var toolSize = cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar);
            this.setContentSize(toolSize.width, toolSize.height);
            this.attr({
                x: cc.visibleRect.bottomLeft.x,
                y: cc.visibleRect.bottomLeft.y - toolSize.height
            });

            this.initButtons();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.bottomLeft.y));
            this.runAction(moveTo);
        },

        // create buttons (probably the only button will be pause button but w/e)
        initButtons: function() {
            var that = this;

            var contentSize = this.getContentSize();

            var buttonSize = cc.size(contentSize.height * 0.8, contentSize.height * 0.8);

            // initialize pause button
            var menu = new cc.Menu();
            menu.attr({
                x: contentSize.width - contentSize.height / 2,
                y: contentSize.height / 2
            });
            var toggleButton = new NJMenuItem(buttonSize, onToggleTheme.bind(this), this);
            //pauseButton.setImageRes(res.pauseImage);
            menu.addChild(toggleButton);

            this.addChild(menu);
        },

// UI callbacks //

        setOnToggleThemeCallback: function(callback) {
            this._onToggleThemeCallback = callback;
        }
    });
}());