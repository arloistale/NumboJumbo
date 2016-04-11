/**
 * Created by jonathanlu on 3/25/16.
 */

var NJ = NJ || {};

NJ.themes = (function() {

    var _strokeTypes = {
        none: 0,
        circle: 1,
        geometric: 2
    };

    var data = [
        // light theme
        {
            backgroundColor: cc.color("#F0EBD0"),

            defaultLabelColor: cc.color("#332F2A"),
            defaultButtonColor: cc.color("#6C6760"),

            playButtonColor: cc.color("#6C6760"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

            isBlocksFilled: true,
            strokeType: _strokeTypes.none,

            blockColors: [
                // aqua
                cc.color("#33A5BA"),

                // warm yellow
                cc.color("#F9D74A"),

                // pinkish red
                cc.color("#E81B58"),

                // warm teal
                cc.color("#52C9A8"),

                // intense blue
                cc.color("#5D74C9"),

                // orange
                cc.color("#F88A2D"),

                // lime
                cc.color("#C7EA2B"),

                // violent red
                cc.color("#F02A31"),

                // warm purple
                cc.color("#C658AC")
            ]
        },
        // dark theme
        {
            backgroundColor: cc.color("#332F2A"),

            defaultLabelColor: cc.color("#ffffff"),
            defaultButtonColor: cc.color("#424242"),

            playButtonColor: cc.color("#424242"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

            isBlocksFilled: true,
            strokeType: _strokeTypes.none,

            blockColors: [
                // aqua
                cc.color("#33A5BA"),

                // warm yellow
                cc.color("#F9D74A"),

                // pinkish red
                cc.color("#E81B58"),

                // warm teal
                cc.color("#52C9A8"),

                // intense blue
                cc.color("#5D74C9"),

                // orange
                cc.color("#F88A2D"),

                // lime
                cc.color("#C7EA2B"),

                // violent red
                cc.color("#F02A31"),

                // warm purple
                cc.color("#C658AC")
            ]
        },
        // dark circle stroke theme
        {
            backgroundColor: cc.color("#332F2A"),

            defaultLabelColor: cc.color("#ffffff"),
            defaultButtonColor: cc.color("#424242"),

            playButtonColor: cc.color("#424242"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

            isBlocksFilled: false,
            strokeType: _strokeTypes.circle,

            blockColors: [
                // aqua
                cc.color("#33A5BA"),

                // warm yellow
                cc.color("#F9D74A"),

                // pinkish red
                cc.color("#E81B58"),

                // warm teal
                cc.color("#52C9A8"),

                // intense blue
                cc.color("#5D74C9"),

                // orange
                cc.color("#F88A2D"),

                // lime
                cc.color("#C7EA2B"),

                // violent red
                cc.color("#F02A31"),

                // warm purple
                cc.color("#C658AC")
            ]
        },
        // dark geometric stroke theme
        {
            backgroundColor: cc.color("#332F2A"),

            defaultLabelColor: cc.color("#ffffff"),
            defaultButtonColor: cc.color("#424242"),

            playButtonColor: cc.color("#424242"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

            isBlocksFilled: false,
            strokeType: _strokeTypes.geometric,

            blockColors: [
                // aqua
                cc.color("#33A5BA"),

                // warm yellow
                cc.color("#F9D74A"),

                // pinkish red
                cc.color("#E81B58"),

                // warm teal
                cc.color("#52C9A8"),

                // intense blue
                cc.color("#5D74C9"),

                // orange
                cc.color("#F88A2D"),

                // lime
                cc.color("#C7EA2B"),

                // violent red
                cc.color("#F02A31"),

                // warm purple
                cc.color("#C658AC")
            ]
        }
    ];

    var main = data[0];

    var _themeIndex = 0;

    return {
        // expose the stroketypes enum
        strokeTypes: _strokeTypes,

        // here we expose properties of the current main theme
        backgroundColor: main.backgroundColor,

        defaultLabelColor: main.defaultLabelColor,
        defaultButtonColor: main.defaultButtonColor,

        playButtonColor: main.playButtonColor,
        jumbosButtonColor: main.jumbosButtonColor,
        loginButtonColor: main.loginButtonColor,
        settingsButtonColor: main.settingsButtonColor,

        isBlocksFilled: main.isBlocksFilled,
        strokeType: main.strokeType,

        blockColors: main.blockColors,

        /**
         * Toggle between themes
         */
        toggle: function() {
            _themeIndex = (_themeIndex + 1) % data.length;
            main = data[_themeIndex];

            for(var key in this) {
                if(key == 'toggle' || key == 'strokeTypes')
                    continue;

                if(this.hasOwnProperty(key)) {
                    this[key] = main[key];
                }
            }
        }
    }
}());

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
    cc.color("#228DFF"), // blue
    cc.color("#00FFF2"), // cyan
    cc.color("#00FF4D"), // aqua
    cc.color("#FFFF00"), // yellow
    cc.color("#FFA200"), // light orange
    cc.color("#FF4D00"), // deep orange
    cc.color("#FF0000"), // red
    cc.color("#FF0092"), // magenta
    cc.color("#BA01FF") // dark purple
];

NJ.happyColors = [
    cc.color("#5CACC4"),
    cc.color("#8CD19D"),
    cc.color("#CEE879"),
    cc.color("#FCB653"),
    cc.color("#FF5254")
];

NJ.getColor = function (colorString, index) {
    var colorArray = null;
    if (colorString == "neon")
        colorArray = NJ.neonColors;
    else if (colorString == "purple")
        colorArray = NJ.purpleColors;
    else if (colorString == "pastelPink")
        colorArray = NJ.pastelPinkColors;
    else if (colorString == "light")
        colorArray = NJ.themes.blockColors;

    if (colorArray) {
        index %= colorArray.length;
        if (index < 0) {
            index = (index + colorArray.length) % colorArray.length;
        }

        return colorArray[index];
    }

    return null;
};


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