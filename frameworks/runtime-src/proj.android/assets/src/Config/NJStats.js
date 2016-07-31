/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

NJ.stats = (function() {

    // constants
    const MAX_NUM_HINTS = 99;
    const MAX_NUM_SCRAMBLERS = 99;
    const MAX_NUM_CONVERTERS = 99;

    // data
    var currency = 0;

    var converters = 0;
    var hints = 0;
    var scramblers = 0;

    var isDoublerEnabled = false;

    // stats data for every mode
    var modeData = {};

    var numGamesCompleted = 0;
    var numGamesForNextAd = 0;

    return {

        // expose constants
        MAX_NUM_HINTS: MAX_NUM_HINTS,
        MAX_NUM_SCRAMBLERS: MAX_NUM_SCRAMBLERS,
        MAX_NUM_CONVERTERS: MAX_NUM_CONVERTERS,

        ///////////////////
        // Serialization //
        ///////////////////

        load: function() {
            // load mode data
            for(var key in NJ.modekeys) {
                if(!NJ.modekeys.hasOwnProperty(key))
                    continue;

                modeData[NJ.modekeys[key]] = {
                    highscore: parseInt(cc.sys.localStorage.getItem('highscore-' + NJ.modekeys[key])) || 0,
                    highlevel: parseInt(cc.sys.localStorage.getItem('highlevel-' + NJ.modekeys[key])) || 0
                }
            }

            // load misc stat tracking
            currency = parseInt(cc.sys.localStorage.getItem('currency')) || 0;
            numGamesCompleted = parseInt(cc.sys.localStorage.getItem('numGamesCompleted')) || 0;
            numGamesForNextAd = parseInt(cc.sys.localStorage.getItem('numGamesForNextAd')) || 0;

            converters = parseInt(cc.sys.localStorage.getItem('converters')) || 0;
            hints = parseInt(cc.sys.localStorage.getItem('hints')) || 0;
            scramblers = parseInt(cc.sys.localStorage.getItem('scramblers')) || 0;

            isDoublerEnabled = (cc.sys.localStorage.getItem('isDoublerEnabled') || 'false') == 'true';
        },

        save: function() {
            // save mode data
            for(var key in NJ.modekeys) {
                if(!NJ.modekeys.hasOwnProperty(key))
                    continue;

                cc.sys.localStorage.setItem('highscore-' + NJ.modekeys[key], JSON.stringify(modeData[NJ.modekeys[key]].highscore));
                cc.sys.localStorage.setItem('highlevel-' + NJ.modekeys[key], JSON.stringify(modeData[NJ.modekeys[key]].highlevel));
            }

            // save misc
            cc.sys.localStorage.setItem('currency', JSON.stringify(currency));
            cc.sys.localStorage.setItem('numGamesCompleted', JSON.stringify(numGamesCompleted));
            cc.sys.localStorage.setItem('numGamesForNextAd', JSON.stringify(numGamesForNextAd));

            cc.sys.localStorage.setItem('converters', JSON.stringify(converters));
            cc.sys.localStorage.setItem('hints', JSON.stringify(hints));
            cc.sys.localStorage.setItem('scramblers', JSON.stringify(scramblers));

            cc.sys.localStorage.setItem('isDoublerEnabled', JSON.stringify(isDoublerEnabled));
        },

        ///////////////////////
        // Getters & Setters //
        ///////////////////////

        // Game Mode Specific Metrics

        // offers a highscore to the leaderboard identified with key
        // each leaderboard corresponds to a game mode
        // returns whether the score was accepted as highscore
        offerHighscore: function(key, value) {
            if(value > modeData[key].highscore) {
                modeData[key].highscore = value;
                return true;
            }

            return false;
        },

        // get highscore from specified leaderboard
        getHighscore: function(key) {
            return modeData[key].highscore;
        },

        offerHighlevel: function(key, value) {
            if(value > modeData[key].highlevel) {
                modeData[key].highlevel = value;
                return true;
            }
            
            return false;
        },
        
        getHighlevel: function(key) {
            return modeData[key].highlevel;
        },

        // Misc Metrics

        setCurrency: function(value) {
            currency = value;
        },

        addCurrency: function(amount) {
            currency += amount;
        },

        getCurrency: function() {
            return currency;
        },

        // returns the new number of games completed
        incrementNumGamesCompleted: function() {
            cc.log("Completed: " + (numGamesCompleted + 1) + " games");
            return ++numGamesCompleted;
        },

        getNumGamesCompleted: function() {
            return numGamesCompleted;
        },

        getNumGamesForNextAd: function(){
            return numGamesForNextAd;
        },

        setNumGamesForNextAd: function(){
            numGamesForNextAd = numGamesCompleted + 2; // every other game gets an ad (for now)
        },

        isEnoughGamesForAd: function(){
            cc.log("numGames: ", numGamesCompleted, ";, num for ad:", numGamesForNextAd);
            return numGamesCompleted >= numGamesForNextAd;
        },

        enableDoubler: function() {
            isDoublerEnabled = true;
        },

        isDoubleEnabled: function() {
            return isDoublerEnabled;
        },

        getNumConverters: function() {
            return converters;
        },

        getNumHints: function() {
            return hints;
        },

        getNumScramblers: function() {
            return scramblers;
        },

        addConverters: function(amount) {
            converters += amount;
        },

        addHints: function(amount) {
            hints += amount;
        },

        addScramblers: function(amount) {
            scramblers += amount;
        },

        depleteConverters: function() {
            --converters;
        },

        depleteHints: function() {
            --hints;
        },

        depleteScramblers: function() {
            --scramblers;
        }
    }
}());