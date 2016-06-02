
var SNIPPET_POOL_SIZE = 10;

var FeedbackLayer = cc.Layer.extend({

    _snippetTag: 56,

    // feedback object pools
    snippetPool: [],

    // feedback doomsayer
    bIsDoomsayerLaunched: false,

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

        var entity = null;
        var i = 0;

        // TODO: Should not have to call this here...
        //this.reset();

        // initialize snippet pool with entities
        for(i = 0; i < SNIPPET_POOL_SIZE; i++) {
            entity = new Snippet();
            entity.setTag(this._snippetTag);
            entity.retain();
            this.snippetPool.push(entity);
        }
	},

    // TODO: Memory leaks???

    reset: function() {
        this.clearDoomsayer();

        var children = this.getChildren();
        var entity = null;

        for(var i = 0; i < children.length; ++i) {
            entity = children[i];
            if(entity.getTag() == this._snippetTag) {
                this.pushSnippetPool(entity);
                entity.stopAllActions();
                entity.removeFromParent(false);
            }
        }
    },

/////////////
// POOLING //
/////////////

    // push snippet back into pool
    pushSnippetPool: function(snippet) {
        cc.assert(this.snippetPool.length < SNIPPET_POOL_SIZE, "Exceeded pool size for snippets: " + (this.snippetPool.length + 1));
        this.snippetPool.push(snippet);
    },

    // pops a snippet from the pool
    // NOTE: Allocates a new snippet if needed, increase pool size if this happens!
    popSnippetPool: function() {
        cc.assert (this.snippetPool.length > 0, "error: trying to create too many snippets!");

        var snippet = this.snippetPool.pop();
        snippet.reset();

        return snippet;
    },

///////////////
// LAUNCHING //
///////////////

    /*
     * Launches a snippet onto the feedback layer. Show some text on the screen!
     *
     *
     * Usage: launchSnippet ({ title: 'Hello', x: 500, y: 500, targetX: 400, targetY: 400 })
     */
    launchSnippet: function(data) {
        var snippet = this.popSnippetPool();

        var that = this;

        var titleStr = "Default String",
            x = 0, y = 0,
            color = cc.color("#ffffff"),
            targetX = 0, targetY = 0,
            targetScale = 1;

        var easing = cc.easeQuinticActionOut();

        if(data) {
            if(typeof data.title !== 'undefined')
                titleStr = data.title;

            if(typeof data.x !== 'undefined')
                x = data.x;

            if(typeof data.y !== 'undefined')
                y = data.y;

            if(typeof data.color !== 'undefined')
                color = data.color;

            if(typeof data.easing != 'undefined')
                easing = data.easing;

            if(typeof data.targetX !== 'undefined')
                targetX = data.targetX;

            if(typeof data.targetY !== 'undefined')
                targetY = data.targetY;

            if(typeof data.targetScale !== 'undefined')
                targetScale = data.targetScale;
        }

        snippet.setLabelSize(Math.min(cc.visibleRect.width, cc.visibleRect.height) * 0.05);
        snippet.setColor(color);
        snippet.setText(titleStr);
        snippet.setScale(0.01, 0.01);
        snippet.setPosition(x, y);

        this.addChild(snippet, 4);

        var scaleUpAction = cc.scaleTo(0.2, targetScale, targetScale);
        var moveAction = cc.moveTo(1, cc.p(targetX, targetY)).easing(easing);
        var fadeOutAction = cc.fadeTo(1, 0);
        var removeAction = cc.callFunc(function() {
            that.pushSnippetPool(snippet);
            snippet.stopAllActions();
            snippet.removeFromParent(false);
        });

        snippet.runAction(cc.sequence(scaleUpAction, cc.spawn(moveAction, fadeOutAction), removeAction));
    },

    ////////////
    // SAYING //
    ////////////

    runDoomsayer: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.tickSound);
    },

    launchDoomsayer: function() {
        if(!this.bIsDoomsayerLaunched) {
            this.schedule(this.runDoomsayer, 0.7);
        }

        this.bIsDoomsayerLaunched = true;

        this.runDoomsayer();
    },

    clearDoomsayer: function() {
        this.bIsDoomsayerLaunched = false;
        this.unschedule(this.runDoomsayer);
    },

    isDoomsayerLaunched: function() {
        return this.bIsDoomsayerLaunched;
    }
});