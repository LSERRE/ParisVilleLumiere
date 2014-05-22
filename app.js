/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/mobile.html', function (req, res) {
    res.sendfile(__dirname + '/views/mobile.html');
});
app.get('/merci.html', function (req, res) {
    res.sendfile(__dirname + '/views/merci.html');
});
app.get('/scene1.html', function (req, res) {
    res.sendfile(__dirname + '/views/scene1.html');
});
app.get('/scene2.html', function (req, res) {
    res.sendfile(__dirname + '/views/scene2.html');
});
app.get('/scene3.html', function (req, res) {
    res.sendfile(__dirname + '/views/scene3.html');
});
app.get('/scene4.html', function (req, res) {
    res.sendfile(__dirname + '/views/scene4.html');
});

app.get('/scene5.html', function (req, res) {
    res.sendfile(__dirname + '/views/scene5.html');
});


var server = http.createServer(app);
var io = require('socket.io').listen(server, { log : false});

server.listen(app.get('port'));

var rooms = [];

function room(roomSocket, roomId){
  this.roomSocket = roomSocket;
  this.roomId = roomId;
  this.mobileSockets = [];
};


io.sockets.on('connection', function (socket) {
socket.on("new room", function(data){
    rooms.push(new room(socket, data.room));
    console.log
  });

  socket.on("connect mobile", function(data, fn){
    var desktopRoom = null;
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].roomId == data.room){
        desktopRoom = i;
      }
      
    }
    if(desktopRoom !== null){
      rooms[desktopRoom].mobileSockets.push(socket);
      console.log(desktopRoom, socket);
      socket.set('roomi', desktopRoom, function(){}) 
      fn({registered: true});
      rooms[socket.store.data.roomi].roomSocket.emit('add user', socket.id, data, socket.store.data.roomi);
      socket.emit('mobile_sync', { msg: 'Synchronised' });
      
    }else{
      fn({registered: false, error: "No live desktop connection found"});
      socket.emit('mobile_sync', { msg: 'Mauvais code' });
    } 
  });

  //Update the position
  
  socket.on("update movement", function(data){
    if(typeof socket.store.data.roomi !== 'undefined'){
      if(typeof rooms[socket.store.data.roomi] !== 'undefined'){
        rooms[socket.store.data.roomi].roomSocket.emit('update position', socket.id, data);
      }
    }
  });
  
   socket.on("SetLightOn", function(data){
    if(typeof socket.store.data.roomi !== 'undefined'){
      if(typeof rooms[socket.store.data.roomi] !== 'undefined'){
        rooms[socket.store.data.roomi].roomSocket.emit('TurnLightOn', data);
      }
    }
  });

  //Send question on mobile

  socket.on("afficherQuestion", function(data){
        rooms[data.userNumber].mobileSockets[0].emit('showQuestion', data);
  });

  //When a user disconnects
  socket.on("disconnect", function(){
    var destroyThis = null;

    if(typeof socket.store.data.roomi == 'undefined'){
      for(var i in rooms){
        if(rooms[i].roomSocket.id == socket.id){
          destroyThis = rooms[i];
        }
      }
      if(destroyThis !== null){rooms.splice(destroyThis, 1);}
    }else{
      var roomId = socket.store.data.roomi;
      for(var i in rooms[roomId].mobileSockets){
        if(rooms[roomId].mobileSockets[i] == socket){
          destroyThis = i;
        }
      }
      if(destroyThis !== null){rooms[roomId].mobileSockets.splice(destroyThis, 1);}
      rooms[roomId].roomSocket.emit('remove user', socket.id);
    }
  });

});