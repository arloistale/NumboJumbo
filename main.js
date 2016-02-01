cc.game.onStart = function() {
    
    // resize based on platform
    
    var isLandscape = true;
    
    if(cc.sys.isNative) {
        var isLandscape = false;
        
        var searchPaths = jsb.fileUtils.getSearchPaths();
        
        var frameSize = cc.view.getFrameSize();
        
        if(frameSize.width >= 1536 && frameSize.height >= 1536) { // ipad retina
            if(isLandscape)
                cc.view.setDesignResolutionSize(2048, 1536, cc.ResolutionPolicy.SHOW_ALL);
            else
                cc.view.setDesignResolutionSize(1536, 2048, cc.ResolutionPolicy.SHOW_ALL);
            
            // TODO: change to use large sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        } else if(frameSize.width >= 640 && frameSize.height >= 640) { // iphone hd or above + android
            var tempSize;
            
            if(frameSize.width >= 1136 || frameSize.height >= 1136)
                tempSize = 1136;
            else
                tempSize = 960;
            
            if(isLandscape)
                cc.view.setDesignResolutionSize(tempSize, 640, cc.ResolutionPolicy.SHOW_ALL);
            else
                cc.view.setDesignResolutionSize(640, tempSize, cc.ResolutionPolicy.SHOW_ALL);
            
            // TODO: change to use medium sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        } else { // small device
            if(isLandscape)
                cc.view.setDesignResolutionSize(480, 320, cc.ResolutionPolicy.SHOW_ALL);
            else
                cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
            
            // TODO: change to use small sized resources
            searchPaths.push("res");
            searchPaths.push("src");
        }
        
        jsb.fileUtils.setSearchPaths(searchPaths)
    } else { // web
        if(isLandscape)
            cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
        else
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
        
        cc.view.resizeWithBrowserSize(true);
    }

    // load settings
    NJ.loadSettings();
    
    // load resources
    cc.LoaderScene.preload(g_menu, function () {
        cc.director.runScene(NumboMenuLayer.scene());
    }, this);
};

cc.game.run();