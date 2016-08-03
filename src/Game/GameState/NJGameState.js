/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

// Game state is now properly encapsulated, use the functions for manipulation and stuff
// DO NOT attempt to create functionality to set any of these properties directly
// USE the given getters and setters
NJ.gameState = (function() {

    // constants
    const NUM_STOPPERS_PER_ROUND = 1;
    const NUM_HINTS_PER_ROUND = 10;
    const NUM_CONVERTS_PER_ROUND = 5;
    const NUM_SCRAMBLES_PER_ROUND = 3;

    // meta data
    var startTime = 0;

    // in game metric tracking
    var prevBlocksNeededForLevelup = 0;
    var blocksNeededForLevelup = 0;
    var blocksCleared = 0;
    var movesMade = 0;
    var currentLevel = 1;
    var currentScore = 0;

    var stoppersRemaining = -1;
    var convertersRemaining = -1;
    var scramblesRemaining = -1;
    var hintsRemaining = -1;

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
            movesMade = 0;
            currentScore = 0;
            currentLevel = 1;
            prevBlocksNeededForLevelup = calculateBlocksNeededForLevelup(currentLevel - 1);
            blocksNeededForLevelup = calculateBlocksNeededForLevelup(currentLevel);
            blocksCleared = 0;

            stoppersRemaining = NUM_STOPPERS_PER_ROUND;
            convertersRemaining = NUM_CONVERTS_PER_ROUND;
            scramblesRemaining = NUM_SCRAMBLES_PER_ROUND;
            hintsRemaining = NUM_HINTS_PER_ROUND;
        },

        ///////////////////////
        // Consumables Logic //
        ///////////////////////

        getStoppersRemaining: function(){
            return stoppersRemaining;
        },

        decrementStoppersRemaining: function(){
            cc.assert(stoppersRemaining > 0, "ERROR: attempted to stopper too many times!");
            stoppersRemaining--;
        },

        incrementStoppersRemaining: function(){
            stoppersRemaining++;
        },

        getConvertersRemaining: function() {
            return convertersRemaining;
        },

        decrementConvertersRemaining: function() {
            cc.assert(convertersRemaining > 0, "ERROR: attempted to convert too many times!");
            convertersRemaining--;
        },

        incrementConvertersRemaining: function() {
            convertersRemaining++;
        },

        getScramblesRemaining: function() {
            return scramblesRemaining;
        },

        decrementScramblesRemaining: function() {
            cc.assert(scramblesRemaining > 0, "ERROR: attempted to scramble board too many times!");
            scramblesRemaining--;
        },

        incrementScramblesRemaining: function() {
            scramblesRemaining++;
        },

        getHintsRemaining: function() {
            return hintsRemaining;
        },

        decrementHintsRemaining: function() {
            cc.assert(hintsRemaining > 0, "ERROR: attempted to get a hint too many times!");
            hintsRemaining--;
        },

        incrementHintsRemaining: function() {
            hintsRemaining++;
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

        setStartTime: function(newTime) {
            startTime = newTime;
        },

        // get the number of blocks cleared so far
        getBlocksCleared: function() {
            return blocksCleared;
        },

        // total amount needed
        getBlocksNeededForLevelup: function() {
            return blocksNeededForLevelup;
        },

        // add moves made
        addMovesMade: function(delta) {
            if(typeof delta === 'undefined')
                movesMade++;
            else
                movesMade += delta;
        },

        // get moves made
        getMovesMade: function() {
            return movesMade;
        },

        // ratio of level progress based on blocks cleared vs blocks needed this level
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
        addScore: function(amount) {
            currentScore += amount;
            return currentScore;
        },

        // get the current game score
        getScore: function() {
            return currentScore;
        }
    }
}());