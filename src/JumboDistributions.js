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
        jumbos: {

        },
        jumboMap: {

        }
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
        for(var key in data.jumbos) {
            NJ.jumbos.data.jumbos[key] = {
                index: currIndex,
                name: data.jumbos[key].name,
                difficulty: data.jumbos[key].difficulty,
                spawnTime: data.jumbos[key].spawnTime,
                numberList: data.jumbos[key].numberList,
                weight: data.jumbos[key].weight
            };

            currIndex++;
        }

       NJ.jumbos.jumboMap = data.jumboMap;
    });
};