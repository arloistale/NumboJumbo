/**
 * Created by jonathanlu on 3/25/16.
 */

var NJ = NJ || {};

NJ.selectionColors = (function() {
    var data = [
        // color palette from: http://www.color-hex.com/color-palette/8075
        cc.color(186, 39, 39),  // red
        cc.color(236, 157, 34), // orange
        cc.color(200, 212, 44), // yellow
        cc.color(65, 188, 49),  // green
        cc.color(44, 107, 173)  // blue
    ];

    return {
        // returns the next color in this.selectionColors[]
        // used for highlighting blocks in rainbow (or whatever) order
        getNextColor: function(index) {
            if (typeof index === 'undefined')
                index = 0;

            index %= data.length;
            return data[index];
        }
    };
}());

// returns the hex string representing the color with modified brightness
NJ.blendColors = function(color1, color2) {
    var r = color1.r + color2.r;
    var g = color1.g + color2.g;
    var b = color1.b + color2.b;

    return '#' +
        ((0|(1<<8) + r).toString(16)).substr(1) +
        ((0|(1<<8) + g).toString(16)).substr(1) +
        ((0|(1<<8) + b).toString(16)).substr(1);
};

NJ.colorWithBrightness = function(color, brightness) {
    var r = color.r;
    var g = color.g;
    var b = color.b;

    return cc.color('#' +
        ((0|(1<<8) + r * brightness).toString(16)).substr(1) +
        ((0|(1<<8) + g * brightness).toString(16)).substr(1) +
        ((0|(1<<8) + b * brightness).toString(16)).substr(1));
};