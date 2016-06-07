/**
 * Created by jonathanlu on 1/19/16.
 */

var SettingsMenuLayer = (function() {

    ///////////////
    // UI Events //
    ///////////////

    var onRetry = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        var that = this;

        this.leave(function() {
            if(that._onRetryCallback)
                that._onRetryCallback();
        });
    };

    var onMenu = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        // save any modified settings
        NJ.saveSettings();

        var that = this;

        this.leave(function() {
            if(that.onMenuCallback)
                that.onMenuCallback();
        });
    };

    var onBack = function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        // save any modified settings
        NJ.saveSettings();

        var that = this;

        this.leave(function() {
            if(that.onCloseCallback)
                that.onCloseCallback();
        });
    };

    var onMusicControl = function() {
        NJ.settings.music = !NJ.settings.music;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);

        if(!NJ.settings.music)
            cc.audioEngine.stopMusic();
    };

    var onSoundsControl = function() {
        NJ.settings.sounds = !NJ.settings.sounds;

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);
        else
            cc.audioEngine.stopAllEffects();
    };

    var onVibrationControl = function() {
        NJ.settings.vibration = !NJ.settings.vibration;

        NJ.themes.toggle(NJ.settings.vibration ? 0 : 1);

        this._updateTheme();

        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.clickSound4, false);
        else
            cc.audioEngine.stopAllEffects();
    };

    return cc.LayerColor.extend({

        // UI Data
        _headerMenu: null,
        _contentMenu: null,
        _toolMenu: null,

        // Geometry Data
        _dividersNode: null,

        // Callbacks Data
        _onRetryCallback: null,
        onMenuCallback: null,
        onCloseCallback: null,

        // Data
        _isInGame: false,

////////////////////
// Initialization //
////////////////////

        ctor: function(isInGame) {
            this._super();

            this._isInGame = isInGame;

            this.init(NJ.themes.backgroundColor);

            this._initHeaderUI();
            this._initContentUI();
            this._initToolUI();

            this.enter();
        },



        _initHeaderUI: function() {
            this._headerMenu = new cc.Menu();
            this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
            this._headerMenu.attr({
                anchorX: 0.5,
                anchorY: 0,
                y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height
            });

            var headerLabel = this.generateLabel(this._isInGame ? "Paused" : "Settings", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
            headerLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: -this._headerMenu.getContentSize().height / 2
            });

            this._headerMenu.addChild(headerLabel);

            this.addChild(this._headerMenu);
        },

        _initContentUI: function() {
            var that = this;

            this._contentMenu = new cc.Menu();
            this._contentMenu.setContentSize(cc.size(cc.visibleRect.width,
                (1 - NJ.uiSizes.headerBar - NJ.uiSizes.toolbar) * cc.visibleRect.height));

            this._contentMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: -this._contentMenu.getContentSize().width
            });

            // generate music toggle
            var musicLabel = this.generateLabel("Music", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var musicToggle = this.generateToggle(onMusicControl.bind(this));
            var state = (NJ.settings.music ? 0 : 1);
            musicToggle.setSelectedIndex(state);

            // generate sounds toggle
            var soundsLabel = this.generateLabel("Sounds", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var soundsToggle = this.generateToggle(onSoundsControl.bind(this));
            state = (NJ.settings.sounds ? 0 : 1);
            soundsToggle.setSelectedIndex(state);

            // generate vibration toggle
            var vibrationLabel = this.generateLabel("Theme", NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
            var vibrationToggle = this.generateToggle(onVibrationControl.bind(this), [
                { name: "Light", color: NJ.themes.specialLabelColor },
                { name: "Dark", color: NJ.themes.specialLabelColor }
            ]);
            state = (NJ.settings.vibration ? 0 : 1);
            vibrationToggle.setSelectedIndex(state);

            this._contentMenu.addChild(musicLabel);
            this._contentMenu.addChild(musicToggle);

            this._contentMenu.addChild(soundsLabel);
            this._contentMenu.addChild(soundsToggle);

            this._contentMenu.addChild(vibrationLabel);
            this._contentMenu.addChild(vibrationToggle);

            this._contentMenu.alignItemsVerticallyWithPadding(10);

            this.addChild(this._contentMenu);
        },

        _initToolUI: function() {

            this._toolMenu = new cc.Menu();
            this._toolMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar));
            var toolSize = this._toolMenu.getContentSize();
            this._toolMenu.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                y: cc.visibleRect.bottom.y - toolSize.height / 2
            });

            var buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

            var backButton = new NJMenuButton(buttonSize, onBack.bind(this), this);
            backButton.setImageRes(res.backImage);
            backButton.attr({
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._toolMenu.addChild(backButton);

            if(this._isInGame) {
                buttonSize = cc.size(toolSize.height * NJ.uiSizes.barButton, toolSize.height * NJ.uiSizes.barButton);

                var retryButton = new NJMenuButton(buttonSize, onRetry.bind(this), this);
                retryButton.setImageRes(res.retryImage);
                retryButton.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });

                var menuButton = new NJMenuButton(buttonSize, onMenu.bind(this), this);
                menuButton.setImageRes(res.homeImage);
                menuButton.attr({
                    anchorX: 0.5,
                    anchorY: 0.5
                });

                this._toolMenu.addChild(retryButton);
                this._toolMenu.addChild(menuButton);
            }

            this._toolMenu.alignItemsHorizontallyWithPadding(10);

            this.addChild(this._toolMenu, 100);
        },

        // makes menu elements transition in
        enter: function() {
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x, cc.visibleRect.center.y)).easing(easing));
        },

        // transition out
        leave: function(callback) {
            var headerSize = this._headerMenu.getContentSize();
            var contentSize = this._contentMenu.getContentSize();
            var toolSize = this._toolMenu.getContentSize();

            var easing = cc.easeBackOut();

            this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height)).easing(easing));
            this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

            this._contentMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.center.x - contentSize.width, cc.visibleRect.center.y)).easing(easing));

            //this._dividersNode.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.left.x, cc.visibleRect.left.y)).easing(easing));

            this.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function() {
                if(callback)
                    callback();
            })));
        },

//////////////////
// UI Callbacks //
//////////////////

        setOnRetryCallback: function(callback) {
            this._onRetryCallback = callback;
        },

        setOnCloseCallback: function(callback) {
            this.onCloseCallback = callback;
        },

        setOnMenuCallback: function(callback) {
            this.onMenuCallback = callback;
        },

////////////////
// UI Helpers //
////////////////

        generateLabel: function(title, size) {
            var toggleItem = new NJMenuItem(size);
            toggleItem.setLabelTitle(title);
            toggleItem.setLabelColor(NJ.themes.defaultLabelColor);
            return toggleItem;
        },

        generateToggle: function(callback, opts) {
            opts = opts || [
                    { name: "On", color: NJ.themes.specialLabelColor },
                    { name: "Off", color: NJ.themes.specialLabelColor2 }
                ];
            var items = [];
            var item;
            for(var i = 0; i < opts.length; ++i) {
                item = new NJMenuItem(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header2));
                item.setLabelTitle(opts[i].name);
                item.setLabelColor(opts[i].color);
                items.push(item);
            }

            var toggle = new cc.MenuItemToggle(items[0], items[1]);

            toggle.setCallback(callback);

            return toggle;
        },

        _updateTheme: function() {
            this.setColor(NJ.themes.backgroundColor);

            var i;
            var children = this._headerMenu.getChildren();

            for(i = 0; i < children.length; i++) {
                children[i].setLabelColor(NJ.themes.defaultLabelColor);
            }

            children = this._contentMenu.getChildren();

            for(i = 0; i < children.length; i++) {
                if(children[i].mType && children[i].mType == "NJMenuItem")
                    children[i].setLabelColor(NJ.themes.defaultLabelColor);
                else {
                    var childrenChildrenStack = [children[i].getChildren()];

                    while(childrenChildrenStack.length > 0) {
                        var childrenChildren = childrenChildrenStack.pop();

                        for(var j = 0; j < childrenChildren.length; ++j) {
                            if(childrenChildren[j] && childrenChildren[j].mType && childrenChildren[j].mType == "NJMenuItem")
                                childrenChildren[j].setLabelColor(NJ.themes.specialLabelColor);
                            else if(childrenChildren[j])
                                childrenChildrenStack.push(childrenChildren[j].getChildren());
                        }
                    }
                }
            }

            children = this._toolMenu.getChildren();

            for(i = 0; i < children.length; i++) {
                children[i].setLabelColor(NJ.themes.defaultLabelColor);
            }

        }
    });
}());