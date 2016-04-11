var express = require('express');

var app = express();

app.use('/src', express.static(__dirname + '/release/src'));
app.use('/res', express.static(__dirname + '/release/res'));
app.use('/public', express.static(__dirname + '/release/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/release/index.html');
});

app.listen(process.env.PORT || 8081, function() {

});
