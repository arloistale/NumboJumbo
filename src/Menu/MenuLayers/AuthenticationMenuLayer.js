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
            this.sendPostRequest({
                "url": "wp-json/jwt-auth/v1/token/",
                "params": {"username": "sampleuser@memtechlabs.com", "password": "@8Wj(ngHJO0ST0NfJ*tei5MK"}
            });
        },

        sendPostRequest: function (options) {
            cc.log("Layer.sendPostRequest() called");
            var that = this;
            var http = new XMLHttpRequest();
            var request_url = "https://memtechlabs.com/";

            var params = '';
            if (options.params) {
                for (var key in options.params) {
                    params += '&' + key + '=' + options.params[key];
                    cc.log(params);
                }
            }

            http.open("POST", request_url + options.url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {
                var httpStatus = http.statusText;
                switch (http.readyState) {
                    case 4: {
                        if (http.responseText) {
                            var responseJSON = eval('(' + http.responseText + ')');
                            NJ.validateToken({"url": "wp-json/jwt-auth/v1/token/validate"}, responseJSON.token,
                                that._onValidateToken);

                        } else {
                            var responseJSON = {};
                        }
                    }
                }
            };
            http.send(params.substr(1));
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