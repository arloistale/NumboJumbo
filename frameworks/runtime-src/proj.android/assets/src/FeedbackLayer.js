
var BANNER_POOL_SIZE = 5;
var SNIPPET_POOL_SIZE = 10;

var FeedbackLayer = cc.Layer.extend({

    // feedback object pools
	bannerPool: [],
    snippetPool: [],

    // feedback doomsayer
    alertOverlay: null,
    bIsDoomsayerLaunched: false,

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

	    this.feedbackText = ["yahoo!", "yay!", "good job!", "cowabunga!",
            "keep it up!", "whoa!", "dang!",
            "gosh golly!", "booya!", "oh wow!",
            "oh jeez!", "so good!", "astonishing!",
            "jackpot!", "nice execution!",
            "winner!", "combo master!", "fabulous!", "moving up!",
            "nice work!", "wonderful!", "that's how it's done!",
            "mind blowing!", "stupendous moves!", "breathtaking!",
            "fantastic!", "crushing the competition!", "masterful!"];

        var feedback = null;
        var i = 0;

        // TODO: Should not have to call this here...
        this.reset();

        // initialize banner pool with entities
        for(; i < BANNER_POOL_SIZE; i++) {
            feedback = new Banner();
                                    feedback.retain();
            this.bannerPool.push(feedback);
        }

        // initialize snippet pool with entities
        for(i = 0; i < SNIPPET_POOL_SIZE; i++) {
            feedback = new Snippet();
                                    feedback.retain();
            this.snippetPool.push(feedback);
        }

        // initialize doomsayer
        this.alertOverlay = new cc.Sprite(res.alertImage);
        this.alertOverlay.attr({
            scale: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            color: cc.color(255, 0, 0, 255)
        });
        this.alertOverlay.retain();
	},

    reset: function() {
        var i = 0;
        for(; i < this.bannerPool.length; i++) {
            this.bannerPool[i].stopAllActions();
            this.bannerPool[i].release();
        }

        this.bannerPool = [];

        for(i = 0; i < this.snippetPool.length; i++) {
            this.snippetPool[i].stopAllActions();
            this.snippetPool[i].release();
        }

        this.snippetPool = [];
                                    
        if(this.alertOverlay)
            this.alertOverlay.release();
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
        banner.setPosition(cc.visibleRect.center.x, cc.visibleRect.top.y * 1.1);

        this.addChild(banner);

        var targetX = data && typeof data.targetX !== 'undefined' ? data.targetX : cc.visibleRect.center.x;
        var targetY = data && typeof data.targetY !== 'undefined' ? data.targetY : cc.visibleRect.center.y;

        // start moving the banner
        var moveDuration = 0.5;
        var moveAction = cc.moveTo(moveDuration, cc.p(targetX, targetY));
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
            x = 0, y = 0,
            targetX = 0, targetY = 0;

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
        snippet.setScale(0.01, 0.01);
        snippet.setPosition(x, y);

        this.addChild(snippet);

        var scaleUpAction = cc.scaleTo(0.2, 1.0, 1.0);
        var moveAction = cc.moveTo(1, cc.p(targetX, targetY));
        var fadeOutAction = cc.fadeTo(1, 0);
        var removeAction = cc.callFunc(function() {
            that.pushSnippetPool(snippet);
            snippet.stopAllActions();
            snippet.removeFromParent(true);
        });

        snippet.runAction(cc.sequence(scaleUpAction, cc.spawn(moveAction, fadeOutAction), removeAction));
    },

    ////////////
    // SAYING //
    ////////////

    runDoomsayer: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.alertSound);

        this.alertOverlay.setOpacity(255);
        var fadeAction = cc.fadeTo(0.5, 0);
        this.alertOverlay.runAction(fadeAction);
    },

    launchDoomsayer: function() {
        if(!this.bIsDoomsayerLaunched) {
            this.schedule(this.runDoomsayer, 1);
        }

        this.bIsDoomsayerLaunched = true;
        this.addChild(this.alertOverlay);
        this.alertOverlay.setPosition(cc.visibleRect.center.x, cc.visibleRect.center.y);
        var contentSize = this.alertOverlay.getContentSize();
        this.alertOverlay.setScale(cc.visibleRect.width / contentSize.width, cc.visibleRect.height / contentSize.height);

        this.runDoomsayer();
    },

    clearDoomsayer: function() {
        this.bIsDoomsayerLaunched = false;
        this.removeChild(this.alertOverlay);
        this.unschedule(this.runDoomsayer);
    },

    isDoomsayerLaunched: function() {
        return this.bIsDoomsayerLaunched;
    }
});