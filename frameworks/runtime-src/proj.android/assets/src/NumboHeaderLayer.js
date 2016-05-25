var NumboHeaderLayer = (function() {

    // Label prefixes
    var scorePrefix = "Points: ";
    var condPrefix = "Cond: ";

    // Touch Events
    var onPause = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound, false);

        if(this.onPauseCallback)
            this.onPauseCallback();
    };

    return cc.Layer.extend({

        // menu for buttons in the header
        buttonsMenu: null,

        // labels
        _scoreLabel: null,
        _condLabel: null,

        _equationLabel: null,

        // callback
        onPauseCallback: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);

            this.initLabels();
            this.initButtons();
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            var contentSize = this.getContentSize();

            // Score Label
            var startPos = cc.p(contentSize.width * 0.04, contentSize.height * 0.66);
            var elementSize = cc.size(contentSize.width * 0.2, contentSize.height * 0.4);
            var spriteSize;

            this._scoreLabel = new cc.LabelBMFont(scorePrefix, b_getFontName(res.mainFont));
            spriteSize = this._scoreLabel.getContentSize();
            this._scoreLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._scoreLabel.attr({
                anchorX: 0,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._scoreLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._scoreLabel);

            startPos = cc.p(contentSize.width * 0.54, contentSize.height * 0.66);

            // Condition Label
            this._condLabel = new cc.LabelBMFont(condPrefix, b_getFontName(res.mainFont));
            this._condLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._condLabel.attr({
                anchorX: 0,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._condLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._condLabel);

            // Score Labels
            startPos = cc.p(contentSize.width / 2, contentSize.height * 0.25);
            elementSize = cc.size(contentSize.width * 0.5, contentSize.height * 0.35);

            // Equation Label
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
            var pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            pauseButton.setImageRes(res.pauseImage);
            menu.addChild(pauseButton);

            this.addChild(menu);
        },

        // resets all elements
        reset: function() {
            var size = this.getContentSize();

            this.attr({
                x: cc.visibleRect.topLeft.x,
                y: cc.visibleRect.topLeft.y
            });

            this._scoreLabel.setString(" ");
            this._condLabel.setString(" ");
            this._equationLabel.setString( " ");
        },

        // makes the header transition into the visible area
        enter: function() {
            var size = this.getContentSize();

            var easing = cc.easeBackOut();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.topLeft.y - size.height)).easing(easing);
            this.runAction(moveTo);
        },

        // transition out
        leave: function() {
            var easing = cc.easeBackOut();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.topLeft.y)).easing(easing);
            this.runAction(moveTo);
        },

////////////////
// UI setters //
////////////////

        setConditionPrefix: function(prefix) {
            condPrefix = prefix;

            this.setConditionValue(-1);
        },

        setScoreValue: function(value) {
            cc.assert(typeof value === 'number', "Score value must be a Number");

            this._scoreLabel.setString(scorePrefix + value);
        },

        setConditionValue: function(value) {
            cc.assert(typeof value === 'number', "Condition value must be a Number");

            this._condLabel.setString(condPrefix + value);
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
                    }
                }
            }

            this._equationLabel.setString(equationStr);
        },

        updateTheme: function() {
            this._scoreLabel.setColor(NJ.themes.defaultLabelColor);
            this._condLabel.setColor(NJ.themes.defaultLabelColor);
            this._equationLabel.setColor(NJ.themes.defaultLabelColor);
        },

// UI callbacks //

        setOnPauseCallback: function(callback) {
            this.onPauseCallback = callback;
        }
    });
}());