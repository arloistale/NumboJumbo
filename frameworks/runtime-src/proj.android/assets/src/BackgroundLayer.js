/**
 * Created by The Dylan on 2/13/2016.
 */
var BackgroundLayer = cc.Layer.extend({
    // Sprite Data
    bottomLayer: null,
    middleLayer: null,
    middleLayerTwo: null,
    topLayer: null,
    topLayerTwo: null,

    NORMAL_SPEED: 0,
    FAST_SPEED: 1,
    speed: 0,

    frameCount: 0,

    ctor: function () {
        this._super();

        this.setTag(NJ.tags.PAUSABLE);

        //this.initSprites();
    },

    // Initializes the background sprites for the scrolling background.
    initSprites: function() {
        this.bottomLayer = new cc.Sprite(res.backBottom);
        this.bottomLayer.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.bottomLayer, 0);

        this.middleLayer = new cc.Sprite(res.backMiddle);
        this.middleLayer.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 1,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.middleLayer, 0);

        this.middleLayerTwo = new cc.Sprite(res.backMiddle);
        this.middleLayerTwo.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 1,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.middleLayerTwo, 0);
/*
        this.topLayer = new cc.Sprite(res.backTop);
        this.topLayer.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 1,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.topLayer, 0);

        this.topLayerTwo = new cc.Sprite(res.backTop);
        this.topLayerTwo.attr({
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            anchorX: 0.5,
            anchorY: 1,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.topLayerTwo, 0);
*/
        this.schedule(this.moveBackground, 0.01);
    },

    // PRIVATE! used by BackgroundLayer to calculate a parallax shift.
    updateBackground: function(shift) {
        this.middleLayer.y += shift;
        this.middleLayerTwo.y += shift;
        //this.topLayer.y += shift*2;
        //this.topLayerTwo.y += shift*2;

        if(this.middleLayer.y > this.middleLayerTwo.y) {
            if(this.middleLayerTwo.y > cc.visibleRect.top.y)
                this.middleLayer.y = this.middleLayerTwo.y - this.middleLayer.height;
        }
        else {
            if(this.middleLayer.y > cc.visibleRect.top.y)
                this.middleLayerTwo.y = this.middleLayer.y - this.middleLayerTwo.height;
        }
/*
        if(this.topLayer.y > this.topLayerTwo.y) {
            if(this.topLayerTwo.y > cc.visibleRect.top.y)
                this.topLayer.y = this.topLayerTwo.y - this.topLayer.height;
        }
        else {
            if(this.topLayer.y > cc.visibleRect.top.y)
                this.topLayerTwo.y = this.topLayer.y - this.topLayerTwo.height;
        }
        */
    },

    // Called by GameLayer each frame to move background depending on state.
    moveBackground: function() {
        if(this.speed == this.NORMAL_SPEED)
            this.updateBackground(1);
        else if(this.speed == this.FAST_SPEED) {
            this.updateBackground(3);
            this.frameCount--;
            if(this.frameCount == 0)
                this.speed = this.NORMAL_SPEED;
        }
    },

    // Start a rush, the background moving 3X as fast.
    initRush: function(duration) {
        this.speed = this.FAST_SPEED;
        this.frameCount = duration;
    }
});