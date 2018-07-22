cc.game.onStart = function() {
    var designResolutionSize = cc.size(320, 480);
    var smallResolutionSize = cc.size(320, 480);
    var mediumResolutionSize = cc.size(768, 1024);
    var largeResolutionSize = cc.size(1536, 2048);
    
    cc.log("fuck you world");
		
		var request = cc.loader.getXMLHttpRequest();
		//request.withCredentials = true;
		
		request.open("POST", "http://api.timezonedb.com/v2/list-time-zone", true);
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//var arguments = "dataOne=55";
		//request.send(arguments);
		
		request.onreadystatechange = function()
		{
			cc.log("ONREADYSTATECHANGE");
			cc.log(request.statusText);
		}

		request.send();
    
    // resize based on platform
    
    if(cc.sys.isNative) {
        cc.view.setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, cc.ResolutionPolicy.NO_BORDER);

        var searchPaths = jsb.fileUtils.getSearchPaths();
        
        var frameSize = cc.view.getFrameSize();

        if(frameSize.height >= largeResolutionSize.height) { // ipad retina
            cc.director.setContentScaleFactor(largeResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use large sized resources
            searchPaths.push("res");
        } else if(frameSize.height >= mediumResolutionSize.height) { // iphone hd or above + android
            cc.director.setContentScaleFactor(mediumResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use medium sized resources
            searchPaths.push("res");
        } else { // small device
            cc.director.setContentScaleFactor(smallResolutionSize.height / designResolutionSize.height);
            
            // TODO: change to use small sized resources
            searchPaths.push("res");
        }

        searchPaths.push("src");
        
        jsb.fileUtils.setSearchPaths(searchPaths)
    } else { // web
        designResolutionSize = cc.size(1280, 720);
        cc.view.setDesignResolutionSize(designResolutionSize.width, designResolutionSize.height, cc.ResolutionPolicy.NO_BORDER);

        cc.director.setContentScaleFactor(largeResolutionSize.width / designResolutionSize.width);
        
        cc.view.resizeWithBrowserSize(true);
    }

    var that = this;
    
    // load resources
    NumboLoaderScene.preload(g_all, function () {
        var scene = new cc.Scene();

        if(NJ.settings.hasLoadedTUT) {
            scene.addChild(new NumboMenuLayer());
        } else {

            scene.addChild(new TutorialDriverLayer());
        }

        cc.director.runScene(scene);
    }, that);
};

cc.game.run();