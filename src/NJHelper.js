/* *
 * some useful helper fns
 */

var NJ = NJ || {};

// takes in a list of {key, weight} pairs, and returns a random key
// eg, [{key:1, weight:3}, {key:2, weight:7}]
// returns the key 2 about 70% of the time.
// only use non-negative weights if you expect sane results!
NJ.weightedRandom = function(pairsList) {
    var totalWeight = 0;

    for (var pair in pairsList)
        totalWeight += pairsList[pair].weight;

    var value = Math.random() * totalWeight;

    for (var pair in pairsList) {
        if (value < pairsList[pair].weight)
            return pairsList[pair].key;
        else
            value -= pairsList[pair].weight;
    }
 
    return -1;
};


NJ.shuffleArray = function() {
    var i = this.length, j, temp;
    if(i == 0) return this;
    while(--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }

    return this;
};