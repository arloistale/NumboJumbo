var ToolbarLayer = (function() {

    // Touch Events
    var onPause = function() {
        NJ.audio.playSound(res.clickSound);

        if(this._onPauseCallback)
            this._onPauseCallback();
    };

    var onScramble = function(){

        if (this._onScrambleCallback){
            if (NJ.gameState.getScramblesRemaining() > 0) {
                NJ.gameState.decrementScramblesRemaining();

                this._onScrambleCallback();
            }
            else {
                NJ.audio.playSound(res.nopeSound);
            }

            if (NJ.gameState.getScramblesRemaining() == 0) {
                this._scrambleButton.setChildrenOpacity(0.5 * 255);
            }

        }
        else {
            cc.log("*** toolbar layer: scramble callback not set!");
        }
    };

    var onHint = function(){
        if (this._onHintCallback){
            if (NJ.gameState.getHintsRemaining() > 0){
                NJ.gameState.decrementHintsRemaining();

                this._onHintCallback();
            }
            else {
                NJ.audio.playSound(res.nopeSound);
            }

            if (NJ.gameState.getHintsRemaining() == 0){
                this._hintButton.setChildrenOpacity(0.5*255);
            }
        }
        else {
            cc.log("*** toolbar layer: hint callback not set!")
        }
    };

    return cc.Layer.extend({

        // UI Data
        buttonsMenu: null,

        _pauseButton: null,

        _scrambleButton: null,
        _hintButton: null,

        // callback
        _onPauseCallback: null,

        _onScrambleCallback: null,
        _onHintCallback:null,


        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);
/*
            var dividerHeight = NJ.calculateScreenDimensionFromRatio(0.005);

            var toolDivider = new NJMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
            toolDivider.setBackgroundImage(res.alertImage);
            toolDivider.setBackgroundColor(NJ.themes.defaultLabelColor);
            toolDivider.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: this.getContentSize().width / 2,
                y: this.getContentSize().height - dividerHeight
            });
            this.addChild(toolDivider);
            */

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

            var buttonSize = cc.size(contentSize.height * NJ.uiSizes.barButton,
                contentSize.height * NJ.uiSizes.barButton);

            this._pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            this._pauseButton.setImageRes(res.pauseImage);
            this._buttonsMenu.addChild(this._pauseButton);

            this._scrambleButton = new NJMenuButton(buttonSize, onScramble.bind(this), this);
            this._scrambleButton.setImageRes(res.retryImage);
            //this._buttonsMenu.addChild(this._scrambleButton);

            this._hintButton = new NJMenuButton(buttonSize, onHint.bind(this), this);
            this._hintButton.setImageRes(res.helpImage);
            //this._buttonsMenu.addChild(this._hintButton);

            this._buttonsMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));
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
            var easing = cc.easeBackOut();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.bottomLeft.y)).easing(easing);
            this.runAction(moveTo);
        },

        // transition out
        leave: function() {
            var size = this.getContentSize();

            var easing = cc.easeBackOut();

            var moveTo = cc.moveTo(0.4, cc.p(cc.visibleRect.topLeft.x, cc.visibleRect.bottomLeft.y - size.height)).easing(easing);
            this.runAction(moveTo);
        },

        // UI callbacks //

        setOnPauseCallback: function(callback) {
            this._onPauseCallback = callback;
        },

        setOnScrambleCallback: function(callback){
            this._onScrambleCallback = callback;
        },

        setOnHintCallback: function(callback){
            this._onHintCallback = callback;
        }
    });
}());