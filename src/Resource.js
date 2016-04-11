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
        name: "OpenSansRegular",
        src: resRoot + "Fonts/OpenSansRegular.ttf"
    },

	// UI
    buttonImage: resRoot + "Images/Button.png",
    pauseImage: resRoot + "Images/ic_pause/ic_pause_2x.png",
    playImage: resRoot + "Images/ic_play/ic_play_2x.png",
    backImage: resRoot + "Images/ic_back/ic_back_2x.png",
    nextImage: resRoot + "Images/ic_next/ic_next_2x.png",
    helpImage: resRoot + "Images/ic_help/ic_help_2x.png",
    homeImage: resRoot + "Images/ic_home/ic_home_2x.png",
    settingsImage: resRoot + "Images/ic_settings/ic_settings_2x.png",
    retryImage: resRoot + "Images/ic_retry/ic_retry_2x.png",

    // ingame
    backgroundImage: resRoot + "Images/normal/middle.png",
    glowImage: resRoot + "Images/Glow.png",
    blockImage: resRoot + "Images/block.png",
    powerupImage: resRoot + "Images/powerup.png",
    alertImage: resRoot + "Images/alertOverlay.png",

    // sound
    menuTrack: resRoot + "Sounds/Track2.mp3",
    backgroundTrack: resRoot + "Sounds/Track1.mp3",
    electroSwingTrack: resRoot + "Sounds/Caravan_Palace_-_Clash.mp3",
    tickSound: resRoot + "Sounds/tick.mp3",
    plipSound: resRoot + "Sounds/plipSound.wav",
    plopSound: resRoot + "Sounds/Plop.wav",
    plopSound4: resRoot + "Sounds/Plop4.wav",
    plopSound5: resRoot + "Sounds/Plop5.wav",
    plopSound6: resRoot + "Sounds/Plop6.wav",
    plopSound7: resRoot + "Sounds/Plop7.wav",
    plopSound8: resRoot + "Sounds/Plop8.wav",
    plopSound9: resRoot + "Sounds/Plop9.wav",
    plopSound10: resRoot + "Sounds/Plop10.wav",
    plopSound11: resRoot + "Sounds/Plop11.wav",
    plopSound12: resRoot + "Sounds/Plop12.wav",
    plopSound13: resRoot + "Sounds/Plop13.wav",
    plopSound14: resRoot + "Sounds/Plop14.wav",
    clickSound: resRoot + "Sounds/clickSound.wav",

    progressSound1: resRoot + "Sounds/progress1.wav",
    progressSound2: resRoot + "Sounds/progress2.wav",
    progressSound3: resRoot + "Sounds/progress3.wav",
    progressSound4: resRoot + "Sounds/progress4.wav",
    progressSound5: resRoot + "Sounds/progress5.wav",
    progressSound6: resRoot + "Sounds/progress6.wav",
    progressSound7: resRoot + "Sounds/progress7.wav",
    progressSound8: resRoot + "Sounds/progress8.wav",
    progressSound9: resRoot + "Sounds/progress9.wav",
    progressSound10: resRoot + "Sounds/progress10.wav",
    progressSound11: resRoot + "Sounds/progress11.wav",
    progressSound12: resRoot + "Sounds/progress12.wav",

    levelupSound: resRoot + "Sounds/levelup.wav",

    applauseSound: resRoot + "Sounds/applause.wav",
    cheeringSound: resRoot + "Sounds/cheering.wav",


    // jsons
    jumboDistributionsJSON: resRoot + "jumbos.json",

    /*
    backBG: resRoot + "Images/normal/BG.png",
    backBottom: resRoot + "Images/normal/bottom.png",
    backMiddle: resRoot + "Images/normal/middle.png",
    backTop: resRoot + "Images/normal/Top.png",
    backVeryTop: resRoot + "Images/normal/verytop.png",
    backStars: resRoot + "Images/normal/stars.png"*/
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
    // ui
    res.playImage,
    res.settingsImage,
    res.backImage,
    res.nextImage,
    res.helpImage,
    res.buttonImage,

    // scene
    //res.backgroundImage,

    // sounds
    res.clickSound,
    res.menuTrack,

    // fonts
    res.mainFont.src
    //res.markerFont.firefoxSrc
];

var plops = [res.plopSound, res.plopSound4, res.plopSound5,
    res.plopSound6, res.plopSound7, res.plopSound8, res.plopSound9, res.plopSound10, res.plopSound11,
    res.plopSound12, res.plopSound13, res.plopSound14];

var progresses = [res.progressSound1, res.progressSound2, res.progressSound3, res.progressSound4,
    res.progressSound5, res.progressSound6, res.progressSound7, res.progressSound8,
    res.progressSound9, res.progressSound10, res.progressSound11, res.progressSound12];

// resources for ingame
var g_game = [
    // UI
    res.buttonImage,
    res.backImage,
    res.homeImage,
    res.pauseImage,
    res.retryImage,

    // Scene
    res.powerupImage,
    res.glowImage,
    res.blockImage,
    res.alertImage,

    // sounds
    res.tickSound,
    res.clickSound,
    res.plipSound,
    res.backgroundTrack,
    res.plopSound,
    res.plopSound4,
    res.plopSound5,
    res.plopSound6,
    res.plopSound7,
    res.plopSound8,
    res.plopSound9,
    res.plopSound10,
    res.plopSound11,
    res.plopSound12,
    res.plopSound13,
    res.plopSound14,

    res.progressSound1,
    res.progressSound2,
    res.progressSound3,
    res.progressSound4,
    res.progressSound5,
    res.progressSound6,
    res.progressSound7,
    res.progressSound8,
    res.progressSound9,
    res.progressSound10,
    res.progressSound11,
    res.progressSound12,

    res.levelupSound,
    res.applauseSound,
    res.cheeringSound,

    // fonts
    res.mainFont.src
/*
    res.backBottom,
    res.backMiddle,
    res.backTop*/
];