var io = require('socket.io')();
var spawn = require('child_process').spawn;

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('msg', function(msg){
    console.log(msg);
    if(msg['torrent']) {
      console.log(msg.torrent.stream[0]);
      //var peerflix = process.exec('peerflix ' + msg.torrent.stream[0] + ' --port 8086');
      var child = spawn('peerflix', [msg.torrent.stream[0], '--port='+ 8080], {});
      child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });
      child.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });

      io.emit('streamUrl', 'http://localhost:8080/');
    }
  });
});
io.listen(3000);