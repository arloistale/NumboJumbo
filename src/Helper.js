/* *
 * some useful helper fns
 */

var NJHelper = NJHelper || {};

// takes in a list of {key, weight} pairs, and returns a random key
// eg, [{key:1, weight:3}, {key:2, weight:7}]
// returns the key 2 about 70% of the time.
// only use non-negative weights if you expect sane results!
NJHelper.weightedRandom = function(pairsList){
    console.log(pairsList);
    var totalWeight = 0;
    for (var pair in pairsList)
        totalWeight += pairsList[pair].weight;
    var value = Math.random()*totalWeight;

    for (var pair in pairsList){
        if (value < pairsList[pair].weight)
            return pairsList[pair].key;
        else
            value -= pairsList[pair].weight;
    }

    console.log("uh oh, i should have returned by now!");

};