var io = require('socket.io')();
var spawn = require('child_process').spawn;
var getport = require('getport');

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('msg', function(msg){
    console.log(msg);
    if(msg['torrent']) {
      console.log(msg.torrent.stream[0]);

      getport(function (err, port) {
        if (err) console.log(err);
        var child = spawn('peerflix', [msg.torrent.stream[0], '--port='+ port], {});
        child.stdout.on('data', function(data) {
          //console.log('stdout: ' + data);
        });
        child.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
        });

        socket.emit('streamUrl', 'http://localhost:' + port);
      });
    }
  });
});
io.listen(3000);
