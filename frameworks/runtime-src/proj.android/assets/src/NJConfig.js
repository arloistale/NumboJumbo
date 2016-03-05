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

// blocks
NJ.BLOCK_TYPE = {
    NORMAL: 0
};

// game settings
NJ.DANGER_THRESHOLD = 0.75;