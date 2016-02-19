/**
 * Created by jonathanlu on 2/5/16.
 *
 * Library of jumbos.
 *
 */

var NJ = NJ || {};

NJ.jumbos = {
    isLoaded: false,

    data: {

    }
};

NJ.loadJumbosFromJSON = function() {
    NJ.jumbos.isLoaded = false;

    cc.loader.loadJson(res.jumboDistributionsJSON, function(error, data) {
        if(error) {
            cc.log(error);
            return;
        }

        var currIndex = 0;
        for(var key in data) {
            NJ.jumbos.data[key] = {
                index: currIndex,
                name: data[key].name,
                difficulty: data[key].difficulty,
                spawnTime: data[key].spawnTime,
                numberList: data[key].numberList,
                weight: data[key].weight
            };

            currIndex++;
        }

        NJ.jumbos.isLoaded = true;
    });
};