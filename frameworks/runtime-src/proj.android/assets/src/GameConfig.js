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

// node tags
NJ.tags = {
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


////////////////
// GAME STATE //
////////////////

NJ.gameState = {
    currentJumboId: ""
};

// Use this function to set the current jumbo. DO NOT read currentJumboId directly!!!
NJ.chooseJumbo = function(jumboId) {
    NJ.gameState.currentJumboId = jumboId;
};

// Use this function to access the current jumbo. DO NOT access currentJumboId directly!!!
NJ.getCurrentJumbo = function() {
    return NJ.jumbos.data[NJ.gameState.currentJumboId];
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
    level: 1,

    // calculated stats
    blocksCleared: 0,
    maxComboLength: 0
};

NJ.resetStats = function() {
    for(var key in NJ.stats) {
        NJ.stats[key] = 0;
    }
    NJ.stats["level"] = 1;
};

NJ.sendAnalytics = function() {
    // prepare the stats package to send to GA
    NJ.stats.sessionLength = (Date.now() - NJ.stats.startTime) / 1000;
    NJ.logStats();

    var rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var jumboIndex = NJ.getCurrentJumbo().index;

    // now send over relevant stats data to GA
    if(!cc.sys.isNative) {
        ga('set', 'dimension1', rid);
        ga('set', 'metric1', NJ.stats.blocksCleared);
        ga('set', 'metric2', NJ.stats.sessionLength);
        ga('set', 'metric3', NJ.stats.maxComboLength);
        ga('set', 'metric4', NJ.stats.level);
        ga('set', 'metric5', NJ.stats.score);
        ga('set', 'metric6', jumboIndex);

        ga('send', 'event', 'Game', 'end', 'Game Session Data');
    } else {
        
    }
};

NJ.logStats = function() {
    var statsStr = "Here are stats...\n";
    for(var key in NJ.stats) {
        statsStr += key + ": " + NJ.stats[key] + "\n";
    }
    cc.log(statsStr);
};