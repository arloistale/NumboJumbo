var ComboManager = cc.Class.extend({
   // Data
    mScore: 0,

    init: function() {
        this.reset();

    },

    reset: function() {
        mScore = 0;
    },

    addScoreForCombo: function(blockCount) {
        mScore += this.getScoreForCombo(blockCount);
    },

    getScore: function() {
        return mScore;
    },

    getScoreForCombo: function(blockCount) {
        return 16 * Math.pow(NJ.E_CONST, Math.max(blockCount-2, 0));
    }
});