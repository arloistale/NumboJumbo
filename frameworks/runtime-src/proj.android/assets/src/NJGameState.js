/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

// Game state is now properly encapsulated, use the functions for manipulation and stuff
// DO NOT attempt to create functionality to set any of these properties directly
// USE the given getters and setters
NJ.gameState = (function() {
    var startTime = 0;
    var currentJumboId = "";

    // in game metric tracking
    var blocksCleared = 0;
    var currentLevel = 1;
    var currentScore = 0;

    var comboRecords = [];
    var multiplier = 1;

    var randomJumbos = false;
    var powerupMode = false;

    var updateMultiplier = function() {
        if(comboRecords.length > 2)
            multiplier = 1 + (comboRecords.length - 2) * 0.5;
        else
            multiplier = 1;
    };

    return {

        ////////////////////
        // Initialization //
        ////////////////////

        // init game state for a new session
        init: function () {
            // this in this case is bound to
            this.reset();

            startTime = Date.now();
        },

        // reset game state
        // DOES NOT reset the chosen jumbo!
        reset: function () {
            currentScore = 0;
            currentLevel = 1;
            multiplier = 1;
            randomJumbos = false;
            powerupMode = false;
            blocksCleared = 0;
        },

        //////////////////
        // Jumbos Logic //
        //////////////////

        // sets the current jumbo
        chooseJumbo: function (jumboId) {
            currentJumboId = jumboId;
        },

        // get the currentJumbo
        getJumbo: function () {
            return NJ.jumbos.data.jumbos[currentJumboId];
        },

        ///////////////////
        // Metrics Logic //
        ///////////////////

        // add to number of blocks cleared
        addBlocksCleared: function (count) {
            return blocksCleared += count;
        },

        // get the time this session started
        getStartTime: function() {
            return startTime;
        },

        // get the number of blocks cleared so far
        getBlocksCleared: function() {
            return blocksCleared;
        },

        //////////////////
        // Levels Logic //
        //////////////////

        // check if we should level up if blocks cleared is
        // greater than level up threshold
        // return how many times we leveled up
        // also execute level-up checks relevant to the controller
        levelUpIfNeeded: function () {
            // level up
            var levelUpCount = 0;

            while (this.getBlocksLeftForLevelUp() <= 0) {
                currentLevel++;
                levelUpCount++;
            }

            return levelUpCount;
        },

        // returns the number of blocks left needed to get to the next level.
        // this is quadratic in the current level L, ie, aL^2 + bL + c.
        // values for a, b, c can (and should!) be tuned regularly :)
        getBlocksLeftForLevelUp: function () {
            var a = 1.0;
            var b = 20;
            var c = 0.0;
            var L = currentLevel;

            var totalBlocksToLevelUp = Math.round(a * L * L + b * L + c);
            return totalBlocksToLevelUp - blocksCleared;
        },

        // get the current level
        getLevel: function() {
            return currentLevel;
        },

        //////////////////
        // Scores Logic //
        //////////////////

        // add score based on given data
        addScore: function(data) {
            var scoreDifference = 0;
            if (data && typeof data.blockCount !== 'undefined') {
                var blockCount = data.blockCount;
                var clearedScoreValue = 10 * (Math.floor(0.5 * blockCount * blockCount + blockCount) );
                scoreDifference = clearedScoreValue * multiplier;
            }
            else if (data && typeof data.numPoints !== 'undefined'){
                scoreDifference = data.numPoints;
            }

            currentScore += scoreDifference;
            return scoreDifference;
        },

        // get the current game score
        getScore: function() {
            return currentScore;
        },

        //////////////////////
        // Multiplier Logic //
        //////////////////////

        // record a new combo to increase the multiplier
        // this function also updates the multiplier if needed
        offerComboForMultiplier: function(data) {
            cc.assert(data, "Invalid combo data");

            // construct a result to push into combo records
            // by concatenating to given data
            var result = data;
            result.time = Date.now();

            comboRecords.push(result);

            updateMultiplier();
        },

        resetMultiplier: function() {
            comboRecords = [];

            updateMultiplier();
        },

        getMultiplier: function() {
            return multiplier;
        }
    }
}());