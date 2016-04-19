/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

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

NJ.fontSizes = {
    buttonSmall: 16,
    buttonMedium: 20,
    paragraph: 12,
    sub: 16,
    snippet: 24,
    header2: 22,
    header: 32,
    numbo: 22
};

// button sizes as a percentage of reference dimension (the minimum of the visible width and height)
NJ.uiSizes = {
    // elements
    headerBar: 0.09,
    toolbar: 0.09,

    // buttons
    playButton: 0.35,
    optionButton: 0.15,
    textButton: 0.075
};

// the size of blocks in the game as a percentage of each level grid cell size
NJ.blockCellSize = 0.7;