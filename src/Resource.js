/**
 *
 * All resource files go here.
 *
 */

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

var b_getFontName = function(fontRes) {
    if (cc.sys.isNative) {
        return fontRes.srcs[0];
    } else {
        return fontRes.name;
    }
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
<<<<<<< HEAD
=======

var g_menu = [
    // images
    res.backgroundImage,
    res.buttonImage,

    // sounds
    res.menuTrack,

    // fonts
    b_getFontName(res.markerFontTTF)
];

var g_game = [
    // images
    res.backgroundImage,
    res.glowImage,
    res.blockImage,

    // sounds
    res.backgroundTrack,
    res.successTrack,

    // fonts
    b_getFontName(res.markerFontTTF)
];

