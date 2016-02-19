var express = require('express');

var app = express();

app.configure(function() {
    app.use('/frameworks/cocos2d-html5', express.static(__dirname + '/frameworks/cocos2d-html5'));
    app.use('/src', express.static(__dirname + '/src'));
    app.use('/res', express.static(__dirname + '/res'));
    app.use('/public', express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 8081, function() {

});