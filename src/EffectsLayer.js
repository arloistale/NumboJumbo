var EXPLOSION_POOL_SIZE = 40;

var EffectsLayer = cc.Layer.extend({

    _explosionTag: 55,
    _explosionGrid: null,

    _shadowGrid: null,


    // feedback doomsayer
    _comboOverlay: null,
    _isComboLaunched: false,

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

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


        // initialize particle systems
        this._explosionGrid = new Array(NJ.NUM_COLS);
        for (var col = 0; col < NJ.NUM_COLS; ++col){
            this._explosionGrid[col] = new Array(NJ.NUM_ROWS);
            for (var row = 0; row < NJ.NUM_ROWS; ++row){
                // stick a placeholder value in there -- call initializeParticleSystemAt from the gameLayer on each one
                this._explosionGrid[col][row] = "this should be initialized to a particleSystem!";
            }
        }

        // initialize block shadow grid
        this._shadowGrid = new Array(NJ.NUM_COLS);
        for (var col = 0; col < NJ.NUM_COLS; ++col){
            this._shadowGrid[col] = new Array(NJ.NUM_ROWS);
            for (var row = 0; row < NJ.NUM_ROWS; ++row){
                this._shadowGrid[col][row] = "this needs to be initialized! idiot";
            }
        }
	},



    // to be called by the gameLayer during its initialization
    // (this seems weird, but the gameLayer knows where the x/y coordinates are,
    // so it is kinda the only way to do it)
    //
    // takes in an object containing the col/row indeces AND the x/y coordinates
    // and creates a new particle system there
    initializeParticleSystemAt: function (data) {
        cc.assert(typeof data.x == 'number' && typeof data.y == 'number'
            && typeof data.col == 'number' && typeof data.row == 'number',
            "error in initializeParticleSystemAt: non-number params");

        if (0 <= data.col && data.col < NJ.NUM_COLS && 0 <= data.row && data.row < NJ.NUM_ROWS) {
            var particleSystem = this._generateNumboParticleSystem(data);
            this._explosionGrid[data.col][data.row] = particleSystem;
        }
    },

    initializeShadowAt: function(data){
        cc.assert(typeof data.x == 'number' && typeof data.y == 'number'
            && typeof data.col == 'number' && typeof data.row == 'number',
            "error in initializeShadowAt: non-number params");

        if (0 <= data.col && data.col < NJ.NUM_COLS && 0 <= data.row && data.row < NJ.NUM_ROWS
            && data.blockSize && data.blockSize.height && data.blockSize.width) {

            var shadow = new cc.Sprite(res.blockImage);
            var shadowSize = shadow.getContentSize();
            shadow.setScale(1.1 * data.blockSize.width / shadowSize.width, 1.1 * data.blockSize.height / shadowSize.height);
            shadow.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                visible: false,
                x: data.x,
                y: data.y,
                color: NJ.themes.shadowColor
            });

            cc.log(this._shadowGrid[data.col][data.row]);
            this._shadowGrid[data.col][data.row] = shadow;
            this.addChild(shadow, 1);
        }

    },

    reset: function(){
        // not sure why this exists -- maybe we should delete old particle systems? idk
    },

    _generateNumboParticleSystem: function(data) {
        var particleSystem = new cc.ParticleExplosion();

        if (data.x && data.y) {
            particleSystem.setPosition(cc.p(data.x, data.y));
        }

        particleSystem.setTag(this._explosionTag);

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
        particleSystem.setStartSize(15.0);
        particleSystem.setStartSizeVar(10.0);
        particleSystem.setEndSize(0.0);

        // emits per second
        particleSystem.setEmissionRate(5 / 0.1);

        // additive
        particleSystem.setBlendAdditive(false);

        particleSystem.setTexture(cc.textureCache.addImage(res.blockImage));
        particleSystem.stopSystem();
        particleSystem.setVisible(false);

        this.addChild(particleSystem, 4);

        return particleSystem;
    },

    ///////////////
    // LAUNCHING //
    ///////////////

    launchExplosion: function(col, row, color) {
        var that = this;
        var particleSystem = this._explosionGrid[col][row];

        // initialize colors to have no variance and no change
        particleSystem.setStartColor(color);
        particleSystem.setStartColorVar(cc.color(0, 0, 0, 0));
        particleSystem.setEndColor(color);
        particleSystem.setEndColorVar(cc.color(0, 0, 0, 0));

        particleSystem.setVisible(true);
        particleSystem.resetSystem();

        var invisibleAction = cc.callFunc(function() {
            particleSystem.setVisible(false);
        });

        particleSystem.runAction(cc.sequence(cc.delayTime(1), invisibleAction));

        this.launchShadow(col, row, NJ.themes.shadowColor);
    },

    launchShadow: function(col, row, color){
        var that = this;
        if (0 <= col && col < NJ.NUM_COLS && 0 <= row && NJ.NUM_ROWS) {
            var shadow = that._shadowGrid[col][row];

            if (color){
                shadow.setColor(color);
            }

            shadow.setVisible(true);
            shadow.setOpacity(0.75*255);
            //var fadeAction = cc.fadeOut(1.0);
            //shadow.runAction(fadeAction);
            shadow.runAction(cc.sequence(cc.fadeOut(0.75), cc.callFunc(function(){
                shadow.setVisible(false);
            })));
        }
    },

    ///////////////////
    // Combo Overlay //
    ///////////////////

    launchComboOverlay: function(color) {
        this._isComboLaunched = true;
        this._comboOverlay.setColor(color);
        this._comboOverlay.setVisible(true);
    },

    clearComboOverlay: function() {
        if(!this._isComboLaunched)
            return;

        this._isComboLaunched = false;

        this._comboOverlay.setVisible(false);
    },

    isComboOverlayLaunched: function() {
        return this._isComboLaunched;
    }
});