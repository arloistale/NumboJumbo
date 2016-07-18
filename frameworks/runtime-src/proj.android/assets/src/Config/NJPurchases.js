var NJ = NJ || {};

/**
 * Exposes a module describing app purchases functionality.
 */
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
        // expose keys for in app purchases
        itemIAPKeys: {
            doubler: "doubler"
        },

        // expose the prices of non in-app purchase items
        inGameItems: {
            // for powerups, we define how many of each powerup is awarded for a purchase
            // as well as the price point
            converter: {
                amount: 5,
                price: 1500
            },
            hint: {
                amount: 5,
                price: 2000
            },
            scrambler: {
                amount: 3,
                price: 2500
            }
        },

        productsData: {},

        campaignName: null,
        campaignMessage: null,

        // Initialization //

        init: function () {
            if (cc.sys.isNative) {
                sdkbox.IAP.init();

                this._initListener();
                this._initCampaigns();
            }
        },

        // loads any currently running campaigns
        // so that we can expose them to the user
        _initCampaigns: function() {
            var campaignName = cc.sys.localStorage.getItem("campaignName");
            if(campaignName && campaignName.length) {
                this.campaignName = campaignName;
            }

            var campaignMessage = cc.sys.localStorage.getItem("campaignMessage");
            if(campaignMessage && campaignMessage.length) {
                this.campaignMessage = campaignMessage;
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

        // submits a purchase request for an IAP item with a given key
        // callback usage: function( product, error_message )
        buy: function (key, callback) {
            if (cc.sys.isNative) {
                sdkbox.IAP.purchase(this.itemIAPKeys[key]);
                this.setSuccessCallback(callback);
            }
        },

        getProducts: function() {
            return this.productsData;
        },

        getProductByName: function(name) {
            return this.productsData[name];
        },

        ///////////////////////////
        // Campaign Manipulation //
        ///////////////////////////

        // Use this function once campaign details
        // have been successfully exposed to the user
        // so that they don't appear more than once
        discardCampaignDetails: function() {
            this.campaignName = null;
            this.campaignMessage = null;

            cc.sys.localStorage.setItem("campaignName", "");
            cc.sys.localStorage.setItem("campaignMessage", "");
        }
    }
}());