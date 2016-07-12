var NJ = NJ || {};

NumboLoaderScene = cc.Scene.extend({
    _interval: null,
    _label: null,
    _className: "NumboLoaderScene",
    cb: null,
    target: null,

    _audioLoadCount: 0,

    /**
     * Extra initialization
     * @returns {boolean}
     */
    init: function() {
        var self = this;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color("#000000"));
        self.addChild(bgLayer, 0);

        if(res.logoImage) {
            //loading logo
            cc.loader.load([res.logoImage], function() {}, function() {
                var logo = self._logo = new cc.Sprite(res.logoImage);
                var logoSize = logo.getContentSize();
                var refDim = Math.min(cc.visibleRect.width, cc.visibleRect.height);
                var mSize = cc.size(refDim * 0.5, refDim * 0.5 * logoSize.height / logoSize.width);
                logo.setScale(mSize.width / logoSize.width, mSize.height / logoSize.height);
                logo.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: cc.visibleRect.center.x,
                    y: cc.visibleRect.center.y
                });

                self._bgLayer.addChild(logo, 10);
            });
        }

        return true;
    },

    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.4);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        self._audioLoadCount = 0;
        var res = self.resources;

        var shouldPreload = false;//(cc.sys.os == cc.sys.OS_IOS);

        // load resources first
        cc.loader.load(res, function() {}, function () {
            var i;

            // load modules
            NJ.loadSettings();
            NJ.loadThemes();

            NJ.initAnalytics();

            NJ.social.init();
            NJ.purchases.init();
            NJ.stats.load();

            // preload numbo blocks
            for(i = 0; i < NJ.NUM_COLS * NJ.NUM_ROWS; ++i) {
                NumboBlock.createAndPool();
            }

            // preload audio
            if(!shouldPreload) {
                if (self.cb)
                    self.cb.call(self.target);
            } else {
                // here we need to preload all the audio resources in the game <<<<
                for (i = 0; i < sounds.length; ++i) {
                    NJ.audio.preload(sounds[i], function (isSuccess) {
                        if (!isSuccess) {
                            cc.log("Warning: preloading failed")
                        }

                        self._audioLoadCount++;
                        if (self._audioLoadCount >= sounds.length) {
                            if (self.cb)
                                self.cb.call(self.target);

                            cc.log("Finished preloading " + self._audioLoadCount + " audio assets");
                        }
                    });
                }
            }
        });
    }
});

NumboLoaderScene.preload = function(resources, cb, target){
    if(!NJ.loaderScene) {
        NJ.loaderScene = new NumboLoaderScene();
        NJ.loaderScene.init();
    }
    NJ.loaderScene.initWithResources(resources, cb, target);

    cc.director.runScene(NJ.loaderScene);
    return NJ.loaderScene;
};