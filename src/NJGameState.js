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
    var prevBlocksNeededForLevelup = 0;
    var blocksNeededForLevelup = 0;
    var blocksCleared = 0;
    var currentLevel = 1;
    var currentScore = 0;

    var comboRecords = [];
    var multiplier = 1;

    var randomJumbos = false;
    var powerupMode = false;

    var stage = "normal";

    var updateMultiplier = function() {
        if(comboRecords.length > 2)
            multiplier = 1 + (comboRecords.length - 2) * 0.5;
        else
            multiplier = 1;
    };

    // returns the number of blocks left needed to get to the next level.
    // this is quadratic in the current level L, ie, aL^2 + bL + c.
    // values for a, b, c can (and should!) be tuned regularly :)
    var calculateBlocksNeededForLevelup = function (level) {
        var a = 3;
        var b = 20;
        var c = 0;
        var L = level;

        return Math.round(a * L * L + b * L + c);
    };

    return {

        ////////////////////
        // Initialization //
        ////////////////////

        // init game state for a new session
        init: function () {
            // this in this case is bound
            this.reset();

            startTime = Date.now();
        },

        // reset game state
        // DOES NOT reset the chosen jumbo!
        reset: function () {
            currentScore = 0;
            currentLevel = 1;
            prevBlocksNeededForLevelup = calculateBlocksNeededForLevelup(currentLevel - 1);
            blocksNeededForLevelup = calculateBlocksNeededForLevelup(currentLevel);
            randomJumbos = false;
            powerupMode = false;
            blocksCleared = 0;

            this.resetMultiplier();
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
            return NJ.jumbos.getJumboDataWithKey(currentJumboId);
        },

        getJumboId: function() {
            return currentJumboId;
        },

        ///////////////////
        // Metrics Logic //
        ///////////////////

        // add to number of blocks cleared
        addBlocksCleared: function (count) {
            blocksCleared += count;
            return blocksCleared;
        },

        // get the time this session started
        getStartTime: function() {
            return startTime;
        },

        // get the number of blocks cleared so far
        getBlocksCleared: function() {
            return blocksCleared;
        },

        // total amount needed
        getBlocksNeededForLevelup: function() {
            return blocksNeededForLevelup;
        },

        // ratio how many you have locally versus how many you need
        getLevelupProgress: function() {
            var dist = blocksNeededForLevelup - prevBlocksNeededForLevelup;
            var curr = blocksCleared - prevBlocksNeededForLevelup;
            
            return curr / dist;
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

            while (blocksCleared >= blocksNeededForLevelup) {
                currentLevel++;
                levelUpCount++;

                // recalculate blocks needed for level up
                prevBlocksNeededForLevelup = blocksNeededForLevelup;
                blocksNeededForLevelup = calculateBlocksNeededForLevelup(currentLevel);
            }

            return levelUpCount;
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
            cc.assert(data || data.amount, "Must define a non zero amount to add to score in data object");

            var amount = (typeof data === "number") ? data : data.amount;

            var bonus = data.bonus;
            if(bonus) amount += bonus;

            currentScore += amount;
            return amount;
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
            // construct a result to push into combo records
            // by concatenating to given data
            var result = data || {};
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
        },

        isPowerupMode: function() {
            return powerupMode;
        },

        setPowerupMode: function() {
            powerupMode = true;
        },

        setStage: function(newStage) {
            stage = newStage;
        },

        getStage: function() {
            return stage;
        }
    }
}());