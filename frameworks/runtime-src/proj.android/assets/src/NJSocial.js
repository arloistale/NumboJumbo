var NJ = NJ || {};

NJ.social = (function() {

    var leaderboardPrefix = "ldb-";

    return {
        init: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.init();

                sdkbox.PluginSdkboxPlay.setListener({
                    onConnectionStatusChanged : function( status ) {
                        cc.log(status);
                    }
                });
            }
        },
             
        login: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.signin();
            }
        },

        isLoggedIn: function() {
            // TODO: There is a problem when the user signs out using Settings option, will still be connected
            if(cc.sys.isNative) {
                return sdkbox.PluginSdkboxPlay.isConnected();
            }
        },

        ///////////////////////
        // Scores and levels //
        ///////////////////////

        // submits score data to the leaderboard defined by the given game mode key
        submitScore: function(key, score) {
            if(cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.submitScore(leaderboardPrefix + key, score);
            }
        },

        // submits level data to the leaderboard defined by the given game mode key
        submitLevel: function(key, score) {
            if(cc.sys.isNative) {
                //sdkbox.PluginSdkboxPlay.submitScore(leaderboardPrefix + key, score);
            }
        },

        showLeaderboard: function() {
            if(cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();
                if(!isLoggedIn)
                    return;

                sdkbox.PluginSdkboxPlay.showAllLeaderboards();
            }
        },

        //////////////////
        // Achievements //
        //////////////////

        unlockAchievement: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.unlockAchievement("layman");
            }
        },

        showAchievement: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.showAchievements();
            }
        }
    }
}());