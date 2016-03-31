/**
 * Created by jonathanlu on 3/25/16.
 */

var NJ = NJ || {};

// shades of purple, from white through prurples down to black, then in reverse
// from http://www.tutorialrepublic.com/html-reference/html-color-picker.php
// used for showing which blocks are powerups
NJ.purpleColors = [
    cc.color("#000000"),
    cc.color("#0D0511"),
    cc.color("#1A0A22"),
    cc.color("#270F33"),
    cc.color("#351445"),
    cc.color("#421A56"),
    cc.color("#4F1F67"),
    cc.color("#5D2479"),
    cc.color("#6A298A"),
    cc.color("#772E9B"),
    cc.color("#8534AD"),
    cc.color("#9148B5"),
    cc.color("#9D5CBD"),
    cc.color("#A970C5"),
    cc.color("#B585CD"),
    cc.color("#C299D6"),
    cc.color("#CEADDE"),
    cc.color("#DAC2E6"),
    cc.color("#E6D6EE"),
    cc.color("#F2EAF6"),
    cc.color("#FFFFFF"), // black
    cc.color("#F2EAF6"),
    cc.color("#E6D6EE"),
    cc.color("#DAC2E6"),
    cc.color("#CEADDE"),
    cc.color("#C299D6"),
    cc.color("#B585CD"),
    cc.color("#A970C5"),
    cc.color("#9D5CBD"),
    cc.color("#9148B5"),
    cc.color("#8534AD"),
    cc.color("#772E9B"),
    cc.color("#6A298A"),
    cc.color("#5D2479"),
    cc.color("#4F1F67"),
    cc.color("#421A56"),
    cc.color("#351445"),
    cc.color("#270F33"),
    cc.color("#1A0A22"),
    cc.color("#0D0511"),
    cc.color("#000000")
];

// pastels, pinks & purples
// from http://www.colourlovers.com/palette/4206184/I_Want_Candy
NJ.pastelPinkColors = [
    cc.color("E3E3BD"),
    cc.color("E5B5AB"),
    cc.color("C5EDD3"),
    cc.color("C28897"),
    cc.color("B8566D"),
];

// neon palette
// from http://www.colourlovers.com/palette/55400/Neon_Virus
NJ.neonColors = [

    cc.color("#BA01FF"), // dark purple
    cc.color("#228DFF"), // blue
    cc.color("#00FFF2"), // cyan
    cc.color("#00FF4D"), // aqua
    cc.color("#04C714"), // darker green
    cc.color("#F7FF00"), // yellow
    cc.color("#FF7C0A"), // orange
    cc.color("#FF0000"), // red
    cc.color("#FF0092"), // magenta

];

NJ.getColor = function (colorString, index) {
    var colorArray = null;
    if (colorString == "neon")
        colorArray = NJ.neonColors;
    else if (colorString == "purple")
        colorArray = NJ.purpleColors;
    else if (colorString == "pastelPink")
        colorArray = NJ.pastelPinkColors;

    if (colorArray) {
        index = index || Math.floor(Math.random() * colorArray.length);

        index %= colorArray.length;
        if (index < 0) {
            index = (index + colorArray.length) % colorArray.length;
        }

        return colorArray[index];
    }

    return null;
}


NJ.selectionColors = (function() {
    var data = [
        // color palette from: http://www.color-hex.com/color-palette/8075
        cc.color(186, 39, 39),  // red
        cc.color(236, 157, 34), // orange
        cc.color(200, 212, 44), // yellow
        cc.color(65, 188, 49),  // green
        cc.color(44, 107, 173)  // blue
    ];

    return {
        // returns the next color in this.selectionColors[]
        // used for highlighting blocks in rainbow (or whatever) order
        getNextColor: function(index) {
            if (typeof index === 'undefined')
                index = 0;

            index %= data.length;
            return data[index];
        }
    };
}());

// returns the hex string representing the color with modified brightness
NJ.blendColors = function(color1, color2) {
    var r = color1.r + color2.r;
    var g = color1.g + color2.g;
    var b = color1.b + color2.b;

    return '#' +
        ((0|(1<<8) + r).toString(16)).substr(1) +
        ((0|(1<<8) + g).toString(16)).substr(1) +
        ((0|(1<<8) + b).toString(16)).substr(1);
};

NJ.colorWithBrightness = function(color, brightness) {
    var r = color.r;
    var g = color.g;
    var b = color.b;

    return cc.color('#' +
        ((0|(1<<8) + r * brightness).toString(16)).substr(1) +
        ((0|(1<<8) + g * brightness).toString(16)).substr(1) +
        ((0|(1<<8) + b * brightness).toString(16)).substr(1));
};