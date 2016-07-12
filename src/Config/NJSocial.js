var NJ = NJ || {};

NJ.social = (function() {

    var leaderboardPrefix = "ldb-";

    return {
        // expose achievement keys
        achievements: {
            played1: "played1",
            played2: "played2",
            played3: "played3",
            played4: "played4",
            played5: "played5",

            // achievement keys are named with the following classification
            // Key = Mode Key + Tier Index
            // Example: mm1 (Mode key for Minute Madness with Tier 1)

            mm: {
                scoreThresholds: [300, 450, 600, 750]
            },

            mov: {
                scoreThresholds: [500, 750, 1000, 1250]
            },

            re: {
                scoreThresholds: [500, 1000, 1500, 2000]
            },

            inf: {
                scoreThresholds: [2500, 5000, 7500, 10000]
            }
        },

        init: function () {
            if (cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.init();
            }
        },

        setListener: function(listener) {
            //if(cc.sys.isNative) {
                //sdkbox.PluginSdkboxPlay.setListener(listener);
            //}
        },

        login: function () {
            if (cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.signin();
            }
        },

        isLoggedIn: function () {
            // TODO: There is a problem when the user signs out using Settings option, will still be connected
            if (cc.sys.isNative) {
                return sdkbox.PluginSdkboxPlay.isSignedIn();
            }
        },

        ///////////////////////
        // Scores and levels //
        ///////////////////////

        // submits score data to the leaderboard defined by the given game mode key
        // callback usage: function( leaderboard_name, score, is_maxScoreAllTime, is_maxScoreWeek, is_maxScoreToday )
        submitScore: function (key, score) {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();
                if(isLoggedIn) {
                    sdkbox.PluginSdkboxPlay.submitScore(leaderboardPrefix + key, score);
                } else {
                    cc.log("Could not submit score due to unauthenticated player");
                }
            }
        },

        showLeaderboard: function () {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();

                 if(isLoggedIn) {
                     var ldbName = "";

                     if(cc.sys.os == cc.sys.OS_IOS) {
                         ldbName = "ldb-mm";
                     }

                     sdkbox.PluginSdkboxPlay.showLeaderboard(ldbName);
                 } else {
                     this.login();
                 }
            }
        },

        //////////////////
        // Achievements //
        //////////////////

        // callback usage:  function( achievement_name, newlyUnlocked )
        // TODO: Do not call this function directly, may cause a crash
        unlockAchievement: function (key) {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();

                if(isLoggedIn) {
                    sdkbox.PluginSdkboxPlay.unlockAchievement(key);
                } else {
                    cc.log("Could not unlock achievement due to unauthenticated player");
                }
            }
        },

        // helper function to unlock achievement based on current mode key and score
        offerAchievementForModeWithScore: function(modeKey, score) {
            if(!cc.sys.isNative)
                return;

            var thresholdsContainer = NJ.social.achievements[modeKey];

            cc.assert(thresholdsContainer, "Invalid modeKey assigned to achievement");

            for(var i = 0; i < thresholdsContainer.length; ++i) {
                if (score >= thresholdsContainer[i]) {
                    NJ.social.unlockAchievement(modeKey + "" + (i + 1));
                }
            }
        },

        showAchievements: function () {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();

                if(isLoggedIn) {
                    sdkbox.PluginSdkboxPlay.showAchievements();
                } else {
                    this.login();
                }
            }
        }
    }
}());