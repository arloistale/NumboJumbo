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

            this._equationLabel = new cc.LabelBMFont("Default Text", b_getFontName(res.mainFont));
            spriteSize = this._equationLabel.getContentSize();
            this._equationLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._equationLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._equationLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._equationLabel);

            this._equationLabel.setString(" ");
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

        setEquation: function(nums) {
            var equationStr = " ";

            if(nums.length > 0) {
                equationStr = nums[0] + "";

                var sumSoFar = nums[0];

                for (var i = 1; i < nums.length - 1; ++i) {
                    equationStr += " + " + nums[i];
                    sumSoFar += nums[i];
                }

                if (nums.length > 1) {
                    if (sumSoFar != nums[i] || nums.length <= 2) {
                        equationStr += " + " + nums[i];
                    } else {
                        equationStr += " = " + nums[i];
                        // pulse the bar a bit
                        this._equationLabel.stopAllActions();
                        this._equationLabel.runAction(cc.sequence(cc.scaleBy(0.15, 1.5, 1.5), cc.scaleBy(0.05, 1 / 1.5, 1 / 1.5)));
                    }
                }
            }

            this._equationLabel.setString(equationStr);
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