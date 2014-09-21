var io = require('socket.io')();
var process = require('child_process');

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('msg', function(msg){
    console.log(msg);
    io.emit('streamUrl', 'http://vjs.zencdn.net/v/oceans.mp4');
  });
});
io.listen(3000);