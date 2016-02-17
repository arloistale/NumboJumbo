
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

        this.setName("FeedbackLayer");

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
        cc.assert (this.bannerPool.length > 0, "error: trying to create too many banners!");

        var banner = this.bannerPool.pop();
        banner.reset();

        return banner;
    },

    // pops a banner from the banner pool,
    // NOTE: Allocates a new banner if needed, increase pool size if this happens!
    popSnippetPool: function() {
        cc.assert (this.snippetPool.length > 0, "error: trying to create too many snippets!");

        var snippet = this.snippetPool.pop();
        snippet.reset();

        return snippet;
    },

    pushBannerPool: function(banner) {
        cc.assert(this.bannerPool.length < BANNER_POOL_SIZE, "Exceeded pool size for banners: " + (this.bannerPool.length + 1));
        this.bannerPool.push(banner);
    },

    pushSnippetPool: function(snippet) {
        cc.assert(this.snippetPool.length < SNIPPET_POOL_SIZE, "Exceeded pool size for snippets: " + (this.snippetPool.length + 1));
        this.snippetPool.push(snippet);
    },

///////////////
// LAUNCHING //
///////////////

    /*
     * Launches a banner onto the feedback layer, usually intended for
     * level ups and large combos.
     *
     * Usage: launchFallingBanner({ title: 'Hello' })
     */
    launchFallingBanner: function(data) {

        var banner = this.popBannerPool();

        var that = this;

        var titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];

        if(data) {
            if(typeof data.title !== 'undefined')
                titleStr = data.title;
        }

        banner.setText(titleStr);
        banner.setPosition(cc.winSize.width / 2, cc.winSize.height + banner.getContentSize().height);

        this.addChild(banner);

        // start moving the banner
        var moveDuration = 0.5;
        var moveAction = cc.moveTo(moveDuration, cc.p(banner.x, cc.winSize.height / 2));
        moveAction.easing(cc.easeOut(2.0));
        var delayAction = cc.delayTime(0.8);
        var fadeOutAction = cc.fadeTo(0.2, 0);
        var removeAction = cc.callFunc(function() {
            that.pushBannerPool(banner);
            banner.stopAllActions();
            banner.removeFromParent(true);
        });

        banner.runAction(cc.sequence(moveAction, delayAction, fadeOutAction, removeAction));
    },

    /*
     * Launches a snippet onto the feedback layer, intended for showing small bits of info
     * such as score increases.
     *
     * Usage: launchSnippet ({ title: 'Hello', x: 500, y: 500, targetX: 400, targetY: 400 })
     */
    launchSnippet: function(data) {

        var snippet = this.popSnippetPool();

        var that = this;

        var titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)],
            x = cc.winSize.width / 2, y = cc.winSize.height / 2,
            targetX = cc.winSize.width / 2, targetY = cc.winSize.height / 2;

        if(data) {
            if(typeof data.title !== 'undefined')
                titleStr = data.title;

            if(typeof data.x !== 'undefined')
                x = data.x;

            if(typeof data.y !== 'undefined')
                y = data.y;

            if(typeof data.targetX !== 'undefined')
                targetX = data.targetX;

            if(typeof data.targetY !== 'undefined')
                targetY = data.targetY;
        }

        snippet.setText(titleStr);
        snippet.setScale(0.01);
        snippet.setPosition(x, y);

        this.addChild(snippet);

        var scaleUpAction = cc.scaleTo(0.1, 1.0);
        //scaleDownAction.easing(cc.easeIn(3.0));
        var moveAction = cc.moveTo(0.69, cc.p(targetX, targetY));
        var fadeOutAction = cc.fadeTo(0.1, 0);
        var removeAction = cc.callFunc(function() {
            that.pushSnippetPool(snippet);
            snippet.stopAllActions();
            snippet.removeFromParent(true);
        });

        snippet.runAction(cc.sequence(scaleUpAction, moveAction, fadeOutAction, removeAction));
    }
});