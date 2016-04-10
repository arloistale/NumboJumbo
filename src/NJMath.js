/**
 * Created by jonathanlu on 2/26/16.
 */

var NJ = NJ || {};

NJ.getRandomUnitVector = function() {
    var angle = Math.random() * 2 * Math.PI;
    var x = Math.cos(angle);
    var y = Math.sin(angle);
    return cc.p(x, y);
};