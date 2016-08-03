var NJ = NJ || {};

/**
 * Exposes a module describing app purchases functionality.
 */
NJ.purchases = (function() {

    // Private Data Collection

    // data of non in-app purchase items
    var inGameItems = {
        // here we define data for each non in app purchase
        stopper: {
            name: "Stoppers",
            description: "Use stoppers to play for longer.",
            iconRes: res.timedImage,
            amount: 3,
            price: 3000
        },
        converter: {

            name: "Reducers",
            description: "Use reducers to change any number into 1.",
            iconRes: res.convertImage,
            amount: 5,
            price: 1500
        },
        hint: {
            name: "Hints",
            description: "Use hints to reveal a sum on the board.",
            iconRes: res.searchImage,
            amount: 5,
            price: 2000
        },
        scrambler: {
            name: "Scramblers",
            description: "Use scramblers to redistribute the board.",
            iconRes: res.scrambleImage,
            amount: 3,
            price: 2500
        }
    };

    // Gathered IAP product data
    var productsData = {};

    // callback definitions
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

        // expose keys for in game purchases
        ingameItemKeys: {
            stopper: "stopper",
            converter: "converter",
            hint: "hint",
            scrambler: "scrambler"
        },

        // Data about the current promotional campaign
        campaignName: null,
        campaignMessage: null,

        // whether ad videos are available
        // TODO: this is intended to be set to false here. temporarily changed for web dev.
        //areVideosAvailable: false,
        areVideosAvailable: ! cc.sys.isNative,

        // Initialization //

        init: function () {
            if (cc.sys.isNative) {
                sdkbox.IAP.init();

                this._initEvents();
                this._initListener();
            }
        },

        // listens for events related to purchases
        _initEvents: function() {
            var that = this;

            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "alertVideoAvailable",
                callback: function (event) {
                    that.areVideosAvailable = true;
                }
            }), 1);

            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "alertVideoUnavailable",
                callback: function (event) {
                    that.areVideosAvailable = false;
                }
            }), 1);
        },

        // loads any currently running campaigns
        // so that we can expose them to the user
        // intended to be run at the MenuLayer
        initCampaigns: function() {
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
                        productsData = {};

                        var product;
                        for(var i = 0; i < products.length; ++i) {
                            product = products[i];

                            if(!product || !product.name || !product.price)
                                continue;

                            productsData[product.name] = {
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

        //////////////////////
        // In Game Products //
        //////////////////////

        getInGameItemByKey: function(key) {
            return inGameItems[key];
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
            return productsData;
        },

        getProductByName: function(name) {
            return productsData[name];
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