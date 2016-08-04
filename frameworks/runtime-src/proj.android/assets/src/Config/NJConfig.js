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

// modes
NJ.modekeys = {
    minuteMadness: "mm",
    moves: "mov",
    react: "re",
    infinite: "inf",
    tutorial: "tut"
};

// each name corresponds to the keys above
NJ.modeNames = {
    mm: "Timed",
    mov: "Moves",
    re: "Stack",
    inf: "Infinite",
    man: "Mania"
};

// game settings
NJ.DANGER_THRESHOLD = 0.85;