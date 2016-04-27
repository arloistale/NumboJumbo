var EXPLOSION_POOL_SIZE = 40;

var EffectsLayer = cc.Layer.extend({

    // object pools
    _explosionPool: [],

    // feedback doomsayer
    _comboOverlay: null,
    _isComboLaunched: false,

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

        var entity = null;
        var i = 0;

        // TODO: Should not have to call this here...
        this.reset();

        // initialize explosion pool
        for(i = 0; i < EXPLOSION_POOL_SIZE; i++) {
            entity = this._generateNumboParticleSystem();
            entity.retain();
            this._explosionPool.push(entity);
        }

        // initialize combo overlay
        this._comboOverlay = new cc.Sprite(res.alertImage);
        var contentSize = this._comboOverlay.getContentSize();
        this._comboOverlay.setScale(cc.visibleRect.width / contentSize.width, cc.visibleRect.height / contentSize.height);
        this._comboOverlay.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: cc.visibleRect.center.x,
            y: cc.visibleRect.center.y,
            visible: false
        });
        this.addChild(this._comboOverlay);
	},

    reset: function() {
        var i = 0;

        for(i = 0; i < this._explosionPool.length; i++) {
            this._explosionPool[i].stopSystem();
            this._explosionPool[i].stopAllActions();
            this._explosionPool[i].release();
        }

        this._explosionPool = [];
    },

    _generateNumboParticleSystem: function() {
        var particleSystem = new cc.ParticleExplosion();

        particleSystem.setDuration(0.1); // Suspicious
        particleSystem.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);
        particleSystem.setGravity(cc.p(0, 0));

        // speed
        particleSystem.setSpeed(70);
        particleSystem.setSpeedVar(40);

        // Gravity Mode: radial
        particleSystem.setRadialAccel(-120);
        particleSystem.setRadialAccelVar(0);

        // Gravity Mode: tangential
        particleSystem.setTangentialAccel(0);
        particleSystem.setTangentialAccelVar(0);

        // angle
        particleSystem.setAngle(90);
        particleSystem.setAngleVar(360);

        // life of particles
        particleSystem.setLife(0.5);
        particleSystem.setLifeVar(0.1);

        // size, in pixels
        particleSystem.setStartSize(10.0);
        particleSystem.setStartSizeVar(10.0);
        particleSystem.setEndSize(3);

        //particleSystem.setParticlesColor(cc.color("#ffffff"));

        // emits per second
        particleSystem.setEmissionRate(15 / 0.1);

        // additive
        particleSystem.setBlendAdditive(false);

        particleSystem.setTexture(cc.textureCache.addImage(res.blockImage));
        particleSystem.stopSystem();
        particleSystem.setVisible(false);

        return particleSystem;
    },

/////////////
// POOLING //
/////////////

    // push explosion into pool
    pushExplosionPool: function(entity) {
        cc.assert(this._explosionPool.length < EXPLOSION_POOL_SIZE, "Exceeded pool size for explosions: " + (this._explosionPool.length + 1));
        this._explosionPool.push(entity);
    },

    // pops a banner from the banner pool,
    // NOTE: Allocates a new banner if needed, increase pool size if this happens!
    popExplosionPool: function() {
        cc.assert (this._explosionPool.length > 0, "error: trying to create too many explosions!");

        var explosion = this._explosionPool.pop();
        explosion.stopAllActions();
        explosion.stopSystem();
        explosion.setVisible(false);

        return explosion;
    },

    ///////////////
    // LAUNCHING //
    ///////////////

    /*
     * Launches a explosion onto the feedback layer.
     *
     * Usage: launchExplosion ({ color: cc.color("#ffffff"), x: 500, y: 500 })
     */
    launchExplosion: function(data) {
        var entity = this.popExplosionPool();

        var that = this;

        var x = 0, y = 0,
            color = cc.color("#ffffff");

        if(data) {
            if(typeof data.x !== 'undefined')
                x = data.x;

            if(typeof data.y !== 'undefined')
                y = data.y;

            if(typeof data.color !== 'undefined')
                color = data.color;
        }

        // color of particles
        entity.setStartColor(color);
        entity.setStartColorVar(cc.color(0, 0, 0, 0));
        entity.setEndColor(color);
        entity.setEndColorVar(cc.color(0, 0, 0, 0));

        entity.setPosition(x, y);
        entity.setVisible(true);
        entity.resetSystem();

        this.addChild(entity, 4);

        var removeAction = cc.callFunc(function() {
            that.pushExplosionPool(entity);

            entity.stopAllActions();
            entity.stopSystem();
            entity.removeFromParent(false);
        });

        // TODO: we hard code an expected particle system lifespan of 1 second
        // maybe make this more flexible
        entity.runAction(cc.sequence(cc.delayTime(1), removeAction));
    },

    ///////////////////
    // Combo Overlay //
    ///////////////////

    launchComboOverlay: function() {
        if(NJ.settings.sounds)
            cc.audioEngine.playEffect(res.cheerSound3);

        this._isComboLaunched = true;
        this._comboOverlay.setVisible(true);
    },

    clearComboOverlay: function() {
        this._isComboLaunched = false;

        this._comboOverlay.setVisible(false);
    },

    isComboOverlayLaunched: function() {
        return this._isComboLaunched;
    }
});