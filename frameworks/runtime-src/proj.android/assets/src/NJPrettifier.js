/**
 * Created by jonathanlu on 3/9/16.
 */

var NJ = NJ || {};

NJ.prettifier = (function() {
    var suffixes = ['k', 'm', 'b', 't'];

    /**
     * Recursive implementation, invokes itself for each factor of a thousand, increasing the class on each invokation.
     * @param n the number to format
     * @param iteration in fact this is the class from the array c
     * @return a String representing the number n formatted in a cool looking way.
     */
    var coolFormat = function(n, iteration) {
        var d = Math.floor((Math.floor(n) / 100)) / 10.0;
        var isRound = (d * 10) % 10 == 0;//true if the decimal part is equal to 0 (then it's trimmed anyway)
        return (d < 1000 ? //this determines the class, i.e. 'k', 'm' etc
            ((d > 99.9 || isRound || (!isRound && d > 9.99) ? //this decides whether to trim the decimals
                Math.floor(Math.floor(d) * 10 / 10) : d + "" // (int) d * 10 / 10 drops the decimal
            ) + "" + suffixes[iteration]) : coolFormat(d, iteration + 1));
    };

    return {
        formatNumber: function (n) {
            return n >= 1000 ? coolFormat(n, 0) : (n + "");
        }
    }
}());