/**
 *
 * Defines a namespace NJ containing relevant global data.
 * NJ contains information regarding:
 * - Game Constants
 * - Game Settings
 * - Game Stats
*/

var NJ = NJ || {};

///////////////
// CONSTANTS //
///////////////

// dims
NJ.SCALE = 1;

// level
NJ.NUM_COLS = 7;
NJ.NUM_ROWS = 7;

// UI
NJ.HEADER_HEIGHT = 56;

// units
NJ.UNIT_TAG = {
    BLOCK: 9001
};

// math
NJ.E_CONST = 2.71828182845904523536;

// blocks
NJ.BLOCK_TYPE = {
    NORMAL: 0
};

NJ.BLOCK_MAX_VALUE = 9;


//////////////
// SETTINGS //
//////////////

NJ.settings = {
    music: true,
    sounds: true
};

// load settings from local store
NJ.loadSettings = function() {
    // if this is our first time then save defaults
    if(!(cc.sys.localStorage.getItem('hasLoaded') == 'true')) {
        cc.sys.localStorage.setItem('hasLoaded', 'true');
        NJ.saveSettings();
        return;
    }

    // here we compensate for loose typing of javascript by converting to a true boolean
    // TODO: change this if we ever get to the point where we aren't using only just booleans for settings
    for(var key in NJ.settings) {
        NJ.settings[key] = (cc.sys.localStorage.getItem(key) == 'true');
    }
};

// save settings to local store
// NOTE: Must be called to persist changes in settings
NJ.saveSettings = function() {
    for(var key in NJ.settings) {
        cc.sys.localStorage.setItem(key, JSON.stringify(NJ.settings[key]));
    }
};

///////////
// STATS //
///////////

NJ.stats = {
    startTime: 0, // time of init

    // game data
    sessionLength: 0,

    // core stats
    score: 0,
    level: 0,

    // calculated stats
    blocksCleared: 0,
    maxComboLength: 0
};

NJ.resetStats = function() {
    for(var key in NJ.stats) {
        NJ.stats[key] = 0;
    }
};

NJ.sendAnalytics = function() {
    if(cc.sys.isNative)
        return;

    NJ.stats.sessionLength = (Date.now() - NJ.stats.startTime) / 1000;
    NJ.logStats();

    var rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    // send over relevant stats data to Google Analytics
    ga('set', 'dimension1', rid);
    ga('set', 'metric1', NJ.stats.blocksCleared);
    ga('set', 'metric2', NJ.stats.sessionLength);
    ga('set', 'metric3', NJ.stats.maxComboLength);
    ga('set', 'metric4', NJ.stats.level);
    ga('set', 'metric5', NJ.stats.score);

    ga('send', 'event', 'Game', 'end', 'Game Session Data');
};

NJ.logStats = function() {
    var statsStr = "Here are stats...\n";
    for(var key in NJ.stats) {
        statsStr += key + ": " + NJ.stats[key] + "\n";
    }
    console.log(statsStr);
};