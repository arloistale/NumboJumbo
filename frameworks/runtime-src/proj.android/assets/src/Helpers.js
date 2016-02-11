/* *
 * some useful helper fns
 */

var NJHelper = NJHelper || {};

// takes in a list of {key, weight} pairs, and returns a random key
// eg, [{key:1, weight:3}, {key:2, weight:7}] 
// returns the key 2 about 70% of the time.
// only use non-negative weights if you expect sane results!
NJ.weightedRandom: function(pairsList){

    var totalWeight = 0;
    for (var pair in pairsList)
	totalWeight += pair.weight;
    value = Math.random()*totalWeight;
    
    for (var pair in pairsList){
	if (value < pair.weight)
	    return pair.key;
	else
	    value -= pair.weight
    }
    
    console.log("uh oh, i should have returned by now!");
    
};