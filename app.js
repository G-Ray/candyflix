var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use(express.static('public'));

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

/*app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});*/
