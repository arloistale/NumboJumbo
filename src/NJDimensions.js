/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

// button sizes as a percentage of reference dimension (the minimum of the visible width and height)
NJ.uiSizes = {
    // elements
    headerBar: 0.12,
    shopArea: 0.24,
    promoArea: 0.24,
    toolbar: 0.12,

    divider: 0.0025,

    // shop elements
    bubblesArea: 0.24,
    themesArea: 0.85,
    doublerArea: 0.24,

    // bar buttons are calculated based on their bar content sizes
    barButton: 0.7,

    // buttons
    playButton: 0.28,
    optionButton: 0.15,
    textButton: 0.075,

    // labels
    large: 0.2,
    header: 0.1,
    header2: 0.07,
    sub: 0.05
};

// the size of blocks in the game as a percentage of each level grid cell size
NJ.blockCellSize = 0.7;

// gets a screen dimension from a given percentage from 0 to 1
// this is calculated from the smaller of the screen dimensions
NJ.calculateScreenDimensionFromRatio = function(ratio) {
    return Math.min(cc.visibleRect.width, cc.visibleRect.height) * ratio;
};