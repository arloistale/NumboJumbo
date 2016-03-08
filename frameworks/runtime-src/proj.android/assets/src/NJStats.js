/**
 * Created by jonathanlu on 3/3/16.
 */

var NJ = NJ || {};

NJ.stats = {
    highscore: 0,

    // calculated stats
    maxComboLength: 0
};

// SERIALIZATION //
NJ.loadStats = function() {
    var localHighscore = parseInt(cc.sys.localStorage.getItem('highscore'));

    if(!isNaN(localHighscore)) {
        NJ.stats.highscore = localHighscore;
    }
};

// package relevant stats (score) to local storage
NJ.saveStats = function() {
    var score = NJ.gameState.getScore();

    if(score > NJ.stats.highscore) {
        NJ.stats.highscore = score;
        cc.sys.localStorage.setItem('highscore', JSON.stringify(score));
    }
};

NJ.initAnalytics = function() {
    if(cc.sys.isNative) {
        sdkbox.PluginGoogleAnalytics.init();
    }
};

// send relevant stats over to Google Analytics
NJ.sendAnalytics = function() {
    NJ.saveStats();

    // prepare the stats package to send to GA
    var sessionLength = (Date.now() - NJ.gameState.getStartTime()) / 1000;
    NJ.logStats();

    var rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var jumboName = NJ.gameState.getJumbo().name;

    // now send over relevant stats data to GA
    if(!cc.sys.isNative) {
        ga('set', 'dimension1', rid);
        ga('set', 'dimension2', jumboName);
        ga('set', 'metric1', NJ.gameState.getBlocksCleared());
        ga('set', 'metric2', sessionLength);
        ga('set', 'metric3', NJ.stats.maxComboLength);
        ga('set', 'metric4', NJ.gameState.getLevel());
        ga('set', 'metric5', NJ.gameState.getScore());

        ga('send', 'event', 'Game', 'end', 'Game Session Data', 42);
    } else {
        sdkbox.PluginGoogleAnalytics.setDimension(1, rid);
        sdkbox.PluginGoogleAnalytics.setDimension(2, jumboName);
        sdkbox.PluginGoogleAnalytics.setMetric(1, NJ.gameState.getBlocksCleared());
        sdkbox.PluginGoogleAnalytics.setMetric(2, sessionLength);
        sdkbox.PluginGoogleAnalytics.setMetric(3, NJ.stats.maxComboLength);
        sdkbox.PluginGoogleAnalytics.setMetric(4, NJ.gameState.getLevel());
        sdkbox.PluginGoogleAnalytics.setMetric(5, NJ.gameState.getScore());

        sdkbox.PluginGoogleAnalytics.logEvent("Game", "end", "Game Session Data", 42);
        sdkbox.PluginGoogleAnalytics.dispatchHits();
    }
};

NJ.logStats = function() {
    var statsStr = "Here are stats...\n";
    statsStr += "Jumbo: " + NJ.gameState.getJumbo().name + "\n";
    statsStr += "Start Time: " + NJ.gameState.getStartTime() + "\n";

    for(var key in NJ.stats) {
        if(NJ.stats.hasOwnProperty(key))
            statsStr += key + ": " + NJ.stats[key] + "\n";
    }

    cc.log(statsStr);
};