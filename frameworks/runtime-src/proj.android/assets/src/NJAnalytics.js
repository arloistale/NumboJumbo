/**
 * Created by jonathanlu on 3/8/16.
 */

var NJ = NJ || {};

NJ.initAnalytics = function() {
    if(cc.sys.isNative) {
        sdkbox.PluginGoogleAnalytics.init();
    }
};

// send relevant stats over to Google Analytics
NJ.sendAnalytics = function(label) {
    // prepare the stats package to send to GA
    var sessionLength = (Date.now() - NJ.gameState.getStartTime()) / 1000;

    var rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    // now send over relevant stats data to GA
    if(!cc.sys.isNative) {
        ga('set', 'dimension1', rid);
        ga('set', 'dimension2', label);
        ga('set', 'metric1', NJ.gameState.getBlocksCleared());
        ga('set', 'metric2', sessionLength);
        //ga('set', 'metric3', NJ.stats.maxComboLength);
        ga('set', 'metric4', 1);
        ga('set', 'metric5', NJ.gameState.getScore());

        ga('send', 'event', 'Game', 'end', 'Game Session Data', 42);
    } else {
        sdkbox.PluginGoogleAnalytics.setDimension(1, rid);
        sdkbox.PluginGoogleAnalytics.setDimension(2, label);
        sdkbox.PluginGoogleAnalytics.setMetric(1, NJ.gameState.getBlocksCleared());
        sdkbox.PluginGoogleAnalytics.setMetric(2, sessionLength);
        //sdkbox.PluginGoogleAnalytics.setMetric(3, NJ.stats.maxComboLength);
        sdkbox.PluginGoogleAnalytics.setMetric(4, 1);
        sdkbox.PluginGoogleAnalytics.setMetric(5, NJ.gameState.getScore());

        sdkbox.PluginGoogleAnalytics.logEvent("Game", "end", "Game Session Data", 42);
        sdkbox.PluginGoogleAnalytics.dispatchHits();
    }
};