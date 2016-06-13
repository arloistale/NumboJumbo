/* *
 * some useful helper fns
 */

var NJ = NJ || {};

// takes in a list of {key, weight} pairs, and returns a random key
// eg, [{key:1, weight:3}, {key:2, weight:7}]
// returns the key 2 about 70% of the time.
// only use non-negative weights if you expect sane results!
NJ.weightedRandom = function(pairsList) {
    var pair = null;
    var totalWeight = 0;

    for (pair in pairsList) {
        if(!pairsList.hasOwnProperty(pair))
            continue;

        totalWeight += pairsList[pair].weight;
    }

    var value = Math.random() * totalWeight;

    for (pair in pairsList) {
        if(!pairsList.hasOwnProperty(pair))
            continue;

        if (value < pairsList[pair].weight) {
            return pairsList[pair].key;
        } else {
            value -= pairsList[pair].weight;
        }
    }
 
    return -1;
};

// shuffles the array
NJ.shuffleArray = function(array) {
    var i = array.length, j, temp;
    if(i == 0)
        return array;

    while(--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

NJ.openAppDetails = function() {
    var url = "https://www.facebook.com/numbojumbogame";

    /*
    switch(cc.sys.os) {
        case cc.sys.OS_ANDROID:
            url = "market://details?id=com.fortafygames.colorswitch";
            break;
        case cc.sys.OS_IOS:
            url = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1053533457&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8";
            break;
    }*/

    cc.sys.openURL(url);
};