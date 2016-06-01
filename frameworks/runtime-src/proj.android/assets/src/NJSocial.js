var NJ = NJ || {};

NJ.social = (function() {

    var leaderboardPrefix = "ldb-";

    // data
    var isEnabled = false;

    return {
        // expose achievement keys
        achievementKeys: {
            played1: "played1",
            played2: "played2",
            played3: "played3",
            played4: "played4",
            played5: "played5",

            mm1: "mm1",
            mm2: "mm2",
            mm3: "mm3",
            mm4: "mm4",

            mov1: "mov1",
            mov2: "mov2",
            mov3: "mov3",
            mov4: "mov4",

            re1: "re1",
            re2: "re2",
            re3: "re3",
            re4: "re4",

            inf1: "inf1",
            inf2: "inf2",
            inf3: "inf3",
            inf4: "inf4"
        },

        init: function () {
            if (cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.init();
/*
                sdkbox.PluginSdkboxPlay.setListener({
                    onConnectionStatusChanged: function (status) {
                        cc.log("Connection status changed");
                        cc.log(status);
                    },

                    onScoreSubmitted: function (leaderboard_name, score, is_maxScoreAllTime, is_maxScoreWeek, is_maxScoreToday) {
                        cc.log("Score submitted!");
                    },

                    onAchievementUnlocked: function (achievement_name, newlyUnlocked) {
                        cc.log("achievement unlocked!");
                    }
                });
 */
            }
        },

        login: function () {
            if (cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.signin();
            }
        },

        isLoggedIn: function () {
            // TODO: There is a problem when the user signs out using Settings option, will still be connected
            if (cc.sys.isNative) {
                var isLoggedIn = sdkbox.PluginSdkboxPlay.isSignedIn();
                return isLoggedIn;
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
                    cc.log("Executing command submit: " + key + ", " + score);
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
                     cc.log("Show Leaderboards unauthenticated player, logging in");
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
                    cc.log("Executing command unlock: " + key);
                    sdkbox.PluginSdkboxPlay.unlockAchievement(key);
                } else {
                    cc.log("Could not unlock achievement due to unauthenticated player");
                }
            }
        },

        showAchievements: function () {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();

                if(isLoggedIn) {
                    sdkbox.PluginSdkboxPlay.showAchievements();
                } else {
                    cc.log("Show achievements unauthenticated player, logging in");
                    this.login();
                }
            }
        }
    }
}());