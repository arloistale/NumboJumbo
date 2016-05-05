/**
 * Created by jonathanlu on 3/25/16.
 */

var NJ = NJ || {};

NJ.themes = (function() {

    var data = [
        // light theme
        {
            backgroundColor: cc.color("#F0EBD0"),
            levelColor: cc.color("#6C6760"),

            defaultLabelColor: cc.color("#332F2A"),
            defaultButtonColor: cc.color("#6C6760"),

            playButtonColor: cc.color("#6C6760"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

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
            levelColor: cc.color("#6C6760"),

            defaultLabelColor: cc.color("#ffffff"),
            defaultButtonColor: cc.color("#424242"),

            playButtonColor: cc.color("#424242"),
            jumbosButtonColor: cc.color("#4AD87D"),
            loginButtonColor: cc.color("#5D74C9"),
            settingsButtonColor: cc.color("#33A5BA"),

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
        // here we expose properties of the current main theme
        backgroundColor: main.backgroundColor,
        levelColor: main.levelColor,

        defaultLabelColor: main.defaultLabelColor,
        defaultButtonColor: main.defaultButtonColor,

        playButtonColor: main.playButtonColor,
        jumbosButtonColor: main.jumbosButtonColor,
        loginButtonColor: main.loginButtonColor,
        settingsButtonColor: main.settingsButtonColor,

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

NJ.getColor = function (index) {
    var colorArray = NJ.themes.blockColors;

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