/**
 * Created by jonathanlu on 4/21/16.
 */

var NumboParticleExplosion = cc.ParticleSystem.extend({

    ctor: function() {
        this._super();

        cc.assert(this.init(), "Fatal error with NumboParticleExplosion");
    },

    // initialize the particle system
    init: function () {
        return this.initWithTotalParticles(15);
    },

    // initialize the particle system with specified number of particles
    initWithTotalParticles: function (numberOfParticles) {
        if (!cc.ParticleSystem.prototype.initWithTotalParticles.call(this, numberOfParticles))
            return false;

        // duration
        this.setDuration(0.1);

        this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

        // Gravity Mode: gravity
        this.setGravity(cc.p(0, 0));

        // Gravity Mode: speed of particles
        this.setSpeed(70);
        this.setSpeedVar(40);

        // Gravity Mode: radial
        this.setRadialAccel(-120);
        this.setRadialAccelVar(0);

        // Gravity Mode: tangential
        this.setTangentialAccel(0);
        this.setTangentialAccelVar(0);

        // angle
        this.setAngle(90);
        this.setAngleVar(360);

        // life of particles
        this.setLife(0.5);
        this.setLifeVar(0.1);

        // size, in pixels
        this.setStartSize(10.0);
        this.setStartSizeVar(10.0);
        this.setEndSize(3);

        this.setParticlesColor(cc.color("#ffffff"));

        // emits per second
        this.setEmissionRate(this.getTotalParticles() / this.getDuration());

        // additive
        this.setBlendAdditive(false);

        return true;
    },

    setParticlesColor: function(color) {
        // color of particles
        this.setStartColor(color);
        this.setStartColorVar(cc.color(0, 0, 0, 0));
        this.setEndColor(color);
        this.setEndColorVar(cc.color(0, 0, 0, 0));
    }
});