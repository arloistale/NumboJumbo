var ToolbarLayer = (function() {

    // Touch Events
    var onPause = function() {
        NJ.audio.playSound(res.clickSound);

        if(this._onPauseCallback)
            this._onPauseCallback();
    };

    var onScramble = function(){

        if (this._onScrambleCallback) {
            if (NJ.stats.getNumScramblers() > 0 && NJ.gameState.getScramblesRemaining() > 0) {
                NJ.stats.depleteScramblers();
                NJ.stats.save();
                NJ.gameState.decrementScramblesRemaining();

                this.updatePowerups();
                this._onScrambleCallback();
            }
        } else {
            cc.log("*** toolbar layer: scramble callback not set!");
        }
    };

    var onHint = function(){
        if (this._onHintCallback) {
            if (NJ.stats.getNumHints() > 0 && NJ.gameState.getHintsRemaining() > 0) {

                if (this._onHintCallback()) {
                    NJ.stats.depleteHints();
                    NJ.stats.save();
                    NJ.gameState.decrementHintsRemaining();
                    this.updatePowerups();
                }
                else {
                    cc.log("no hint found -- leaving hint counts alone!");
                }
            }
        } else {
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
            this._buttonsMenu.setContentSize(contentSize);
            this._buttonsMenu.attr({
                x: contentSize.width / 2,
                y: contentSize.height / 2
            });

            var buttonSize = cc.size(contentSize.height * NJ.uiSizes.barButton,
                contentSize.height * NJ.uiSizes.barButton);

            this._scrambleButton = new NJMenuButton(buttonSize, onScramble.bind(this), this);
            this._scrambleButton.setBackgroundColor(NJ.themes.scramblersColor);
            this._scrambleButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._scrambleButton.setLabelTitle(NJ.stats.getNumScramblers() + "");
            this._scrambleButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._scrambleButton.offsetLabel(cc.p(0, -this._scrambleButton.getContentSize().height / 2 - NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2));
            this._scrambleButton.setImageRes(res.scrambleImage);

            this._hintButton = new NJMenuButton(buttonSize, onHint.bind(this), this);
            this._hintButton.setBackgroundColor(NJ.themes.hintsColor);
            this._hintButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._hintButton.setLabelTitle(NJ.stats.getNumHints() + "");
            this._hintButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._hintButton.offsetLabel(cc.p(0, -this._hintButton.getContentSize().height / 2 - NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2));
            this._hintButton.setImageRes(res.searchImage);

            //this._buttonsMenu.addChild(this._pauseButton);
            this._buttonsMenu.addChild(this._hintButton);
            this._buttonsMenu.addChild(this._scrambleButton);

            this._buttonsMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));

            this._scrambleButton.setPositionY(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2);
            this._hintButton.setPositionY(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2);
            this.addChild(this._buttonsMenu);
        },

        //////////////////
        // Manipulation //
        //////////////////

        enterTutorialMode: function() {
            var imageRes = res.homeImage;
            var contentSize = this.getContentSize();
            var buttonSize = cc.size(contentSize.height * NJ.uiSizes.barButton,
                contentSize.height * NJ.uiSizes.barButton);
            this._pauseButton = new NJMenuButton(buttonSize, onPause.bind(this), this);
            this._pauseButton.setImageRes(res.pauseImage);
            this._pauseButton.setImageRes(imageRes);
            this._buttonsMenu.removeAllChildren();
            this._buttonsMenu.addChild(this._pauseButton);

            this._hintButton.setChildrenOpacity(0);
            this._scrambleButton.setChildrenOpacity(0);
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
        },

        // UI Helpers //

        updatePowerups: function() {
            this._hintButton.setLabelTitle(NJ.stats.getNumHints());
            this._scrambleButton.setLabelTitle(NJ.stats.getNumScramblers());

            if (NJ.gameState.getScramblesRemaining() == 0) {
                this._scrambleButton.setChildrenOpacity(0.5 * 255);
                this._scrambleButton.setEnabled(false);
            }

            if (NJ.gameState.getHintsRemaining() == 0) {
                this._hintButton.setChildrenOpacity(0.5*255);
                this._hintButton.setEnabled(false);
            }
        }
    });
}());