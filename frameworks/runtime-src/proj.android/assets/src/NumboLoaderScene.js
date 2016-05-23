var NJ = NJ || {};

NumboLoaderScene = cc.Scene.extend({
    _interval: null,
    _label: null,
    _className: "NumboLoaderScene",
    cb: null,
    target: null,

    /**
     * Extra initialization
     * @returns {boolean}
     */
    init: function() {
        var self = this;

        //logo
        var logoWidth = 160;
        var logoHeight = 200;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(NJ.themes.backgroundColor);
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
        if(res.logoImage) {
            //loading logo
            cc.loader.loadImg(res.logoImage, {isCrossOrigin : false }, function(err, img) {
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }

        //loading percent
        //var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
        //label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        //label.setColor(cc.color(180, 180, 180));
        //bgLayer.addChild(this._label, 10);
        return true;
    },

    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    },
    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        //this._label.setString(tmpStr);
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
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                //self._label.setString("Loading... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
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