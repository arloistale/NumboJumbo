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
            coin1: "coin1",

            doubler: "doubler"
        },

        productsData: {},

        // non IAP products
        hintsCost: 500,
        scramblersCost: 1000,

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
                var that = this;
                sdkbox.IAP.setListener({
                    onSuccess: function (product) {
                        if(product) {
                            if (onSuccessCallback)
                                onSuccessCallback(product);
                        } else {
                            if(onFailureCallback)
                                onFailureCallback(product, "Product Data not loaded");
                        }
                    },
                    onFailure: function (product, message) {
                        if(onFailureCallback)
                            onFailureCallback();
                    },
                    onCanceled: function (product) {
                        if(onCanceledCallback)
                            onCanceledCallback(product, "Canceled");
                    },
                    onRestored: function (product) {
                        //Purchase restored

                        if(onRestoreCallback)
                            onRestoreCallback();
                    },
                    onProductRequestSuccess: function (products) {
                        that.productsData = {};

                        var product;
                        for(var i = 0; i < products.length; ++i) {
                            product = products[i];

                            if(!product || !product.name || !product.price)
                                continue;

                            that.productsData[product.name] = {
                                price: product.price
                            };
                        }

                        if(onProductRequestSuccessCallback)
                            onProductRequestSuccessCallback(products);
                    },
                    onProductRequestFailure: function (message) {
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

        // Usage: onCanceledCallback(product, error)
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
            }
        },

        getProducts: function() {
            return this.productsData;
        },

        getProductByName: function(name) {
            return this.productsData[name];
        }
    }
}());