'use strict';

const path = require('path');
const express = require('express');
const http = require('http');
const app = express();

// client와 server에서 socket.io로 연결할 때 포트를 맞춰줘야 한다.
app.set('port', 8081)
// .listen(8082, () => { console.log('server start!'); });

const server = http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '..', 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

const Room = new require('./room');
const rooms = new Room();

io.on('connection', socket => {
  
  socket.on('message', (msg) => { 
    console.log(msg);
    socket.broadcast.emit('broadcast', msg);
  });
  
  socket.on('createRoom', (room) => {
    
    console.log(room);
    console.log(rooms.hasRoom(room.title));
    if(rooms.hasRoom(room.title)) {
      // 방이 존재한다는 메시지 보내기
      io.to(room.id).emit('failed create room', 'already exist room');
      return;
    }

    rooms.addRoom(room);

    socket.join(room.title, () => {
      io.to(room.title).emit('success create room');
    });
    
  });

  socket.on('disconnect', () => { 
    // socket.broadcast.emit('disconnect', 'ㅎㅇ');
    io.emit('disconnect', socket.id);
    console.log('user disconnected');
  });
});