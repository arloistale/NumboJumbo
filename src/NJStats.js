/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

NJ.stats = (function() {
    var currency = 0;
    var highscore = 0;

    var maxComboLength = 0;

    return {

        ///////////////////
        // Serialization //
        ///////////////////

        load: function() {
            var localHighscore = parseInt(cc.sys.localStorage.getItem('highscore'));
            var localCurrency = parseInt(cc.sys.localStorage.getItem('currency'));

            if(!isNaN(localHighscore))
                highscore = localHighscore;

            if(!isNaN(localCurrency))
                currency = localCurrency;
        },

        save: function() {
            cc.sys.localStorage.setItem('highscore', JSON.stringify(highscore));
            cc.sys.localStorage.setItem('currency', JSON.stringify(currency));
        },

        ///////////////////////
        // Getters & Setters //
        ///////////////////////

        // returns whether the score was accepted as highscore
        offerHighscore: function(value) {
            if(value > highscore) {
                highscore = value;
                return true;
            }

            return false;
        },

        getHighscore: function() {
            return highscore;
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