var io = require('socket.io')();
var spawn = require('child_process').spawn;
var getport = require('getport');
var request = require("request");

var langcodes = require('./langcodes.js');

var processes = {};

// Decompress zip
function decompress(dataBuff, callback) {
  try {
    console.log(dataBuff);
    var AdmZip  = require('adm-zip');
    var zip = new AdmZip(dataBuff);
    var zipEntries = zip.getEntries();
    console.log(zipEntries);
    // TODO: Shouldn't we look for only 1 file ???
    zipEntries.forEach(function(zipEntry, key) {
      if (zipEntry.entryName.indexOf('.srt') != -1) {
        var decompressedData = zip.readFile(zipEntry);
        callback(decompressedData);
      }
    });
  } catch (error) {
    console.log('Failed to decompress subtitle!', error);
  }
}

// Handles charset encoding
function decode(dataBuff, language, callback) {
  var charsetDetect = require('jschardet');
  var targetEncodingCharset = 'utf8';

  var charset = charsetDetect.detect(dataBuff);
  var detectedEncoding = charset.encoding;
  console.log("SUB charset detected: "+detectedEncoding);
  // Do we need decoding?
  if (detectedEncoding.toLowerCase().replace('-','') == targetEncodingCharset) {
    callback(dataBuff.toString('utf-8'));
  // We do
  } else {
    var iconv = require('iconv-lite');
    var langInfo = langcodes[language] || {};
    console.log("SUB charset expected: "+langInfo.encoding);
    if (langInfo.encoding !== undefined && langInfo.encoding.indexOf(detectedEncoding) < 0) {
      // The detected encoding was unexepected to the language, so we'll use the most common
      // encoding for that language instead.
      detectedEncoding = langInfo.encoding[0];
    }
    console.log("SUB charset used: "+detectedEncoding);
    dataBuff = iconv.encode( iconv.decode(dataBuff, detectedEncoding), targetEncodingCharset );
    callback(dataBuff.toString('utf-8'));
  }
}

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

    if(msg['getSubs']) {
      console.log(msg['getSubs'][0]);
      request({url: msg['getSubs'][0], encoding: null}, function(error, response, data){
        if (!error && response.statusCode == 200) {
          var path = require('path');

          decompress(data, function(dataBuf) {
              decode(dataBuf, msg['getSubs'][1], function(dataBuff) {
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
        console.log(body);
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

        socket.emit('streamUrl', port);
      });
    }
  });
});
io.listen(3000);
