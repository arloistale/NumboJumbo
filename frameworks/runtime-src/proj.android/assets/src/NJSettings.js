/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

// default settings
NJ.MUSIC_VOLUME = 0.2;
NJ.SOUNDS_VOLUME = 0.7;

NJ.settings = {
    // we store whether this is our first time playing or not
    hasLoaded: false,
    hasLoadedMM: false,


    music: true,
    sounds: true,
    vibration: true
};

// load settings from local store
NJ.loadSettings = function() {
    // if this is our first time then save defaults
    if(!(cc.sys.localStorage.getItem('hasLoaded') == 'true')) {
        cc.sys.localStorage.setItem('hasLoaded', 'true');
        NJ.saveSettings();
        return;
    } else {
        NJ.settings.hasLoaded = true;
    }

    for(var key in NJ.settings) {
        if(key != 'hasLoaded' && NJ.settings.hasOwnProperty(key)) {
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
        if(key != 'hasLoaded' && NJ.settings.hasOwnProperty(key))
            cc.sys.localStorage.setItem(key, JSON.stringify(NJ.settings[key]));
    }
};