/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

NJ.stats = (function() {
    var currency = 0;

    // stats data for every mode
    var modeData = {};

    return {

        ///////////////////
        // Serialization //
        ///////////////////

        load: function() {
            for(var key in NJ.modekeys) {
                if(!NJ.modekeys.hasOwnProperty(key))
                    continue;

                modeData[NJ.modekeys[key]] = {
                    highscore: parseInt(cc.sys.localStorage.getItem('highscore-' + NJ.modekeys[key])) || 0,
                    highlevel: parseInt(cc.sys.localStorage.getItem('highlevel-' + NJ.modekeys[key])) || 0
                }
            }

            cc.log(modeData);

            currency = parseInt(cc.sys.localStorage.getItem('currency')) || 0;
        },

        save: function() {
            for(var key in NJ.modekeys) {
                if(!NJ.modekeys.hasOwnProperty(key))
                    continue;

                cc.sys.localStorage.setItem('highscore-' + NJ.modekeys[key], JSON.stringify(modeData[NJ.modekeys[key]].highscore));
                cc.sys.localStorage.setItem('highlevel-' + NJ.modekeys[key], JSON.stringify(modeData[NJ.modekeys[key]].highlevel));
            }

            cc.sys.localStorage.setItem('currency', JSON.stringify(currency));
        },

        ///////////////////////
        // Getters & Setters //
        ///////////////////////

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

        setCurrency: function(value) {
            currency = value;
        },

        addCurrency: function(amount) {
            currency += amount;
        },

        getCurrency: function() {
            return currency;
        }
    }
}());