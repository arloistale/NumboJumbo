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

// node tags
NJ.tags = {
    PAUSABLE: 9001
};

// combo thresholds
NJ.comboThresholds = (function() {
    var data = [
        {
            lengthThreshold: 5,
            title: "Nice!",
            color: cc.color("#11ff11"),
            scoreBonus: 250
        },
        {
            lengthThreshold: 6,
            title: "Amazing!",
            color: cc.color("#ffee11"),
            scoreBonus: 1000
        },
        {
            lengthThreshold: 7,
            title: "Holy SHIT!!!",
            color: cc.color("ff0011"),
            scoreBonus: 5000
        }
    ];

    return {
        get: function(comboLength) {
            var curr = null;

            for(var i = 0; i < data.length; i++) {
                if(comboLength >= data[i].lengthThreshold)
                    curr = data[i];
            }

            return curr;
        }
    }
}());

// game settings
NJ.DANGER_THRESHOLD = 0.85;