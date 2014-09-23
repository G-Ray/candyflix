var io = require('socket.io')();
var spawn = require('child_process').spawn;
var getport = require('getport');

var processes = {};

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
        if(!processes[msg.torrent.stream[1]]) {
          var child = spawn('peerflix', [msg.torrent.stream[0], '--port='+ port], {});
          processes[msg.torrent.stream[1]] = port;

          child.stdout.on('data', function(data) {
            //console.log('stdout: ' + data);
          });
          child.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
          });
        }
        else port = processes[msg.torrent.stream[1]];

        console.log("###RUNNING PROCESSES###");
        console.log(processes);
        console.log("#####################");

        socket.emit('streamUrl', 'http://localhost:' + port);
      });
    }
  });
});
io.listen(3000);
