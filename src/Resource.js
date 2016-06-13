/**
 *
 * All resource files go here.
 *
 */

var resRoot = "res/";

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
        },

        x3: {
            fnt: resRoot + "Fonts/mainFont3x.fnt",
            png: resRoot + "Fonts/mainFont3x.png"
        }
    },

    // Loader
    logoImage: resRoot + "Images/logo.png",

	// UI
    buttonImage: resRoot + "Images/Button.png",
    pauseImage: resRoot + "Images/ic_pause/ic_pause_2x.png",
    backImage: resRoot + "Images/ic_back/ic_back_2x.png",
    nextImage: resRoot + "Images/ic_next/ic_next_2x.png",
    helpImage: resRoot + "Images/ic_help/ic_help_2x.png",
    homeImage: resRoot + "Images/ic_home/ic_home_2x.png",
    skipImage: resRoot + "Images/ic_skip/ic_skip_2x.png",
    settingsImage: resRoot + "Images/ic_settings/ic_settings_2x.png",
    retryImage: resRoot + "Images/ic_retry/ic_retry_2x.png",
    statsImage: resRoot + "Images/ic_stats/ic_stats_2x.png",
    trophyImage: resRoot + "Images/ic_trophy/ic_trophy_2x.png",
    loginImage: resRoot + "Images/login.png",

    playImage: resRoot + "Images/ic_play/ic_play_2x.png",
    timedImage: resRoot + "Images/ic_timed.png",
    movesImage: resRoot + "Images/ic_moves.png",
    stackImage: resRoot + "Images/ic_stack.png",
    infiniteImage: resRoot + "Images/ic_infinite.png",

    // ingame
    blockImage: resRoot + "Images/blockImage/blockImage1x.png",
    blockImage2x: resRoot + "Images/blockImage/blockImage2x.png",
    alertImage: resRoot + "Images/alertOverlay.png",
    handImage: resRoot + "Images/ic_hand/Hand2.png",
    cancelImage: resRoot + "Images/ic_cancel/ic_cancel_2x.png",

    // music
    trackChill2: resRoot + "Sounds/music/Chill2.mp3",
    trackDauntinglyMellow: resRoot + "Sounds/music/DauntinglyMellowV3.mp3",
    trackSomethingElse1: resRoot + "Sounds/music/SomethingElseV1.mp3",

    // audio
    tickSound: resRoot + "Sounds/tick.mp3",
    plipSound: resRoot + "Sounds/plipSound.mp3",

    overSound: resRoot + "Sounds/over.mp3",

    coinSound: resRoot + "Sounds/coin.wav",

    tensionSound: resRoot + "Sounds/plang1.wav",
    tensionSound2: resRoot + "Sounds/plang2.wav",
    tensionSound3: resRoot + "Sounds/plang8.wav",

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

    bloopSound1: resRoot + "Sounds/boop1.wav",
    bloopSound2: resRoot + "Sounds/boop2.wav",
    bloopSound3: resRoot + "Sounds/boop3.wav",
    bloopSound4: resRoot + "Sounds/boop4.wav",
    bloopSound5: resRoot + "Sounds/boop5.wav",
    bloopSound6: resRoot + "Sounds/boop6.wav",
    bloopSound7: resRoot + "Sounds/boop7.wav",
    bloopSound8: resRoot + "Sounds/boop8.wav",
    bloopSound9: resRoot + "Sounds/boop9.wav",
    bloopSound10: resRoot + "Sounds/boop10.wav"
};

var plops = [res.plopSound, res.plopSound4, res.plopSound5,
    res.plopSound6, res.plopSound7, res.plopSound8, res.plopSound9, res.plopSound10, res.plopSound11,
    res.plopSound12, res.plopSound13, res.plopSound14];

var bloops = [res.bloopSound1, res.bloopSound2, res.bloopSound3, res.bloopSound4, res.bloopSound5,
    res.bloopSound6, res.bloopSound7, res.bloopSound8, res.bloopSound9, res.bloopSound10];

// these resources are preloaded by the AudioEngine
var sounds = (function() {
    var g = [
        res.tickSound,
        res.plipSound,

        res.overSound,
        res.coinSound,
        res.tensionSound2,
        res.tensionSound,
        res.tensionSound3
    ];

    return g.concat(plops).concat(bloops);
}());

// resources for the game
var g_all = (function() {
    var fonts = [
        // fonts
        res.mainFont.x1.fnt,
        res.mainFont.x1.png,
        res.mainFont.x2.fnt,
        res.mainFont.x2.png,
        res.mainFont.x3.fnt,
        res.mainFont.x3.png
    ];

    var g = [];

    for(var key in res) {
        if(!res.hasOwnProperty(key) || typeof res[key] !== 'string')
            continue;

        g.push(res[key]);
    }

    return g.concat(fonts);
}());

// returns proper font name based on platform
var b_getFontName = function(fontRes, scale) {
    if(scale == 3) {
        return fontRes.x3.fnt;
    } else if(scale == 2) {
        return fontRes.x2.fnt;
    }

    return fontRes.x1.fnt;
};