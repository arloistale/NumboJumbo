var express = require('express');

var app = express();

app.configure(function() {
    app.use('/frameworks/cocos2d-html5', express.static(__dirname + '/frameworks/cocos2d-html5'));
    app.use('/src', express.static(__dirname + '/src'));
    app.use('/res', express.static(__dirname + '/res'));

    app.use('/', express.static(__dirname + '/site'));
});

app.listen(process.env.PORT || 8081, function() {

});