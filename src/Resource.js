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
    // Fonts
    markerFont: {
        name: "MarkerFelt",
        src: resRoot + "Fonts/MarkerFelt.ttf"
    },

	// images
    buttonImage: resRoot + "Images/Button.png",
    backgroundImage: resRoot + "Images/normal/middle.png",
    glowImage: resRoot + "Images/Glow.png",
    blockImage: resRoot + "Images/blocks.png",
    powerupImage: resRoot + "Images/powerup.png",

    // sound
    menuTrack: resRoot + "Sounds/Track2.mp3",
    backgroundTrack: resRoot + "Sounds/Track1.mp3",
    plip_plip: resRoot + "Sounds/plip_plip.wav",
    plop: resRoot + "Sounds/Plop.wav",
    tongue_click: resRoot + "Sounds/tongue_click.wav",
    
    // jsons
    jumboDistributionsJSON: resRoot + "jumbos.json",

    backBottom: resRoot + "Images/normal/back.png",
    backMiddle: resRoot + "Images/normal/middle.png",
    backTop: resRoot + "Images/normal/Top.png"
};

// returns proper font name based on platform
var b_getFontName = function(fontRes) {
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
    res.tongue_click,
    res.menuTrack,

    // fonts
    res.markerFont.src
];

// resources for ingame
var g_game = [
    // images
    res.glowImage,
    res.blockImage,
    res.buttonImage,

    // sounds
    res.tongue_click,
    res.plip_plip,
    res.plop,
    res.backgroundTrack,

    // fonts
    res.markerFont.src,

    res.backBottom,
    res.backMiddle,
    res.backTop
];