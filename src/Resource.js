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
    markerFontTTF: {
        name: "Marker Felt",
        src: resRoot + "Fonts/MarkerFelt.ttf"
    },

	// images
    buttonImage: resRoot + "Images/Button.png",
    backgroundImage: resRoot + "Images/Background.png",
    glowImage: resRoot + "Images/Glow.png",
    blockImage: resRoot + "Images/Projectile.png",

    // sound
    menuTrack: resRoot + "Sounds/Track2.mp3",
    backgroundTrack: resRoot + "Sounds/Track1.mp3",
    successTrack: resRoot + "Sounds/Ka-Ching.wav"
};

// returns proper font name based on platform
var b_getFontName = function(fontRes) {
    //if(cc.sys.os == cc.sys.OS_ANDROID)
      //  return fontRes.src[0];

    return fontRes.name;
};

// resources for the main menu of the game
var g_menu = [
    // images
    res.backgroundImage,
    res.buttonImage,

    // sounds
    res.menuTrack,

    // fonts
    res.markerFontTTF.src
];

// resources for ingame
var g_game = [
    // images
    res.backgroundImage,
    res.glowImage,
    res.blockImage,
    res.buttonImage,

    // sounds
    res.backgroundTrack,
    res.successTrack,

    // fonts
    res.markerFontTTF.src
];