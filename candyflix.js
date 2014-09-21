var io = require('socket.io')();
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('msg', function(msg){
    console.log(msg);
  });
});
io.listen(3000);