var NumboHeaderLayer = (function() {

    // Label prefixes
    var scorePrefix = "Points: ";
    var condPrefix = "Cond: ";

    return cc.Layer.extend({

        // menu for buttons in the header
        buttonsMenu: null,

        // labels
        _scoreLabel: null,
        _condLabel: null,

        _equationLabel: null,

        // data
        _isTutorialMode: false,

        // callback
        //onPauseCallback: null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);

            this.initLabels();
/*
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var headerDivider = new NJMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
            headerDivider.setBackgroundImage(res.alertImage);
            headerDivider.setBackgroundColor(NJ.themes.defaultLabelColor);
            headerDivider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this.getContentSize().width / 2,
                y: dividerHeight
            });
            this.addChild(headerDivider);
            */
        },

        // Create the labels used to communicate game state with text.
        initLabels: function() {
            var contentSize = this.getContentSize();

            // Score Label
            var startPos = cc.p(contentSize.width * 0.25, contentSize.height * 0.66);
            var elementSize = cc.size(contentSize.width * 0.2, contentSize.height * 0.35);
            var spriteSize;

            this._scoreLabel = new cc.LabelBMFont(scorePrefix, b_getFontName(res.mainFont));
            spriteSize = this._scoreLabel.getContentSize();
            this._scoreLabel.setString(" ");
            this._scoreLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._scoreLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._scoreLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._scoreLabel);

            startPos = cc.p(contentSize.width * 0.75, contentSize.height * 0.66);

            // Condition Label
            this._condLabel = new cc.LabelBMFont(condPrefix, b_getFontName(res.mainFont));
            this._condLabel.setString(" ");
            this._condLabel.setScale(elementSize.height / spriteSize.height, elementSize.height / spriteSize.height);
            this._condLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: startPos.x,
                y: startPos.y
            });
            this._condLabel.setColor(NJ.themes.defaultLabelColor);
            this.addChild(this._condLabel);

            // Score Labels
            startPos = cc.p(contentSize.width / 2, contentSize.height * 0.25);
            elementSize = cc.size(contentSize.width * 0.5, contentSize.height * 0.3);

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

        enterTutorialMode: function() {
            this._isTutorialMode = true;

            this._scoreLabel.setString(" ");
            this._condLabel.setString(" ");
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

            if(!this._isTutorialMode)
                this._scoreLabel.setString(scorePrefix + value);
        },

        setConditionValue: function(value) {
            cc.assert(typeof value === 'number', "Condition value must be a Number");

            if(!this._isTutorialMode)
                this._condLabel.setString(condPrefix + value);
        },

        setEquation: function(nums) {
            var equationStr = "";
            var i;

            // just print the values, no + or =
            if (!this.sumToHighest(nums) ) {
                for (i = 0; i < nums.length; ++i){
                    equationStr += nums[i] + "     ";
                }
                this._equationLabel.setColor(NJ.themes.defaultLabelColor);
            }
                // valid combo, need to put + and =
            else {
                var maxIndex = this.findMax(nums);
                var maxNum = nums[maxIndex];

                for (i = 0; i < nums.length; ++i) {
                    if (i != maxIndex){
                        if (equationStr == "") {
                            equationStr = nums[i];
                        } else {
                            equationStr += " + " + nums[i];
                        }
                    }
                }
                equationStr += " = " + maxNum;

                this._equationLabel.setColor(NJ.getColor(maxNum - 1));
            }

            this._equationLabel.setOpacity(255);
            this._equationLabel.stopAllActions();
            this._equationLabel.setString(equationStr);
        },

        activateEquation: function() {
            var that = this;

            this._equationLabel.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function() {
                that.setEquation([]);
            })));
        },

        findMax: function(nums){
            var maxIndex;
            if (nums.length > 0){
                maxIndex = 0;
            }
            for (var i = 1; i < nums.length; ++i){
                if (nums[i] > nums[maxIndex]){
                    maxIndex = i;
                }
            }
            //cc.log("max is ", nums[maxIndex]);
            return maxIndex;
        },

        sumToHighest: function(nums){
            if (!nums || nums.length < 3){
                return false;
            }


            var sum = 0;
            for(var i = 0; i < nums.length; ++i) {
                sum += nums[i];
            }

            for(i = 0; i < nums.length; ++i) {
                if(sum - nums[i] == nums[i]) {
                    return true;
                }
            }

            return false;

        },

        setEquationOld: function(nums) {
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
        }
    });
}());