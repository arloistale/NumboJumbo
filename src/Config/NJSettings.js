/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

// default settings
NJ.MUSIC_VOLUME = 0.4;
NJ.SOUNDS_VOLUME = 0.7;

NJ.settings = {
    // we store whether this is our first time playing or not
    hasLoaded: false,

    hasLoadedTUT: false,
    hasLoadedMM: false,
    hasLoadedMOV: false,
    hasLoadedRE: false,
    hasLoadedINF: false,

    hasInteractedReview: false,

    hasAttemptedAutoSignin: false,

    music: true,
    sounds: true,
    battery: false
};

// load settings from local store
NJ.loadSettings = function() {
    NJ.settings.hasLoaded = true;

    // if this is our first time then save defaults
    if(!(cc.sys.localStorage.getItem('hasLoaded') == 'true')) {
        NJ.saveSettings();
        return;
    }

    for(var key in NJ.settings) {
        if(key != 'hasAttemptedAutoSignin' && NJ.settings.hasOwnProperty(key)) {
            var rawItem = cc.sys.localStorage.getItem(key);

            if(typeof NJ.settings[key] === 'boolean')
                NJ.settings[key] = (rawItem == 'true');
            else
                NJ.settings[key] = rawItem;
        }
    }
};

// save settings to local store
// NOTE: Must be called to persist changes in settings
NJ.saveSettings = function() {
    for(var key in NJ.settings) {
        if(key != 'hasAttemptedAutoSignin' && NJ.settings.hasOwnProperty(key))
            cc.sys.localStorage.setItem(key, JSON.stringify(NJ.settings[key]));
    }
};



NJ.token = null;

NJ.validateToken = function(options, token) {
	NJ.token = token
	
	var http = new XMLHttpRequest();
    	var request_url = "https://memtechlabs.com/";
    	
    	var params = '';
    	if(options.params) {
    		for(var key in options.params) {
    			params += '&' + key + '=' + options.params[key];
    			cc.log(params);
    		}
    	}
    	
    	http.open("POST", request_url+options.url, true);
    	//http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	cc.log("Validating");
    	cc.log(NJ.token);
    	http.setRequestHeader("Authorization", "Bearer "+NJ.token);
    	
    	http.onreadystatechange = function() {
    		var httpStatus = http.statusText;
    		//cc.log("A");
    		//cc.log(httpStatus);
    		if(http.responseText) {
    			var responseJSON = eval('('+http.responseText+')');
    			//cc.log("B");
    			cc.log(http.responseText);
    			cc.log(responseJSON);
    			
    			//this.sendPostRequest({"url":"wp-json/jwt-auth/v1/token/validate"});
    			
    		} else {
    			var responseJSON = {};
    			//cc.log("No response");
    		}
    		
    			//cc.log("readyState");
    			//cc.log(http);
    		switch(http.readyState) {
    			case 4:
    				if(options.success) {
    					cc.log("C");
    					//cc.log(responseJSON);
    					options.success(responseJSON);
    				}
    		}
    	};
    	//params = {"username":"sampleuser@memtechlabs.com", "password":"@8Wj(ngHJO0ST0NfJ*tei5MK"};
    	//cc.log(params);
    	http.send();
};
