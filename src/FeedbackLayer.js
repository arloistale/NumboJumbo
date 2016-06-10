var FeedbackLayer = cc.Layer.extend({

    // feedback doomsayer
    bIsDoomsayerLaunched: false,

////////////////////
// INITIALIZATION //
////////////////////

	ctor: function() {
		this._super();

        var entity = null;
        var i = 0;
	},

    // TODO: Memory leaks???

    reset: function() {
        this.clearDoomsayer();
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