/**
 * Created by jonathanlu on 2/10/16.
 */

// Extensions

Date.prototype.formatAMPM = function() {
    var hours = this.getHours();
    var minutes = this.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
};

Date.prototype.mmddyyyy = function() {
    var yyyy = this.getFullYear().toString().substr(-2);
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return mm + "/" + dd + "/" + yyyy; // padding
};