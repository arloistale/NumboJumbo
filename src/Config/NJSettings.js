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
    hasAuthentication: false,

    music: true,
    sounds: true,
    battery: false
};

NJ.params = {};
NJ.token = null;

// load settings from local store
NJ.loadSettings = function () {
    NJ.settings.hasLoaded = true;

    // if this is our first time then save defaults
    if (!(cc.sys.localStorage.getItem('hasLoaded') == 'true')) {
        NJ.saveSettings();
        return;
    }

    for (var key in NJ.settings) {
        if (key != 'hasAttemptedAutoSignin' && NJ.settings.hasOwnProperty(key)) {
            var rawItem = cc.sys.localStorage.getItem(key);

            if (typeof NJ.settings[key] === 'boolean')
                NJ.settings[key] = (rawItem == 'true');
            else
                NJ.settings[key] = rawItem;
        }
    }
};

// save settings to local store
// NOTE: Must be called to persist changes in settings
NJ.saveSettings = function () {
    for (var key in NJ.settings) {
        if (key != 'hasAttemptedAutoSignin' && NJ.settings.hasOwnProperty(key))
            cc.sys.localStorage.setItem(key, JSON.stringify(NJ.settings[key]));
    }
};

NJ.readParams = function () {
    var pairs = window.location.search.substring(1).split("&");
    var params = {};
    for (var i in pairs) {
        if (pairs[i] === "")
            continue;

        var pair = pairs[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    cc.log("read params:");
    cc.log(params);
    NJ.params = params;
    if (params.token){
        NJ.token = params.token;
    }
};

NJ.setToken = function(token) {
    assert(token, "wtf, trying to set token to NULL! Committing suicide!");
    NJ.token=token;
};

NJ.isStatusValid = function(status){
    // HTTP error codes between 200 and 299 are different flavors of 'success'
    // see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes */
    return !!(status >= 200 && status < 300);
};

NJ.validateToken = function (callback) {
    cc.log("NJ.validateToken() called, token: ");
    cc.log(NJ.token);

    var http = new XMLHttpRequest();
    var request_url = "https://memtechlabs.com/";
    var validateUrl = "wp-json/jwt-auth/v1/token/validate";

    http.open("POST", request_url + validateUrl, true);
    http.setRequestHeader("Authorization", "Bearer " + NJ.token);

    http.onreadystatechange = function () {
        var httpStatus = http.statusText;
        if (http.responseText) {
            var responseJson = eval('(' + http.responseText + ')');
        } else {
            var responseJson = {};
        }
        switch (http.readyState) {
            case 4: {
                cc.log("readyState=4, responseJson:");
                cc.log(responseJson);
                var status = responseJson.data.status;

                NJ.hasAuthentication = NJ.isStatusValid(status);
                callback();
            }
        }
    };
    http.send();
};
