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
            specialLabelColor: cc.color("#50aa91"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),

            shadowColor: cc.color("#6C6760"),

            dividerColor: cc.color("#6c6760"),

            blockColors: [

                // warm teal
                cc.color("#50aa91"),

                // warm yellow
                cc.color("e2b349"),

                // pinkish red
                cc.color("#c53e66"),

                // chartreuse
                cc.color("#52ab73"),

                // intense blue
                cc.color("#6977a8"),

                // orange
                cc.color("#cc7b43"),

                // darkish green teal
                cc.color("#794e84"),

                // violent red
                cc.color("#c23d42"),

                // warm purple
                cc.color("#9c3783")
            ]
        },
        // dark theme
        {
            backgroundColor: cc.color("#332F2A"),
            levelColor: cc.color("#6C6760"),

            defaultLabelColor: cc.color("#ffffff"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#424242"),

            shadowColor: cc.color("#F0EBD0"),

            dividerColor: cc.color("#ffffff"),

            blockColors: [
                // aqua
                cc.color("#33A5BA"),

                // warm yellow
                cc.color("#f7b52b"),

                // pinkish red
                cc.color("#E81B58"),

                // warm teal
                cc.color("#52C9A8"),
                //cc.color("33ee33"),

                // intense blue
                cc.color("#5D74C9"),

                // orange
                cc.color("#F88A2D"),

                // dark red orange
                cc.color("#F55D16"),

                // violent red
                cc.color("#F02A31"),

                // warm purple
                cc.color("#C658AC")
            ]
        }
    ];

    var _lightTheme = data[0];
    var _darkTheme = data[1];

    var main = _lightTheme;
    var _themeIndex = 0;

    return {
        lightTheme: _lightTheme,
        darkTheme: _darkTheme,

        // here we expose properties of the current main theme
        backgroundColor: main.backgroundColor,
        levelColor: main.levelColor,

        defaultLabelColor: main.defaultLabelColor,
        specialLabelColor: main.specialLabelColor,
        specialLabelColor2: main.specialLabelColor2,
        defaultButtonColor: main.defaultButtonColor,

        shadowColor: main.shadowColor,

        dividerColor: main.dividerColor,

        playButtonColor: main.playButtonColor,
        jumbosButtonColor: main.jumbosButtonColor,
        loginButtonColor: main.loginButtonColor,
        settingsButtonColor: main.settingsButtonColor,

        blockColors: main.blockColors,

        /**
         * Toggle between themes
         */
        toggle: function(index) {
            _themeIndex = index;
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