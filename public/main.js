cc.game.onStart = function() {
    var designResolutionSize = cc.size(320, 480);
    var smallResolutionSize = cc.size(320, 480);
    var mediumResolutionSize = cc.size(768, 1024);
    var largeResolutionSize = cc.size(1536, 2048);
    
    // resize based on platform
    
    if(cc.sys.isNative) {
        cc.view.setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, cc.ResolutionPolicy.NO_BORDER);

        var searchPaths = jsb.fileUtils.getSearchPaths();
        
        var frameSize = cc.view.getFrameSize();

        if(frameSize.height >= largeResolutionSize.height) { // ipad retina
            cc.director.setContentScaleFactor(largeResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use large sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        } else if(frameSize.height >= mediumResolutionSize.height) { // iphone hd or above + android
            cc.director.setContentScaleFactor(mediumResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use medium sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        } else { // small device
            cc.director.setContentScaleFactor(smallResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use small sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        }
        
        jsb.fileUtils.setSearchPaths(searchPaths)
    } else { // web
        designResolutionSize = cc.size(1280, 720);
        cc.view.setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, cc.ResolutionPolicy.NO_BORDER);

        cc.director.setContentScaleFactor(largeResolutionSize.width / designResolutionSize.width);
        
        cc.view.resizeWithBrowserSize(true);
    }

    // load settings
    NJ.loadSettings();
    NJ.initAnalytics();

    NJ.social.init();

    NJ.stats.load();

    // load jumbos then we're good to go
    var that = this;
    NJ.settings.hasLoaded = false;

    if(!NJ.settings.hasLoaded) {
        // load resources
        NumboLoaderScene.preload(g_game, function () {
            var scene = new cc.Scene();
            scene.addChild(new TutorialDriverLayer());
            cc.director.runScene(scene);
        }, that);
    } else {
        // load resources
        NumboLoaderScene.preload(g_menu, function () {
            var scene = new cc.Scene();
            scene.addChild(new NumboMenuLayer());
            cc.director.runScene(scene);
        }, that);
    }
};

cc.game.run();