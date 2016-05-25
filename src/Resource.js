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

        x1: {
            fnt: resRoot + "Fonts/mainFont.fnt",
            png: resRoot + "Fonts/mainFont.png"
        },

        x2: {
            fnt: resRoot + "Fonts/mainFont2x.fnt",
            png: resRoot + "Fonts/mainFont2x.png"
        }
    },

    // Loader
    logoImage: resRoot + "Images/logo.png",

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
    statsImage: resRoot + "Images/ic_stats/ic_stats_2x.png",
    trophyImage: resRoot + "Images/ic_trophy/ic_trophy_2x.png",

    // ingame
    blockImage: resRoot + "Images/blockImage.png",
    alertImage: resRoot + "Images/alertOverlay.png",
    handImage: resRoot + "Images/ic_hand/ic_hand_2x.png",

    // music

    trackPadMellow: resRoot + "Sounds/Music/PadMellowV2.mp3",
    trackDauntinglyMellow: resRoot + "Sounds/Music/DauntinglyMellowV3.mp3",
    trackQuicker: resRoot + "Sounds/Music/QuickerV1.mp3",
    
    // audio
    tickSound: resRoot + "Sounds/tick.mp3",
    plipSound: resRoot + "Sounds/plipSound.mp3",

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

    bloopSound1: resRoot + "Sounds/boop1.wav",
    bloopSound2: resRoot + "Sounds/boop2.wav",
    bloopSound3: resRoot + "Sounds/boop3.wav",
    bloopSound4: resRoot + "Sounds/boop4.wav",
    bloopSound5: resRoot + "Sounds/boop5.wav",
    bloopSound6: resRoot + "Sounds/boop6.wav",
    bloopSound7: resRoot + "Sounds/boop7.wav",
    bloopSound8: resRoot + "Sounds/boop8.wav",
    bloopSound9: resRoot + "Sounds/boop9.wav",
    bloopSound10: resRoot + "Sounds/boop10.wav",

    levelupSound: resRoot + "Sounds/levelup.wav",
    overSound: resRoot + "Sounds/over.mp3",

    coinSound: resRoot + "Sounds/coin.wav"
};

// returns proper font name based on platform
var b_getFontName = function(fontRes, scale) {
    if(scale > 1) {
        return fontRes.x2.fnt;
    }

    return fontRes.x1.fnt;
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
    res.statsImage,
    res.blockImage,
    res.trophyImage,

    // sounds
    res.clickSound,
    res.menuTrack,

    // fonts
    res.mainFont.x1.fnt,
    res.mainFont.x1.png,
    res.mainFont.x2.fnt,
    res.mainFont.x2.png
];

var plops = [res.plopSound, res.plopSound4, res.plopSound5,
    res.plopSound6, res.plopSound7, res.plopSound8, res.plopSound9, res.plopSound10, res.plopSound11,
    res.plopSound12, res.plopSound13, res.plopSound14];

var progresses = [res.progressSound1, res.progressSound2, res.progressSound3, res.progressSound4,
    res.progressSound5, res.progressSound6, res.progressSound7, res.progressSound8,
    res.progressSound9, res.progressSound10];

var bloops = [res.bloopSound1, res.bloopSound2, res.bloopSound3, res.bloopSound4, res.bloopSound5,
    res.bloopSound6, res.bloopSound7, res.bloopSound8, res.bloopSound9, res.bloopSound10];


// resources for ingame
var g_game = [
    // UI
    res.buttonImage,
    res.backImage,
    res.homeImage,
    res.pauseImage,
    res.retryImage,
    res.handImage,

    // Scene
    res.blockImage,
    res.alertImage,

    // music
    res.trackA,

    // sounds
    res.tickSound,
    res.clickSound,
    res.plipSound,
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

    res.bloopSound1,
    res.bloopSound2,
    res.bloopSound3,
    res.bloopSound4,
    res.bloopSound5,
    res.bloopSound6,
    res.bloopSound7,
    res.bloopSound8,
    res.bloopSound9,
    res.bloopSound10,

    
    res.overSound,
    res.levelupSound,
    res.coinSound,

    // fonts
    res.mainFont.x1.fnt,
    res.mainFont.x1.png,
    res.mainFont.x2.fnt,
    res.mainFont.x2.png
];

var g_all = (function() {
    var a = g_game.concat(g_menu);
    for(var i = 0; i < a.length; ++i) {
        for(var j = i + 1; j < a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}());