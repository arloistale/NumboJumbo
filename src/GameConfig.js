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

// browser check
// Firefox 1.0+
NJ.isFirefox = typeof InstallTrigger !== 'undefined';
if(NJ.isFirefox) {
    NJ.anchorOffsetX = 0.1;
    NJ.anchorOffsetY = 0.2;
} else {
    NJ.anchorOffsetX = 0;
    NJ.anchorOffsetY = 0;
}
// dims
NJ.SCALE = 1;

// level
NJ.NUM_COLS = 7;
NJ.NUM_ROWS = 7;

// UI
NJ.HEADER_HEIGHT = 56;

// node tags
NJ.tags = {
    PAUSABLE: 9001
};

// math
NJ.E_CONST = 2.71828182845904523536;

// blocks
NJ.BLOCK_TYPE = {
    NORMAL: 0
};

NJ.BLOCK_MAX_VALUE = 9;

// game settings
NJ.DANGER_THRESHOLD = 0.75;

// default settings
NJ.MUSIC_VOLUME = 0.2;
NJ.SOUNDS_VOLUME = 1;

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
    currentJumboId: "",
    currentLevel: 1,
    multiplier: 1,
    randomJumbos: false,
    powerupMode: false
};

NJ.resetGameState = function() {
    NJ.gameState.currentLevel = 1;
    NJ.gameState.multiplier = 1;
    NJ.gameState.randomJumbos = false;
    NJ.gameState.powerupMode = false;
};

// Use this function to set the current jumbo. DO NOT read currentJumboId directly!!!
NJ.chooseJumbo = function(jumboId) {
    NJ.gameState.currentJumboId = jumboId;
};

// Use this function to access the current jumbo. DO NOT access currentJumboId directly!!!
NJ.getCurrentJumbo = function() {
    return NJ.jumbos.data.jumbos[NJ.gameState.currentJumboId];
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

// MANIPULATION //

// returns the number of blocks left needed to get to the next level.
// this is quadratic in the current level L, ie, aL^2 + bL + c.
// values for a, b, c can (and should!) be tuned regularly :)
NJ.getBlocksLeftForLevelUp = function() {

    var a = 1.0;
    var b = 20;
    var c = 0.0;
    var L = NJ.stats.level;

    var totalBlocksToLevelUp = Math.round( a*L*L+b*L+c );
    return totalBlocksToLevelUp - NJ.stats.blocksCleared;
};

// check if we should level up if blocks cleared is
// greater than level up threshold
// return how many times we leveled up
// also execute level-up checks relevant to the controller
NJ.levelUpIfNeeded = function() {
    // level up
    var levelUpCount = 0;

    while (NJ.getBlocksLeftForLevelUp() <= 0) {
        NJ.stats.level++;
        levelUpCount++;
    }

    return levelUpCount;
};

// Adds score depending on the count of how many blocks were cleared
// Returns the score difference (how much score we added)
NJ.addScoreForCombo = function(blockCount) {
    var clearedScoreValue = 10 * (Math.floor(0.5*blockCount*blockCount + blockCount) );
    var scoreDifference = clearedScoreValue * NJ.gameState.multiplier;
    NJ.stats.score += scoreDifference;
    return scoreDifference;
};

// SERIALIZATION //

// reset stats for a new game
NJ.resetStats = function() {
    for(var key in NJ.stats) {
        NJ.stats[key] = 0;
    }
    NJ.stats["level"] = 1;
};

// package relevant stats (score and level) to local storage
NJ.saveStats = function() {
    var statPackage = {
        timestamp: Date.now(),
        score: NJ.stats.score,
        level: NJ.stats.level
    };
    
    if(statPackage.score > 0 && statPackage.level > 0) {
        var statsList = [];

        var statsListJSON = "";

        // if this is our first time then save defaults
        if(cc.sys.localStorage.getItem('stats')) {
            statsListJSON = cc.sys.localStorage.getItem('stats');
            statsList = JSON.parse(statsListJSON);
        }

        statsList.push(statPackage);

        statsListJSON = JSON.stringify(statsList);
        cc.sys.localStorage.setItem('stats', statsListJSON);
    }
};

// send relevant stats over to Google Analytics
NJ.sendAnalytics = function() {
    NJ.saveStats();

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