var ToolbarLayer = (function() {

    // Touch Events
    var onPause = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this._onPauseCallback)
            this._onPauseCallback();
    };

    return cc.Layer.extend({

        // UI Data
        buttonsMenu: null,

        _pauseButton: null,

        // callback
        _onPauseCallback: null,

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

            // initialize pause button
            this._buttonsMenu = new cc.Menu();
            this._buttonsMenu.attr({
                x: contentSize.width / 2,
                y: contentSize.height / 2
            });

            var buttonSize = cc.size(contentSize.height * NJ.uiSizes.barButton, contentSize.height * NJ.uiSizes.barButton);

            this._pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            this._pauseButton.setImageRes(res.pauseImage);
            this._buttonsMenu.addChild(this._pauseButton);

            this.addChild(this._buttonsMenu);
        },

        //////////////////
        // Manipulation //
        //////////////////

        enterTutorialMode: function() {
            var imageRes = res.homeImage;
            this._pauseButton.setImageRes(imageRes);
        },

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

        setOnPauseCallback: function(callback) {
            this._onPauseCallback = callback;
        }
    });
}());