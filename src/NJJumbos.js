/**
 * Created by jonathanlu on 2/5/16.
 *
 * Library of jumbos.
 *
 */

var NJ = NJ || {};

NJ.jumbos = (function() {
    var isLoaded = false;
    var jumboData = {};

    var jumboDistribution = [];

    return {
        load: function(callback) {
            isLoaded = false;

            cc.loader.loadJson(res.jumboDistributionsJSON, function(error, data) {
                if(error) {
                    cc.log(error);
                    callback(error);
                }

                var currIndex = 0;
                for(var key in data.jumbos) {
                    if(!data.jumbos.hasOwnProperty(key))
                        continue;
                    console.log(key);
                    jumboData[key] = {
                        index: currIndex,
                        key: key,
                        name: data.jumbos[key].name,
                        highscoreThreshold: data.jumbos[key].highscoreThreshold,
                        currencyThreshold: data.jumbos[key].currencyThreshold,
                        color: data.jumbos[key].color,
                        difficulty: data.jumbos[key].difficulty,
                        spawnTime: data.jumbos[key].spawnTime,
                        numberList: data.jumbos[key].numberList,
                        weight: data.jumbos[key].weight
                    };

                    currIndex++;
                }

                NJ.jumbos.initJumboDistribution();

                isLoaded = true;

                callback(null);
            });
        },

        initJumboDistribution: function() {
            for (var key in jumboData) {
                if(jumboData.hasOwnProperty(key))
                    jumboDistribution.push({key: key, weight: jumboData[key].weight});
            }
            console.log(jumboDistribution);
        },

        // returns a jumbo given a key
        getJumboDataWithKey: function(key) {
            return jumboData[key];
        },

        // returns an iterable list of jumbos
        getJumbosList: function() {
            return Object.keys(jumboData).map(function(key) { return jumboData[key]; });
        },

        getJumboDistribution: function() {
            return jumboDistribution;
        }
    }
}());