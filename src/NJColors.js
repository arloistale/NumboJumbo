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
            /*
        // light theme
        {
            themeName: "Sandy",
            themeCost: 15000,
            isPurchased: true,

            backgroundColor: cc.color("#F0EBD0"),

            defaultLabelColor: cc.color("#6C6760"),
            specialLabelColor: cc.color("#50aa91"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#424242"),

            shadowColor: cc.color("#ffffff"),

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
        */
        // white theme
        {
            themeName: "White",
            themeCost: 0,
            isPurchased: true,

            backgroundColor: cc.color("#ffffff"),

            defaultLabelColor: cc.color("#6C6760"),
            specialLabelColor: cc.color("#50aa91"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            hintsColor: cc.color("#50aa91"),
            scramblersColor: cc.color("#00a896"),

            shadowColor: cc.color("#ffffff"),

            dividerColor: cc.color("#6c6760"),

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

            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#00a896"),

            shadowColor: cc.color("#ffffff"),

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

            // lighter brown
            //backgroundColor: cc.color("#865810"),
            
            // new hotfix color because ewwww
            backgroundColor: cc.color("#d7d7b8"),

            // darker brown
            //backgroundColor: cc.color("5a3111"),

            //light shrimpy salmon
            //backgroundColor: cc.color("ffcba6"),

            defaultLabelColor: cc.color("#635063"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#00a896"),

            shadowColor: cc.color("#ffffff"),

            dividerColor: cc.color("#ffffff"),

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

            // more lighter grayer
            backgroundColor: cc.color("#635063"),

            //pale yellow???
            //backgroundColor: cc.color("#FFFDAA"),

            defaultLabelColor: cc.color("#FFFDAA"),
            specialLabelColor: cc.color("#33A5BA"),
            specialLabelColor2: cc.color("#00A896"),
            defaultButtonColor: cc.color("#6C6760"),
            defaultButtonForegroundColor: cc.color("#ffffff"),

            hintsColor: cc.color("#33a5ba"),
            scramblersColor: cc.color("#00a896"),

            shadowColor: cc.color("#FFFDAA"),

            dividerColor: cc.color("#FFFDAA"),

            blockColors: [

                // fricking pink!
                cc.color("#DE0569"),
                          
                // light pruple?!
                cc.color("#800080"),

                // rich maroon
                cc.color("#99173C"),

                // favorite jeans
                cc.color("#424254"),

                // amaranth
                cc.color("#CC2A41"),

                // some kinda damn purple, what do you want from me
                cc.color("#480048"),

                // bitch goddess
                cc.color("#601848"),

                // chicken pox
                cc.color("#FA023C"),

                // dying rose
                cc.color("E28B7D")
            ]
        }

        /*

        // pastel theme
        {
             themeName: "Pastels",
             themeCost: 25000,
             isPurchased: false,

             // evening cloud
             backgroundColor: cc.color("#2E2633"),

             // more lighter grayer
             //backgroundColor: cc.color("#635063"),

             //pale yellow???
             //backgroundColor: cc.color("#FFFDAA"),

             defaultLabelColor: cc.color("#FFFDAA"),
             specialLabelColor: cc.color("#33A5BA"),
             specialLabelColor2: cc.color("#00A896"),
             defaultButtonColor: cc.color("#6C6760"),

             shadowColor: cc.color("#FFFDAA"),

             dividerColor: cc.color("#FFFDAA"),

             blockColors: [

             // faded green
             cc.color("#A4D05F"),

             // above the world
             cc.color("#3FB8AF"),

             // high heel
             cc.color("#FF3D7F"),

             // some kinda yellow w/ some orange shit
             cc.color("#FFBE40"),

             // periwinkle
             cc.color("#906CD7"),

             // salmon
             cc.color("#F45639"),

             // ash
             cc.color("#95877E"),

             // purple
             cc.color("#D662A8"),

             // GREEN
             cc.color("#57BA50")
             ]
         },


 */
    ];

    var _lightTheme = data[0];
    var _darkTheme = data[1];

    var main = _lightTheme;
    var _themeIndex = 0;

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

        hintsColor: main.hintsColor,
        scramblersColor: main.scramblersColor,

        shadowColor: main.shadowColor,

        dividerColor: main.dividerColor,

        playButtonColor: main.playButtonColor,
        jumbosButtonColor: main.jumbosButtonColor,
        loginButtonColor: main.loginButtonColor,
        settingsButtonColor: main.settingsButtonColor,

        blockColors: main.blockColors,

        // get list of themes
        getList: function() {
            return data;
        },

        updateList: function(list) {
            data = list;
        },

        /**
         * Set theme according to theme index
         */
        setThemeByIndex: function(index) {
            _themeIndex = index;
            main = data[_themeIndex];

            for(var key in main) {
                if(main.hasOwnProperty(key)) {
                    this[key] = main[key];
                }
            }
        },

        purchaseThemeByIndex: function(index) {
            data[index].isPurchased = true;
        },

        getThemeByIndex: function(index) {
            return data[index];
        },

        getThemeIndex: function() {
            return _themeIndex;
        }
    }
}());

// load settings from local store
NJ.loadThemes = function() {
    NJ.themes.hasLoaded = true;

    // if this is our first time then save defaults
    if(!(cc.sys.localStorage.getItem('themesHasLoaded') == 'true')) {
        NJ.saveThemes();
        return;
    }

    var rawIndex = cc.sys.localStorage.getItem("themeIndex");

    NJ.themes.setThemeByIndex(parseInt(rawIndex));

    var themesList = NJ.themes.getList();

    for(var i = 0; i < themesList.length; ++i) {
        themesList[i].isPurchased = cc.sys.localStorage.getItem("themesPurchased_" + i) == 'true';
    }

    NJ.themes.updateList(themesList);
};

// save settings to local store
// NOTE: Must be called to persist changes in settings
NJ.saveThemes = function() {
    cc.sys.localStorage.setItem("themesHasLoaded", JSON.stringify(true));
    cc.sys.localStorage.setItem("themeIndex", JSON.stringify(NJ.themes.getThemeIndex()));
    //cc.log("Saving" + NJ.themes.getThemeIndex());

    var themesList = NJ.themes.getList();

    for(var i = 0; i < themesList.length; ++i) {
        cc.sys.localStorage.setItem("themesPurchased_" + i, JSON.stringify(themesList[i].isPurchased));
    }
};

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