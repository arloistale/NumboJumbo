/**
 * Created by jonathanlu on 3/8/16.
 */

var NJ = NJ || {};

NJ.initAnalytics = function() {
    if(cc.sys.isNative) {
        sdkbox.PluginGoogleAnalytics.init();
    }
};

NJ.sendAnalyticsHit = function(category, action, label, value) {
    // now send over relevant stats data to GA
    if(cc.sys.isNative) {
        sdkbox.PluginGoogleAnalytics.setDimension(3, cc.sys.os);

        sdkbox.PluginGoogleAnalytics.logEvent("Promo", "interact", "Global", 43);
        sdkbox.PluginGoogleAnalytics.dispatchHits();
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
    if(cc.sys.isNative) {
        sdkbox.PluginGoogleAnalytics.setDimension(1, rid);
        sdkbox.PluginGoogleAnalytics.setDimension(2, label);
        sdkbox.PluginGoogleAnalytics.setDimension(3, cc.sys.os);
        sdkbox.PluginGoogleAnalytics.setMetric(1, NJ.gameState.getBlocksCleared());
        sdkbox.PluginGoogleAnalytics.setMetric(2, sessionLength);
        sdkbox.PluginGoogleAnalytics.setMetric(3, 1);
        sdkbox.PluginGoogleAnalytics.setMetric(4, NJ.gameState.getLevel());
        sdkbox.PluginGoogleAnalytics.setMetric(5, NJ.gameState.getScore());

        sdkbox.PluginGoogleAnalytics.logEvent("Game", "end", "Game Session Data", 42);
        sdkbox.PluginGoogleAnalytics.dispatchHits();
    }
};