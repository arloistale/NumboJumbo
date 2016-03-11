/**
 *
 * All resource files go here.
 *
 */

var resRoot = "";

if(!cc.sys.isNative) {
    resRoot = "res/";
}

// list of resource definitions
var res = {

    mainFont: {
        name: "NunitoLight",
        src: resRoot + "Fonts/NunitoLight.ttf"
    },

    sinkinSansLightFont: {
        name: "SinkinSansLight",
        src: resRoot + "Fonts/SinkinSansLight.ttf"
    },

    sinkinSansRegularFont: {
        name: "SinkinSansRegular",
        src: resRoot + "Fonts/SinkinSansRegular.ttf"
    },

	// images
    buttonImage: resRoot + "Images/Button.png",
    backgroundImage: resRoot + "Images/normal/middle.png",
    glowImage: resRoot + "Images/Glow.png",
    blockImage: resRoot + "Images/block.png",
    powerupImage: resRoot + "Images/powerup.png",
    alertImage: resRoot + "Images/alertOverlay.png",

    // sound
    menuTrack: resRoot + "Sounds/Track2.mp3",
    backgroundTrack: resRoot + "Sounds/Track1.mp3",
    alertSound: resRoot + "Sounds/alert.mp3",
    plipSound: resRoot + "Sounds/plipSound.wav",
    plopSound: resRoot + "Sounds/Plop.wav",
    clickSound: resRoot + "Sounds/clickSound.wav",
    
    // jsons
    jumboDistributionsJSON: resRoot + "jumbos.json",

    backBG: resRoot + "Images/normal/BG.png",
    backBottom: resRoot + "Images/normal/bottom.png",
    backMiddle: resRoot + "Images/normal/middle.png",
    backTop: resRoot + "Images/normal/Top.png",
    backVeryTop: resRoot + "Images/normal/verytop.png",
    backStars: resRoot + "Images/normal/stars.png"

};

// returns proper font name based on platform
var b_getFontName = function(fontRes) {
    if(NJ.isFirefox === true) {
        return fontRes.firefoxName;
    }

    if(cc.sys.os == cc.sys.OS_ANDROID)
        return fontRes.src;


    return fontRes.name;
};

// resources for the main menu of the game
var g_menu = [
    // images
    res.backgroundImage,
    res.buttonImage,

    // sounds
    res.clickSound,
    res.menuTrack,

    // fonts
    res.mainFont.src,
    //res.markerFont.firefoxSrc
];

// resources for ingame
var g_game = [
    // images
    res.powerupImage,
    res.glowImage,
    res.blockImage,
    res.buttonImage,
    res.alertImage,

    // sounds
    res.clickSound,
    res.plipSound,
    res.plopSound,
    res.backgroundTrack,

    // fonts
    res.mainFont.src,

    res.backBottom,
    res.backMiddle,
    res.backTop
];