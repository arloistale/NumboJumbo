/**
 * Created by jonathanlu on 3/25/16.
 */

var NJ = NJ || {};

// constant colors
NJ.colors = {
    // global colors
    //facebookColor: cc.color("#3b5998")
};

// themed colors
NJ.themes = (function() {

    var data = [
        // white theme
        {
            themeName: "White",
            themeCost: 0,
            isPurchased: true,

            backgroundColor: cc.color("#ffffff"),

            defaultLabelColor: cc.color("#6C6760"),
            specialLabelColor: cc.color("#50aa91"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#9e9e9e"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            stoppersColor: cc.color("#50aa91"),
            convertersColor: cc.color("#50aa91"),
            hintsColor: cc.color("#50aa91"),
            scramblersColor: cc.color("#50aa91"),

            dividerColor: cc.color("#9e9e9e"),

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
        },

        // dark theme
        {
            themeName: "Dark",
            themeCost: 15000,
            isPurchased: false,

            backgroundColor: cc.color("#332F2A"),

            defaultLabelColor: cc.color("#ffffff"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            stoppersColor: cc.color("#33a5ba"),
            convertersColor: cc.color("#33a5ba"),
            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#33a5ba"),

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
        },

        // fall theme
        {
            themeName: "Fall",
            themeCost: 50000,
            isPurchased: false,

            backgroundColor: cc.color("#d7d7b8"),

            defaultLabelColor: cc.color("#635063"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            stoppersColor: cc.color("#00a896"),
            convertersColor: cc.color("#00A896"),
            hintsColor: cc.color("#00A896"),
            scramblersColor: cc.color("#00A896"),

            dividerColor: cc.color("#6c6760"),

            blockColors: [

                // grey-blue            1
                cc.color("5F715B"),

                // gold                 2
                cc.color("#E6A60F"),

                // cayenne              3
                cc.color("d55023"),

                // faded purple         4
                cc.color("957568"),

                // vomit green          5
                cc.color("#4A5200"),

                // burnt orange         6
                cc.color("#F1540F"),

                //forest green          7
                cc.color("3D5E29"),

                // old brick red        8
                cc.color("#BB1414"),

                // chartreuse           9
                cc.color("A6AD3C")
            ]
        },

        // prince theme
        {
            themeName: "Prince",
            themeCost: 100000,
            isPurchased: false,

            // greyish light purple
            //backgroundColor: cc.color("#635063"),

            // fuckin black
            backgroundColor: cc.color("000000"),

            defaultLabelColor: cc.color("#FFFDAA"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            stoppersColor: cc.color("#33a5ba"),
            convertersColor: cc.color("#33a5ba"),
            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#33a5ba"),

            dividerColor: cc.color("#FFFDAA"),

            blockColors: [

                // fricking pink!
                cc.color("#dd156a"),

                // softer pink
                cc.color("#da509d"),

                // rich maroon
                cc.color("#991a3d"),

                // pure cyan
                cc.color("#00adef"),

                // amaranth
                cc.color("#Cb2e91"),

                // facebook blue
                cc.color("#384fa2"),

                // bitch goddess
                cc.color("#7d51a1"),

                // chicken pox
                cc.color("#ed1940"),

                // dying rose
                cc.color("e18a7c")
            ]
        },

        // sandy theme
        {
            themeName: "Sandy",
            themeCost: 15000,
            isPurchased: true,

            backgroundColor: cc.color("#F0EBD0"),

            defaultLabelColor: cc.color("#6C6760"),
            specialLabelColor: cc.color("#50aa91"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#424242"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            hintsColor: cc.color("#50aa91"),
            scramblersColor: cc.color("#00a896"),

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

        // sweet lolita theme
        {
            themeName: "Sweet Lolita",
            themeCost: 30000,
            isPurchased: true,

            // princess
            backgroundColor: cc.color("F8BAC6"),

            // barbie
            defaultLabelColor: cc.color("#C51162"),

            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#00a896"),

            dividerColor: cc.color("#C51162"),

            blockColors: [

                // lime
                cc.color("#C1DA6D"),

                // lemon
                cc.color("#EAD774"),

                // bubble gum
                cc.color("#F1718E"),

                // sky
                cc.color("#A9C0E3"),

                // pinky pie
                cc.color("#EC0774"),

                // salmon
                cc.color("#F5896B"),

                // dreamsicle
                cc.color("#F9A961"),

                // lilac
                cc.color("#A288BF"),

                // mint
                cc.color("#7BBF9A")
            ]
        }

    ];

    var main = data[0];
    var _themeIndex = 0;

    // all themes must be indexed
    for(var i = 0; i < data.length; ++i) {
        data[i].index = i;
    }

    return {
        // meta data
        hasLoaded: false,

        // here we expose properties of the current main theme
        themeName: main.themeName,

        backgroundColor: main.backgroundColor,

        defaultLabelColor: main.defaultLabelColor,
        specialLabelColor: main.specialLabelColor,
        specialLabelColor2: main.specialLabelColor2,
        defaultButtonColor: main.defaultButtonColor,
        defaultButtonForegroundColor: main.defaultButtonForegroundColor,

        stoppersColor: main.stoppersColor,
        convertersColor: main.convertersColor,
        hintsColor: main.hintsColor,
        scramblersColor: main.scramblersColor,

        dividerColor: main.dividerColor,

        playButtonColor: main.playButtonColor,
        jumbosButtonColor: main.jumbosButtonColor,
        loginButtonColor: main.loginButtonColor,
        settingsButtonColor: main.settingsButtonColor,

        blockColors: main.blockColors,

        // Initialization

        // load settings from local store
        load: function() {
            this.hasLoaded = true;

            var rawIndex = cc.sys.localStorage.getItem("themeIndex") || 0;

            this.activateThemeByIndex(parseInt(rawIndex));

            for(var i = 0; i < data.length; ++i) {
                data[i].isPurchased = cc.sys.localStorage.getItem("themesPurchased_" + i) == 'true';
            }

            data[0].isPurchased = true;
        },

        // save settings to local store
        // NOTE: Must be called to persist changes in settings
        save: function() {
            cc.sys.localStorage.setItem("themeIndex", JSON.stringify(NJ.themes.getActiveThemeIndex()));
            //cc.log("Saving" + NJ.themes.getActiveThemeIndex());

            for(var i = 0; i < data.length; ++i) {
                cc.sys.localStorage.setItem("themesPurchased_" + i, JSON.stringify(data[i].isPurchased));
            }
        },

        // get list of themes
        getList: function() {
            return data;
        },

        // get list of themes sorted by their cost
        getListSortedByCost: function() {
            return data.concat().sort(function(a, b){
                return a.themeCost - b.themeCost;
            });
        },

        // get the number of available themes
        getNumThemes: function(){
            return data.length;
        },

        // Activate a theme by its index,
        // which updates all the exposed properties
        activateThemeByIndex: function(index) {
            _themeIndex = index;

            main = data[_themeIndex];

            for(var key in main) {
                if(main.hasOwnProperty(key)) {
                    this[key] = main[key];
                }
            }
        },

        // purchase a theme according to its index
        // Note: this does not activate the theme for the user,
        purchaseThemeByIndex: function(index) {
            data[index].isPurchased = true;
        },

        // Get an arbitrary theme by its index
        getThemeByIndex: function(index) {
            return data[index];
        },

        // Get the currently active theme index
        getActiveThemeIndex: function() {
            return _themeIndex;
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