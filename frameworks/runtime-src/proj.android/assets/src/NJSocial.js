var NJ = NJ || {};

NJ.social = (function() {

    var states = {
        neutral: 0,
        reap: 1
    };

    var leaderboardPrefix = "ldb-";

    // command queue
    // { "unlock", "played1" }
    // { "submit", "500" }
    var _commandQueue = [];

    var _state = states.neutral;

    // helper functions

    var _executeCommand = function(command) {
        var data = command.data;
        cc.log("TODO: The suspicion is that listener is being freed somehow once callback, so we are assigning listener every time");

        switch(command.key) {
            case "submit":
                var leaderboardKey = data.leaderboardKey;
                var score = data.score;
                cc.log("Executing command submit: " + leaderboardKey + ", " + score);
                sdkbox.PluginSdkboxPlay.submitScore(leaderboardPrefix + leaderboardKey, score);
                break;
            case "unlock":
                var achievementKey = data.achievementKey;
                cc.log("Executing command unlock: " + achievementKey);
                sdkbox.PluginSdkboxPlay.unlockAchievement(achievementKey);
                break;
        }
    };

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

                sdkbox.PluginSdkboxPlay.setListener({
                    onConnectionStatusChanged: function (status) {
                        cc.log("Connection status changed");
                        cc.log(status);
                    },

                    onScoreSubmitted: function (leaderboard_name, score, is_maxScoreAllTime, is_maxScoreWeek, is_maxScoreToday) {
                        cc.log("Score submitted!");
                        /*
                        if (_commandQueue.length > 0) {
                            _executeCommand(_commandQueue.shift());
                        } else {
                            cc.log("finished reaping");
                            _state = states.neutral;
                        }*/
                    },

                    onAchievementUnlocked: function (achievement_name, newlyUnlocked) {
                        cc.log("achievement unlocked!");
                        /*
                        if (_commandQueue.length > 0) {
                            _executeCommand(_commandQueue.shift());
                        } else {
                            cc.log("finished reaping");
                            _state = states.neutral;
                        }
                        */
                    }
                });
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
                return sdkbox.PluginSdkboxPlay.isConnected();
            }
        },

        ///////////////////////
        // Scores and levels //
        ///////////////////////

        // submits score data to the leaderboard defined by the given game mode key
        // callback usage: function( leaderboard_name, score, is_maxScoreAllTime, is_maxScoreWeek, is_maxScoreToday )
        submitScore: function (key, score) {
            if (cc.sys.isNative) {
                _executeCommand({
                    key: "submit",
                    data: {
                        leaderboardKey: key,
                        score: score
                    }
                });
                /*
                _commandQueue.push({
                    key: "submit",
                    data: {
                        leaderboardKey: key,
                        score: score
                    }
                });
                */

                cc.log("Pushed Submit command with data: " + key + ", " + score);
/*
                if(_state != states.reap) {
                    this._reapCommandQueue();
                }
*/
                // TODO: Check we need to have a check at the beginning of the game to do this
                // if the score has not been synced in the last game sessions.
                // Extreme case: Player gets a new high score, the game starts syncing but the player shuts off the app
                // Player turns on game next time, checks online high score and it was not updated
                // Score then will not update until player gets an even higher score = BS
            }
        },

        showLeaderboard: function () {
            if (cc.sys.isNative) {
                var isLoggedIn = this.isLoggedIn();
                cc.log(isLoggedIn);
                /*
                 if(!isLoggedIn) {
                 cc.log("ffs");
                 this.login();
                 return;
                 }*/

                sdkbox.PluginSdkboxPlay.showLeaderboard("ldb-mm");
            }
        },

        //////////////////
        // Achievements //
        //////////////////

        // callback usage:  function( achievement_name, newlyUnlocked )
        // TODO: Do not call this function directly, may cause a crash
        unlockAchievement: function (key) {
            if (cc.sys.isNative) {

                _executeCommand({
                    key: "unlock",
                    data: {
                        achievementKey: key
                    }
                });
                /*
                _commandQueue.push({
                    key: "unlock",
                    data: {
                        achievementKey: key
                    }
                });*/

                cc.log("Pushed Unlock command with data: " + key);
/*
                if(_state != states.reap) {
                    this._reapCommandQueue();
                }
*/
                // TODO: Check we need to have a check at the beginning of the game to do this
                // if the score has not been synced in the last game sessions.
                // Extreme case: Player gets a new high score, the game starts syncing but the player shuts off the app
                // Player turns on game next time, checks online high score and it was not updated
                // Score then will not update until player gets an even higher score = BS
            }
        },

        showAchievements: function () {
            if (cc.sys.isNative) {
                sdkbox.PluginSdkboxPlay.showAchievements();
            }
        },

        // goes through every command on the queue
        // the commands can be either to submit score or unlock an achievement
        // reasoning: game center doesn't like everything submitted at once
        _reapCommandQueue: function() {
            if(!cc.sys.isNative)
                return;

            _state = states.reap;

            if(_commandQueue.length > 0) {
                _executeCommand(_commandQueue.shift());
            } else {
                cc.log("finished reaping nothing");
            }
        }
    }
}());