var express = require('express');

var app = express();
var server = http.createServer(app);

server.use('/frameworks/cocos2d-html5', express.static(__dirname + '/frameworks/cocos2d-html5'));
server.use('/src', express.static(__dirname + '/src'));
server.use('/res', express.static(__dirname + '/res'));
server.use('/', express.static(__dirname));

server.get('/', function(req, res) {
});

server.listen(process.env.PORT || 8081);