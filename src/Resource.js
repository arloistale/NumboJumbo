/**
 *
 * All resource files go here.
 *
 */

// list of resource definitions
var res = {
    // Fonts
    markerFontTTF: {
        type: "font",
        name: "Marker Felt",
        srcs: ["res/Fonts/MarkerFelt.ttf"]
    },

	// images
    buttonImage: "res/Images/Button.png",
    backgroundImage: "res/Images/Background.png",
    glowImage: "res/Images/Glow.png",
    blockImage: "res/Images/Projectile.png",

    // sound
    menuTrack: "res/Sounds/Track2.mp3",
    backgroundTrack: "res/Sounds/Track1.mp3",
    successTrack: "res/Sounds/Ka-Ching.wav"
};

// returns proper font name based on platform
var b_getFontName = function(fontRes) {
    if (cc.sys.isNative) {
        return fontRes.srcs[0];
    } else {
        return fontRes.name;
    }
}

// resources for the main menu of the game
var g_menu = [
    // images
    res.backgroundImage,
    res.buttonImage,

    // sounds
    res.menuTrack,

    // fonts
    b_getFontName(res.markerFontTTF)
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
    b_getFontName(res.markerFontTTF)
];

