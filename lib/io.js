module.exports = function(server){
    var io = require('socket.io')(server);
    var socket;
    io.on('connection',function(socket){
        socket.on('sendChat',function(data){
            io.emit('getChat',data);
        });
        socket.on('createGroup',function(data){
            io.emit('createGroup',data);
        });
        socket.on('MessageLoad',function(data){
            io.emit('MessageLoad',data);
        });
        socket.on('updateFullGroup',function(data){
            io.emit('updateFullGroup',data);
        });
        socket.on('addActivities',function(data){
            io.emit('addActivities',data);
        });
        socket.on('getLastRead',function(data){
            io.emit('getLastRead',data);
        });
        console.log('a user connected');
    })
}