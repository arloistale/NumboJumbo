
var BackgroundLayer = cc.Layer.extend({
    staticLayers: [],
    dynamicLayers: [],
    duplicateLayers: [],
    dynamicMovements: [],

    //dynamicDirections: [],
    NORMAL_SPEED: 1,
    FAST_SPEED: 2,
    shiftScale: 1,

    frameCount: 0,

    ctor: function(staticSprites, dynamicSprites) {
        this._super();
        this.setTag(NJ.tags.PAUSABLE);

        this.initStaticSprites(staticSprites);
        this.initDynamicSprites(dynamicSprites);
        this.initDuplicateSprites(dynamicSprites);

        this.schedule(this.updateBackground, 0.01);
    },

    initStaticSprites: function(staticSprites) {
        for(var i=0; i<staticSprites.length; i++) {
            this.staticLayers[i] = new cc.Sprite(staticSprites[i]);
            this.staticLayers[i].attr({
                x: 0,
                y: cc.visibleRect.center.y,
                anchorX: 0,
                anchorY: 0.5,
                scale:.5,
                rotation: 0
            });
            this.addChild(this.staticLayers[i], 0);
        }
    },

    initDynamicSprites: function(dynamicSprites) {
        for(var i=0; i<dynamicSprites.length; i++) {
            this.dynamicLayers[i] = new cc.Sprite(dynamicSprites[i].image);
            this.dynamicLayers[i].attr({
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.dynamicMovements[i] = {dx: dynamicSprites[i].dx, dy: dynamicSprites[i].dy, multiplier: 1.0};
            this.addChild(this.dynamicLayers[i], 0);
        }
    },

    initDuplicateSprites: function(dynamicSprites) {
        // Each dynamic layer gets its own array of duplicates.
        for(var i=0; i<dynamicSprites.length; i++) {
            this.duplicateLayers.push([]);
            // Assign duplicates, depending on the allowed movements.
            for(var j=0; j<8; j++) {
                this.duplicateLayers[i][j] = new cc.Sprite(dynamicSprites[i].image);
                this.duplicateLayers[i][j].attr({
                    x: this.dynamicLayers[i].x,
                    y: this.dynamicLayers[i].y,
                    anchorX: this.dynamicLayers[i].anchorX,
                    anchorY: this.dynamicLayers[i].anchorY,
                    scale: this.dynamicLayers[i].scale,
                    rotation: 0
                });
                this.addChild(this.duplicateLayers[i][j], 0);
            }
            // Top
            this.duplicateLayers[i][0].y += this.dynamicLayers[i].height;
            // Bottom
            this.duplicateLayers[i][1].y -= this.dynamicLayers[i].height;
            // Right
            this.duplicateLayers[i][2].x += this.dynamicLayers[i].width;
            // Left
            this.duplicateLayers[i][3].x -= this.dynamicLayers[i].width;
            // Top-Left
            this.duplicateLayers[i][3].x -= this.dynamicLayers[i].width;
            this.duplicateLayers[i][0].y += this.dynamicLayers[i].height;
            // Top-Right
            this.duplicateLayers[i][2].x += this.dynamicLayers[i].width;
            this.duplicateLayers[i][0].y += this.dynamicLayers[i].height;
            // Bottom-Left
            this.duplicateLayers[i][3].x -= this.dynamicLayers[i].width;
            this.duplicateLayers[i][1].y -= this.dynamicLayers[i].height;
            // Bottom-Right
            this.duplicateLayers[i][2].x += this.dynamicLayers[i].width;
            this.duplicateLayers[i][1].y -= this.dynamicLayers[i].height;

/*
            // BOTTOM
            this.duplicateLayers[i][1] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][1].attr({
                x: cc.visibleRect.center.x,
                y: cc.visibleRect.center.y-this.dynamicLayers[i].height,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][1], 0);
            // RIGHT
            this.duplicateLayers[i][2] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][2].attr({
                x: cc.visibleRect.center.x+this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][2], 0);
            // LEFT
            this.duplicateLayers[i][3] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][3].attr({
                x: cc.visibleRect.center.x-this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][3], 0);
            // TOP-LEFT
            this.duplicateLayers[i][4] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][4].attr({
                x: cc.visibleRect.center.x-this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x+this.dynamicLayers[i].height,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][4], 0);
            // TOP-RIGHT
            this.duplicateLayers[i][5] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][5].attr({
                x: cc.visibleRect.center.x+this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x+this.dynamicLayers[i].height,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][5], 0);
            // BOTTOM-LEFT
            this.duplicateLayers[i][6] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][6].attr({
                x: cc.visibleRect.center.x-this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x-this.dynamicLayers[i].height,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][6], 0);
            // BOTTOM-RIGHT
            this.duplicateLayers[i][7] = new cc.Sprite(dynamicSprites[i].image);
            this.duplicateLayers[i][7].attr({
                x: cc.visibleRect.center.x+this.dynamicLayers[i].width,
                y: cc.visibleRect.center.x-this.dynamicLayers[i].height,
                anchorX: 0,
                anchorY: 0,
                scale: 1,
                rotation: 0
            });
            this.addChild(this.duplicateLayers[i][7], 0);
*/
        }
    },

    updateBackground: function() {
        for(var i=0; i<this.dynamicLayers.length; i++) {
            // Update position of layer.
            this.dynamicLayers[i].x += this.dynamicMovements[i].dx*this.dynamicMovements[i].multiplier;
            this.dynamicLayers[i].y += this.dynamicMovements[i].dy*this.dynamicMovements[i].multiplier;
            // Update positions of duplicates to the layer.
            for(var j=0; j<this.duplicateLayers[i].length; j++) {
                this.duplicateLayers[i][j].x += this.dynamicMovements[i].dx*this.dynamicMovements[i].multiplier;
                this.duplicateLayers[i][j].y += this.dynamicMovements[i].dy*this.dynamicMovements[i].multiplier;
            }
            if(this.dynamicMovements[i].dx != 0) {
                if (this.dynamicLayers[i].x > cc.visibleRect.left.x
                    //&& this.dynamicLayers[i].x < cc.visibleRect.right.x) {
                    && this.dynamicMovements[i].dx > 0) {
                    console.log("X > LEFT");
                    this.dynamicLayers[i].x -= this.dynamicLayers[i].width;
                    for (var j = 0; j < this.duplicateLayers[i].length; j++)
                        this.duplicateLayers[i][j].x -= this.dynamicLayers[i].width;
                }
                else if (this.dynamicLayers[i].x + this.dynamicLayers[i].width < cc.visibleRect.right.x
                    //&& this.dynamicLayers[i].x+this.dynamicLayers[i].width > cc.visibleRect.left.x) {
                    && this.dynamicMovements[i].dx < 0) {
                    console.log("X+W < RIGHT");
                    this.dynamicLayers[i].x += this.dynamicLayers[i].width;
                    for (var j = 0; j < this.duplicateLayers[i].length; j++)
                        this.duplicateLayers[i][j].x += this.dynamicLayers[i].width;
                }
            }

            if(this.dynamicMovements[i].dy != 0) {
                if (this.dynamicLayers[i].y > cc.visibleRect.bottom.y
                    //&& this.dynamicLayers[i].y < cc.visibleRect.top.y) {
                    && this.dynamicMovements[i].dy > 0) {
                    console.log("Y > BOTTOM");
                    this.dynamicLayers[i].y -= this.dynamicLayers[i].height;
                    for (var j = 0; j < this.duplicateLayers[i].length; j++)
                        this.duplicateLayers[i][j].y -= this.dynamicLayers[i].height;
                }
                else if (this.dynamicLayers[i].y + this.dynamicLayers[i].height < cc.visibleRect.top.y
                    //&& this.dynamicLayers[i].y > cc.visibleRect.bottom.y) {
                    && this.dynamicMovements[i].dy < 0) {
                    console.log("Y+H < TOP");
                    this.dynamicLayers[i].y += this.dynamicLayers[i].height;
                    for (var j = 0; j < this.duplicateLayers[i].length; j++)
                        this.duplicateLayers[i][j].y += this.dynamicLayers[i].height;
                }
            }
        }

    },

    speedUp: function() {
        for(var i=0; i<this.dynamicMovements.length; i++)
            this.dynamicMovements[i].multiplier += .25;
    },

    resetSpeed: function() {
        for(var i=0; i<this.dynamicMovements.length; i++)
            this.dynamicMovements[i].multiplier = 1;
    }
});