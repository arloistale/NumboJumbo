var ToolbarLayer = (function() {

    // Touch Events
    var onConvert = function() {
        NJ.audio.playSound(res.clickSound);

        if (this._onConvertCallback) {
            this._onConvertCallback();
        } else {
            cc.log("*** toolbar layer: convert callback not set!");
        }
    };

    var onScramble = function() {
        // we do not play a sound here because scrambleBoard in the Game Layer handles all that

        if (this._onScrambleCallback) {
            this._onScrambleCallback();
        } else {
            cc.log("*** toolbar layer: scramble callback not set!");
        }
    };

    var onHint = function(){
        NJ.audio.playSound(res.plipSound);

        if (this._onHintCallback) {
            this._onHintCallback();
        } else {
            cc.log("*** toolbar layer: hint callback not set!")
        }
    };

    return cc.Layer.extend({

        // UI Data
        buttonsMenu: null,

        _converterButton: null,
        _scrambleButton: null,
        _hintButton: null,

        // callbacks
        _onConvertCallback: null,
        _onScrambleCallback: null,
        _onHintCallback:null,

        ctor: function(size) {
            this._super();

            this.setContentSize(size.width, size.height);

            this._initButtons();
            this._initLabels();

            this.reset();
        },

        // create labels
        _initLabels: function() {},

        // create buttons
        _initButtons: function() {
            var that = this;

            var contentSize = this.getContentSize();

            this._buttonsMenu = new cc.Menu();
            this._buttonsMenu.setContentSize(contentSize);
            this._buttonsMenu.attr({
                x: contentSize.width / 2,
                y: contentSize.height / 2
            });

            var buttonSize = cc.size(contentSize.height * NJ.uiSizes.barButton,
                contentSize.height * NJ.uiSizes.barButton);

            this._converterButton = new NumboMenuButton(buttonSize, onConvert.bind(this), this);
            this._converterButton.setBackgroundColor(NJ.themes.convertersColor);
            this._converterButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._converterButton.setLabelTitle(NJ.stats.getNumConverters() + "");
            this._converterButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._converterButton.offsetLabel(cc.p(0, -buttonSize.height / 2 - NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2));
            this._converterButton.setImageRes(res.convertImage);

            this._scrambleButton = new NumboMenuButton(buttonSize, onScramble.bind(this), this);
            this._scrambleButton.setBackgroundColor(NJ.themes.scramblersColor);
            this._scrambleButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._scrambleButton.setLabelTitle(NJ.stats.getNumScramblers() + "");
            this._scrambleButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._scrambleButton.offsetLabel(cc.p(0, -buttonSize.height / 2 - NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2));
            this._scrambleButton.setImageRes(res.scrambleImage);

            this._hintButton = new NumboMenuButton(buttonSize, onHint.bind(this), this);
            this._hintButton.setBackgroundColor(NJ.themes.hintsColor);
            this._hintButton.setLabelColor(NJ.themes.defaultLabelColor);
            this._hintButton.setLabelTitle(NJ.stats.getNumHints() + "");
            this._hintButton.setLabelSize(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub));
            this._hintButton.offsetLabel(cc.p(0, -buttonSize.height / 2 - NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2));
            this._hintButton.setImageRes(res.searchImage);

            this._buttonsMenu.addChild(this._hintButton);
            this._buttonsMenu.addChild(this._converterButton);
            this._buttonsMenu.addChild(this._scrambleButton);

            this._buttonsMenu.alignItemsHorizontallyWithPadding(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.barSpacing));

            this._converterButton.setPositionY(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2);
            this._scrambleButton.setPositionY(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2);
            this._hintButton.setPositionY(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.sub) / 2);
            this.addChild(this._buttonsMenu);
        },

        //////////////////
        // Manipulation //
        //////////////////

        enterTutorialMode: function() {
            var contentSize = this.getContentSize();
            this._buttonsMenu.removeAllChildren();

            this._hintButton.setChildrenOpacity(0);
            this._scrambleButton.setChildrenOpacity(0);
            this._converterButton.setChildrenOpacity(0);
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

        setOnConvertCallback: function(callback) {
            this._onConvertCallback = callback;
        },

        setOnScrambleCallback: function(callback){
            this._onScrambleCallback = callback;
        },

        setOnHintCallback: function(callback){
            this._onHintCallback = callback;
        },

        // UI Helpers //

        updatePowerups: function() {
            this._converterButton.setLabelTitle(NJ.stats.getNumConverters());
            this._hintButton.setLabelTitle(NJ.stats.getNumHints());
            this._scrambleButton.setLabelTitle(NJ.stats.getNumScramblers());

            if(NJ.gameState.getConvertersRemaining() <= 0) {
                this._converterButton.setEnabled(false);
                this._converterButton.setChildrenOpacity(128);
            }

            if(NJ.gameState.getHintsRemaining() <= 0) {
                this._hintButton.setEnabled(false);
                this._hintButton.setChildrenOpacity(128);
            }

            if(NJ.gameState.getScramblesRemaining() <= 0) {
                this._scrambleButton.setEnabled(false);
                this._scrambleButton.setChildrenOpacity(128);
            }
        }
    });
}());