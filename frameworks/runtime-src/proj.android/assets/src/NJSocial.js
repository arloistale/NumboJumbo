var NJ = NJ || {};

NJ.social = (function() {

    var id = 0;

    return {
        init: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginFacebook.init();

                id = sdkbox.PluginFacebook.getUserID();
            }
        },

        isLoggedIn: function() {
            return id;
        },

        facebookLogin: function(callback) {
            cc.assert(callback, "Callback for login must be defined");

            var that = this;

            if(cc.sys.isNative) {
                sdkbox.PluginFacebook.setListener({
                    onLogin: function(isLogin, message) {
                        cc.log("Login attempt: " + isLogin + " | " + message);

                        if(isLogin) {
                            id = sdkbox.PluginFacebook.getUserID();

                            cc.log("logged in with user id: " + id);

                            callback(null, sdkbox.PluginFacebook.getUserID())
                        } else {
                            callback(message);
                        }
                    }
                });
                sdkbox.PluginFacebook.login();
            }
        },

        facebookLogout: function() {
            if(cc.sys.isNative) {
                sdkbox.PluginFacebook.logout();

                id = sdkbox.PluginFacebook.getUserID();
            }
        }
    }
}());