/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".
 }
 *
 */

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
    //NJ.loadSettings();

    // load resources
    cc.LoaderScene.preload(g_menu, function () {
        cc.director.runScene(NumboMenuLayer.scene());
    }, this);
};

cc.game.run();