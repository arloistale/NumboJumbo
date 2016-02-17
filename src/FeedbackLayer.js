
var BANNER_POOL_SIZE = 5;
var SNIPPET_POOL_SIZE = 5;

var FeedbackLayer = cc.Layer.extend({

    // feedback object pools
	bannerPool: [],
    snippetPool: [],

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

	    this.feedbackText = ["yahoo!", "yay!", "good job!", "cowabunga!",
				 "holy crap!", "keep it up!", "whoa!", "dang!",
				 "gosh golly!", "booya!", "oh wow!", 
				 "oh jeez!", "so good!", "!!!!!!!!!!!!!!!!!" ];

		var size = cc.winSize;

        var feedback = null;
        var i = 0;

        // initialize banner pool with entities
        for(; i < BANNER_POOL_SIZE; i++) {
            feedback = new Banner();
            this.bannerPool.push(feedback);
        }

        // initialize snippet pool with entities
        for(i = 0; i < BANNER_POOL_SIZE; i++) {
            feedback = new Snippet();
            this.snippetPool.push(feedback);
        }
	},

/////////////
// POOLING //
/////////////

    // pops a banner from the banner pool,
    // NOTE: Allocates a new banner if needed, increase pool size if this happens!
    popBannerPool: function() {
        if(this.bannerPool.length == 0) {
            var feedback = new Banner();
            feedback.reset();

            this.bannerPool.push(feedback);

            cc.log("Warning: Banner pool size exceeded, allocating; new pool size = " + this.bannerPool.length);
        }

        var banner = this.bannerPool.pop();
        banner.reset();

        return banner;
    },

    // pops a banner from the banner pool,
    // NOTE: Allocates a new banner if needed, increase pool size if this happens!
    popSnippetPool: function() {
        if(this.snippetPool.length == 0) {
            cc.log("Warning: Snippet pool size exceeded, allocating new objects");

            var feedback = new Snippet();
            feedback.reset();

            this.snippetPool.push(feedback);
        }

        var snippet = this.snippetPool.pop();
        snippet.reset();

        return snippet;
    },

///////////////
// LAUNCHING //
///////////////

    /*
     * Launches a banner onto the feedback layer, usually intended for
     * level ups and large combos.
     * launchBanner({ title: 'Hello' })
     */
    launchFallingBanner: function(data) {

        var banner = this.popBannerPool();

        var that = this;

        var titleStr;

        if(data) {
            titleStr = data.title;
        } else {
            titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];
        }

        banner.setText(titleStr);
        banner.setPosition(cc.winSize.width / 2, cc.winSize.height + banner.getContentSize().height);
        banner.setOpacity(255);

        this.addChild(banner);

        // start moving the banner
        var moveDuration = 0.5;
        var moveAction = cc.moveTo(moveDuration, cc.p(banner.x, cc.winSize.height / 2));
        moveAction.easing(cc.easeOut(2.0));
        var delayAction = cc.delayTime(0.8);
        var fadeOutAction = cc.fadeTo(0.2, 0);
        var removeAction = cc.callFunc(function() {
            banner.removeFromParent(true);
        });
        banner.stopAllActions();
        banner.runAction(cc.sequence(moveAction, delayAction, fadeOutAction, removeAction));
    },


    /*
     * Launches a snippet onto the feedback layer, intended for showing small bits of info
     * such as score increases.
     * launchSnippet ({ title: 'Hello' })
     */
    launchSnippet: function(data) {

        var that = this;

        var titleStr;

        if(data) {
            titleStr = data.title;
        } else {
            titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];
        }
        var oldFontSize = this.banner.bannerLabel.getFontSize();
        this.banner.reset();
        this.banner.setVisible(true);
        this.banner.launchWithText(titleStr);
        this.banner.setPosition(cc.winSize.width*(1/2), cc.winSize.height * 0.5);

        var scaleUpAction = cc.scaleBy(0.1, 40.0);
        var scaleDownAction = cc.scaleBy(1.5, 1/40.0);
        scaleDownAction.easing(cc.easeIn(3.0));
        var fadeOutAction = cc.fadeTo(0.1, 0);
        var fadeInAction = cc.fadeTo(0.1, 0.75*255);
        var removeAction = cc.callFunc(function() {
            that.banner.setVisible(false);
        });
        var fixFontAction = cc.callFunc(function() {
           that.banner.bannerLabel.setFontSize(72);
        });
	this.banner.stopAllActions();
        this.banner.runAction(cc.sequence(scaleDownAction, fadeOutAction, removeAction, fadeInAction, scaleUpAction, fixFontAction));
    }

});