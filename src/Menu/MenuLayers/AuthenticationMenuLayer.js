/**
 * Created by Brett on 7/22/2018.
 */

var AuthenticationMenuLayer = (function (scene) {

    ///////////////
    // UI Events //
    ///////////////

    return cc.Layer.extend({

////////////////////
// Initialization //
////////////////////

        ctor: function () {
            this._super();
            this._checkLogin();
        },


        _checkLogin: function () {
            cc.log("_checkLogin() called");
            var that = this;
            NJ.readParams();
            cc.assert(NJ.params.token || (NJ.params.username && NJ.params.password), "No token and no" +
                " username+password in url! Committing suicide");
            if (NJ.params.token) {
                // if a token was passed to us, use it:
                NJ.validateToken(that._onValidateToken);
            } else if (NJ.params.username && NJ.params.password) {
                // otherwise, attempt to generate a token from username/pass (and validate it):
                this.getTokenFromLogin();
            }
        },

        getTokenFromLogin: function () {
            cc.log("getTokenFromLogin() called");
            var that = this;
            var http = new XMLHttpRequest();
            var request_url = "https://memtechlabs.com/";
            var tokenUrl = "wp-json/jwt-auth/v1/token/";
            var params = 'username=' + NJ.params.username + '&password=' + NJ.params.password;
            cc.log(params);

            http.open("POST", request_url + tokenUrl, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {
                var httpStatus = http.statusText;
                switch (http.readyState) {
                    case 4: {
                        cc.assert(http.responseText, "http.responseText is NULL, committing suicide!");
                        var responseJson = eval('(' + http.responseText + ')');
                        cc.log("responseJson: ");
                        cc.log(responseJson);
                        if (responseJson.token) {
                            NJ.token = responseJson.token;
                            NJ.validateToken(that._onValidateToken);
                        } else {
                            cc.assert(responseJson.data, "responseJson.data is NULL, committing suicide!");
                            var status = responseJson.data.status;
                            cc.assert(status, "responseJson.data.status is NULL");
                            cc.log("username+password rejected!");
                            cc.assert(false, responseJson.message);
                        }
                    }
                }
            };
            http.send(params);
        },

        _onValidateToken: function () {
            var scene = new cc.Scene();
            if (NJ.hasAuthentication) {
                cc.log("authentication successful! next Layer");
                if (NJ.settings.hasLoadedTUT) {
                    cc.log("Tutorial not needed, spawning MenuLayer");
                    scene.addChild(new NumboMenuLayer());
                } else {
                    cc.log("Tutorial needed, spawning TutorialDriverLayer");
                    scene.addChild(new TutorialDriverLayer());
                }
            }
            else {
                cc.assert(false, "Authentication failed! Committing suicide");
            }
            cc.director.runScene(scene);
        },

        ///////////////
        // UI Events //
        ///////////////


//////////////////
// UI Callbacks //
//////////////////


    });
}());