/**
 * Created by jonathanlu on 2/26/16.
 */

var NJ = NJ || {};

NJ.raycastCircleTest = function(origin, end, testPoint, testRadius) {
    var d = cc.pSub(end, origin);
    var f = cc.pSub(origin, testPoint);

    cc.log("d: " + d + " | f: " + f);
};

NJ.getRandomUnitVector = function() {
    var angle = Math.random() * 2 * Math.PI;
    var x = Math.cos(angle);
    var y = Math.sin(angle);
    return cc.p(x, y);
};