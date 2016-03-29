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

if(cc.sys.isNative)
    NJ.fontScalingFactor = 1;
else
    NJ.fontScalingFactor = 4;

// node tags
NJ.tags = {
    PAUSABLE: 9001
};

// combo thresholds
NJ.comboThresholds = (function() {
    var data = [
        {
            lengthThreshold: 4,
            title: "Nice!",
            color: cc.color("#11ff11"),
            scoreBonus: 400
        },
        {
            lengthThreshold: 6,
            title: "Amazing!",
            color: cc.color("#ffee11"),
            scoreBonus: 1200
        },
        {
            lengthThreshold: 9,
            title: "Holy SHIT!!!",
            color: cc.color("ff0011"),
            scoreBonus: 3600
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
NJ.DANGER_THRESHOLD = 0.75;