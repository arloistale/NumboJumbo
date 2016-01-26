/**
 *
 * Defines a namespace NJ containing releveant global data.
 * NJ contains information regarding:
 * - Game Constants
 * - Game Settings
 * - Game Analytics Data
*/

var NJ = NJ || {};

/** CONSTANTS **/

// dims
NJ.SCALE = 1;

// game state
NJ.GAME_STATE = {
    HOME: 0,
    PLAY: 1,
    OVER: 2
};

// level
NJ.NUM_COLS = 7;
NJ.NUM_ROWS = 7;

// UI
NJ.HEADER_HEIGHT = 56;

// lives
NJ.START_LIVES = 4;

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

/** State Data **/
NJ.gameState = NJ.GAME_STATE.HOME;


/** Settings Data **/

NJ.settings = {
    music: true,
    sounds: true
};

// load settings from local store
NJ.loadSettings = function() {
    // if this is our first time then save defaults
    if(!(cc.sys.localStorage.getItem('hasLoaded') == 'true')) {
        cc.sys.localStorage.setItem('hasLoaded', true);
        NJ.settings.save();
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
        cc.sys.localStorage.setItem(key, NJ.settings[key]);
    }
};

NJ.analytics = {
    sessionLength: 0,

    maxComboLength: 0,

    // numbo popularity

    blocksCleared: 0,
    blocksPerMinute: 0
};

NJ.sendAnalytics = function() {
    console.log("Sending analytics");

    // send over relevant analytics data to Google Analytics
    ga('set', 'metric1', NJ.analytics.blocksCleared);
    ga('set', 'metric2', NJ.analytics.sessionLength);
    ga('set', 'metric3', NJ.analytics.maxComboLength);
    ga('set', 'metric4', NJ.analytics.blocksPerMinute);
    ga('send', 'event', 'Game', 'end', 'Game Session Data');
};