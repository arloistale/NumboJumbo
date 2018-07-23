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


NJ.token = null;

NJ.validateToken = function (options, token, callback) {
    NJ.token = token;
    cc.log("NJ.validateToken() called");

    var http = new XMLHttpRequest();
    var request_url = "https://memtechlabs.com/";

    var params = '';
    if (options.params) {
        for (var key in options.params) {
            params += '&' + key + '=' + options.params[key];
            // cc.log(params);
        }
    }

    http.open("POST", request_url + options.url, true);
    cc.log("Validating");
    cc.log(NJ.token);
    http.setRequestHeader("Authorization", "Bearer " + NJ.token);

    http.onreadystatechange = function () {
        var httpStatus = http.statusText;
        if (http.responseText) {
            var responseJSON = eval('(' + http.responseText + ')');
        } else {
            var responseJSON = {};
        }
        switch (http.readyState) {
            case 4: {
                cc.log("responseJson:");
                cc.log(responseJSON);
                var status = responseJSON.data.status;
                /* HTTP error codes between 200 and 299 are different flavors of 'success'
                 see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes */
                NJ.hasAuthentication = (status >= 200 && status < 300);
                callback();
            }
        }
    };
    http.send();
};
