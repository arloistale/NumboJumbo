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
NJ.buttonSizes = {
    play: 0.35,
    back: 0.15,
    opt: 0.15
};

// UI
NJ.HEADER_HEIGHT = NJ.fontSizes.header2 * 1.5;