var NJ = NJ || {};

NJ.purchases = (function() {

    var onSuccessCallback = function(product) {
    };

    var onFailureCallback = function(product, message) {
    };

    var onRestoreCallback = function(product) {
    };

    var onCanceledCallback = function(product) {
    };

    var onProductRequestSuccessCallback = function(products) {
    };

    var onProductRequestFailureCallback = function(message) {
    };

    return {
        // expose achievement keys
        itemKeys: {
            coin1: "coin1"
        },

        // Initialization //

        init: function () {
            if (cc.sys.isNative) {
                sdkbox.IAP.init();

                this._initListener();
            }
        },

        // this function should not be explicitly called
        // instead use the individual setCallback functions to provide callbacks for IAP events
        _initListener: function() {
            if(cc.sys.isNative) {
                sdkbox.IAP.setListener({
                    onSuccess: function (product) {
                        if(onSuccessCallback)
                            onSuccessCallback(product);
                    },
                    onFailure: function (product, message) {
                        cc.log("Transaction Failure: " + message);

                        if(onFailureCallback)
                            onFailureCallback();
                    },
                    onCanceled: function (product) {
                        cc.log("Transaction Canceled");

                        if(onCanceledCallback)
                            onCanceledCallback(product);
                    },
                    onRestored: function (product) {
                        //Purchase restored

                        if(onRestoreCallback)
                            onRestoreCallback();
                    },
                    onProductRequestSuccess: function (products) {
                        cc.log("product request success!");

                        for(var i = 0; i < products.length; ++i) {
                            cc.log(products[i]);
                            for(var key in products[i]) {
                                if(products[i].hasOwnProperty(key))
                                    cc.log(products[i][key]);
                            }
                        }

                        if(onProductRequestSuccessCallback)
                            onProductRequestSuccessCallback(products);
                    },
                    onProductRequestFailure: function (message) {
                        cc.log("Product Request Failure: " + message);

                        if(onProductRequestFailureCallback)
                            onProductRequestFailureCallback(message);
                    }
                });
            }
        },

        // Event Handlers //


        // Usage: onSuccessCallback(product)
        setSuccessCallback: function(callback) {
            onSuccessCallback = callback;
        },

        // Usage: onFailureCallback(product, message)
        setFailureCallback: function(callback) {
            onFailureCallback = callback;
        },

        // Usage: onRestoreCallback(product)
        setRestoreCallback: function(callback) {
            onRestoreCallback = callback;
        },

        // Usage: onCanceledCallback(product)
        setCanceledCallback: function(callback) {
            onCanceledCallback = callback;
        },

        // Usage: onProductRequestSuccessCallback(products)
        setProductRequestSuccessCallback: function(callback) {
            onProductRequestSuccessCallback = callback;
        },

        // Usage: onProductRequestFailureCallback(message)
        setProductRequestFailureCallback: function(callback) {
            onProductRequestFailureCallback = callback;
        },

        ////////////
        // Buying //
        ////////////

        // submits score data to the leaderboard defined by the given game mode key
        // callback usage: function( product, error_message )
        buy: function (key, callback) {
            if (cc.sys.isNative) {
                sdkbox.IAP.purchase(this.itemKeys[key]);
                this.setSuccessCallback(callback);
                this.setFailureCallback(callback);
            }
        }
    }
}());