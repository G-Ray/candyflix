var io = require('socket.io')();
var spawn = require('child_process').spawn;
var getport = require('getport');
var request = require("request");

var subtitles = require('./subtitles.js');

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

    if(msg['getSubs']) {
      console.log(msg['getSubs'][0]);
      request({url: msg['getSubs'][0], encoding: null}, function(error, response, data){
        if (!error && response.statusCode == 200) {
          var path = require('path');

          subtitles.decompress(data, function(dataBuf) {
              subtitles.decode(dataBuf, msg['getSubs'][1], function(dataBuff) {
                socket.emit('dataBuf', dataBuff);
              });
          });

        }else{
          console.log('Failed to download subtitle!', error, response);
        }
      });
    }

    if(msg['url_request']) {
      var url = msg['url_request'];
      request(url, function(error, response, body) {
        socket.emit('url_request', body);
      });
    }

    if(msg['torrent'] && !msg['torrent'].stream_stop) {

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

        socket.emit('streamUrl', port);
      });
    }
  });
});
io.listen(3000);
