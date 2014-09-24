var io = require('socket.io')();
var spawn = require('child_process').spawn;
var getport = require('getport');

var processes = {};

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');

    if(socket.playing) { // There was already a stream running
      processes[socket.playing].spectators--;
      if(processes[socket.playing].spectators === 0) {
        processes[socket.playing].child.kill();
        delete processes[socket.playing];
      }
    }
  });

  socket.on('msg', function(msg){
    console.log(msg);
    if(msg['torrent']) {
      console.log(msg.torrent.stream[1]);

      getport(function (err, port) {
        if (err) console.log(err);

        if(!processes[msg.torrent.stream[1]]) {
          var process = {};
          var child = spawn('peerflix', [msg.torrent.stream[0], '--port='+ port], {});
          process.port = port;
          process.spectators = 0;
          process.child = child;

          processes[msg.torrent.stream[1]] = process;

          child.stdout.on('data', function(data) {
            //console.log('stdout: ' + data);
          });
          child.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
          });
          child.on('close', function (code, signal) {
            console.log('child process terminated due to receipt of signal '+signal);
          });
        }
        else port = processes[msg.torrent.stream[1]].port;

        processes[msg.torrent.stream[1]].spectators++;

        console.log(socket.playing);
        if(socket.playing) { // There was already a stream running
          processes[socket.playing].spectators--;
          if(processes[socket.playing].spectators === 0) {
            processes[socket.playing].child.kill();
            delete processes[socket.playing];
          }
        }

        socket.playing = msg.torrent.stream[1];

        console.log("##RUNNING PROCESSES##");
        console.log(processes);
        console.log("#####################");

        socket.emit('streamUrl', 'http://localhost:' + port);
      });
    }
  });
});
io.listen(3000);
