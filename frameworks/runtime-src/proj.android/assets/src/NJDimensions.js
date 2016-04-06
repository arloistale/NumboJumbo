/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

NJ.fontSizes = {
    buttonSmall: 16,
    buttonMedium: 20,
    paragraph: 12,
    sub: 16,
    snippet: 24,
    header2: 22,
    header: 32,
    numbo: 24
};

// button sizes as a percentage of reference dimension (the minimum of the visible width and height)
NJ.uiSizes = {
    // elements
    headerBar: 0.1,

    // buttons
    playButton: 0.35,
    optionButton: 0.15,
    textButton: 0.075
};

// the size of blocks in the game as a percentage of each level grid cell size
NJ.blockCellSize = 0.7;