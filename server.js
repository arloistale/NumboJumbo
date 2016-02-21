var express = require('express');

var app = express();

app.configure(function() {
    app.use('/src', express.static(__dirname + '/src'));
    app.use('/res', express.static(__dirname + '/res'));
    app.use('/public', express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/release.html');
});

app.listen(process.env.PORT || 8081, function() {

});
