var express = require('express'),
    server = express.createServer();

server.use('/frameworks/cocos2d-html5', express.static(__dirname + '/frameworks/cocos2d-html5'));
server.use('/src', express.static(__dirname + '/src'));
server.use('/res', express.static(__dirname + '/res'));
server.use('/', express.static(__dirname));

server.get('/', function(req, res){
    console.log('Here we go');
});

server.get('/api/hello', function(req, res){
   res.send('Hello Cruel World');
});
server.listen(process.env.PORT || 3000);
