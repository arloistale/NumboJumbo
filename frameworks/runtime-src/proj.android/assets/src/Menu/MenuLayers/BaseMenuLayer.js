/**
 * Created by jonathanlu on 7/10/16.
 */


var BaseMenuLayer = cc.LayerColor.extend({

    // Menu Data
    _headerMenu: null,
    _toolMenu: null,

    ////////////////////
    // Initialization //
    ////////////////////

    ctor: function () {
        this._super();

        this.init(NJ.themes.backgroundColor);

        this._initHeaderUI();
        this._initToolUI();

        this._initInput();

        this._generateBaseDividers();
    },

    _initHeaderUI: function() {
        this._headerMenu = new cc.Menu();
        this._headerMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.headerBar));
        this._headerMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2
        });

        this.addChild(this._headerMenu, 100);
    },

    // initialize menu elements
    _initToolUI: function() {
        this._toolMenu = new cc.Menu();
        this._toolMenu.setContentSize(cc.size(cc.visibleRect.width, cc.visibleRect.height * NJ.uiSizes.toolbar));
        var toolSize = this._toolMenu.getContentSize();
        this._toolMenu.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: cc.visibleRect.bottom.y - toolSize.height / 2
        });

        this.addChild(this._toolMenu, 100);
    },

    // Initialize input depending on the device.
    _initInput: function() {
        var that = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key, event) {
                if(key == cc.KEY.back) {
                    that._onBack();
                }
            }
        }, this);
    },

    // reset the elements of the menu layer
    reset: function() {
        this._headerMenu.setPositionY(cc.visibleRect.top.y + this._headerMenu.getContentSize().height / 2);
        this._toolMenu.setPositionY(cc.visibleRect.bottom.y - this._toolMenu.getContentSize().height / 2);
    },

    // makes menu elements transition in,
    // overridden in sub classes
    enter: function() {
        var headerSize = this._headerMenu.getContentSize();
        var toolSize = this._toolMenu.getContentSize();

        var easing = cc.easeBackOut();

        this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y - headerSize.height / 2)).easing(easing));
        this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y + toolSize.height / 2)).easing(easing));
    },

    // transition out,
    // overridden in sub classes
    leave: function(callback) {
        var headerSize = this._headerMenu.getContentSize();
        var toolSize = this._toolMenu.getContentSize();

        var easing = cc.easeBackOut();

        this._headerMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.top.x, cc.visibleRect.top.y + headerSize.height / 2)).easing(easing));
        this._toolMenu.runAction(cc.moveTo(0.4, cc.p(cc.visibleRect.bottom.x, cc.visibleRect.bottom.y - toolSize.height / 2)).easing(easing));

        if(callback) {
            // need to do this because our original node will usually be paused
            // Why did we pause original node?
            // One bad effect of not pausing the original node is that input for example:
            // On Back Button on Android listener will be invoked on both original node (NumboMenuLayer)
            // and on new node (SettingsMenuLayer) meaning that Back Button will exit the game from all menu screens
            this._headerMenu.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(function () {
                callback();
            })));
        }
    },

    ///////////////
    // UI Events //
    ///////////////

    _onBack: function() {},

    // UI Helpers //

    // generate dividers on headers and toolbars
    _generateBaseDividers: function() {
        var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

        var headerDivider = new NumboMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
        headerDivider.setTag(444);
        headerDivider.setBackgroundImage(res.alertImage);
        headerDivider.setBackgroundColor(NJ.themes.dividerColor);
        headerDivider.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: -this._headerMenu.getContentSize().height / 2 + dividerHeight
        });
        this._headerMenu.addChild(headerDivider);

        var toolDivider = new NumboMenuItem(cc.size(cc.visibleRect.width, dividerHeight));
        toolDivider.setTag(444);
        toolDivider.setBackgroundImage(res.alertImage);
        toolDivider.setBackgroundColor(NJ.themes.dividerColor);
        toolDivider.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            y: this._toolMenu.getContentSize().height / 2 - dividerHeight
        });
        this._toolMenu.addChild(toolDivider);
    },

    // generates a horizontal divider spanning 80% of the width of the screen
    // positioning and other attributes are left to the caller
    _generateSupportDivider: function() {
        var dividerHeight = NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.divider);

        var divider = new NumboMenuItem(cc.size(cc.visibleRect.width * 0.8, dividerHeight));
        divider.setTag(444);
        divider.setBackgroundImage(res.alertImage);
        divider.setBackgroundColor(NJ.themes.dividerColor);
        return divider;
    },

    generateLabel: function(title, size, color) {
        var toggleItem = new NumboMenuItem(size);
        toggleItem.setLabelTitle(title);
        toggleItem.setLabelColor(color || NJ.themes.defaultLabelColor);
        return toggleItem;
    },

    generateToggle: function(callback, opts) {
        opts = opts || [
                { name: "ON", color: NJ.themes.specialLabelColor },
                { name: "OFF", color: NJ.themes.specialLabelColor }
            ];
        var items = [];
        var item;
        for(var i = 0; i < opts.length; ++i) {
            item = new NumboMenuItem(NJ.calculateScreenDimensionFromRatio(NJ.uiSizes.header));
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

        var children = this.getChildren();
        var childrenChild;

        for(i = 0; i < children.length; i++) {
            if(children[i].mType && children[i].mType == "NumboMenuItem")
                children[i].updateTheme();
            else {
                var childrenChildrenStack = [children[i].getChildren()];

                while(childrenChildrenStack.length > 0) {
                    var childrenChildren = childrenChildrenStack.pop();

                    for(var j = 0; j < childrenChildren.length; ++j) {
                        childrenChild = childrenChildren[j];
                        if(childrenChild && childrenChild.getTag() != 666 && childrenChild.mType && childrenChild.mType == "NumboMenuItem") {
                            childrenChild.updateTheme();

                            switch(childrenChild.getTag()) {
                                case 333:
                                    childrenChild.setBackgroundColor(NJ.themes.backgroundColor);
                                    break;
                                case 444:
                                    childrenChild.setBackgroundColor(NJ.themes.dividerColor);
                                    break;
                                case 1000:

                                    switch(this._modeKey) {
                                        case NJ.modekeys.minuteMadness:
                                            childrenChild.setLabelColor(NJ.themes.blockColors[0]);
                                            break;
                                        case NJ.modekeys.moves:
                                            childrenChild.setLabelColor(NJ.themes.blockColors[1]);
                                            break;
                                        case NJ.modekeys.react:
                                            childrenChild.setLabelColor(NJ.themes.blockColors[2]);
                                            break;
                                        case NJ.modekeys.infinite:
                                            childrenChild.setLabelColor(NJ.themes.blockColors[3]);
                                            break;
                                    }
                                    break;
                            }

                        } else if(childrenChildren[j])
                            childrenChildrenStack.push(childrenChildren[j].getChildren());
                    }
                }
            }
        }
    }
});