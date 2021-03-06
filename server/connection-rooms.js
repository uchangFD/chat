'use strict';

const rooms = require('./room.js');
const users = require('./users.js');

module.exports = function(io, socket) {
  
  io.of('/rooms').emit('getRoomList', rooms.getRoomList());
  
  // 유저 입장.
  socket.on('user connect', (username, id) => {
    
    socket.username = username;
    socket.uid = id;

    users.addUser({ id, username });

    io.of('/rooms').to(socket.uid).emit('nickname', username);
  });


  // 방생성
  socket.on('createRoom', (room) => {

    if(rooms.hasRoom(room)) {
      io.of('/rooms').to(socket.uid).emit('can not create room', 'Already exist room');
      return;
    }
    const username = socket.username;
    
    // 소켓 세션에 사용자 정보 등록
    socket.room = room;
    
    socket.join(room);
    io.of('/rooms').to(socket.uid).emit('toggle chat', false);

    rooms.addRoom({ room, username });
    
    io.of('/rooms').emit('getRoomList', rooms.getRoomList());
  });

  // 유저 참가
  socket.on('join', (room, username, isJoin) => {
    
    if(!isJoin) {
      return;
    }

    socket.room = room;
    socket.username = username;

    socket.join(room);
    io.of('/rooms').to(socket.uid).emit('toggle chat', false);

    socket.broadcast.to(room).emit('update chat', username + '님이 입장하셨습니다.');

  });
  
  // 메시지 보내기
  socket.on('message', (msg) => {
    
    socket.broadcast.to(socket.room).emit('message others', socket.username, msg);
    io.of('/rooms').to(socket.id).emit('message me', msg);
  });

  // 방 바꾸기
  socket.on('switchRoom', (newRoom) => {

    const prevRoom = socket.room;

    socket.leave(prevRoom);
    socket.join(newRoom);

    socket.emit('update chat', 'SERVER', newRoom + '방에 연결되었습니다.');
    socket.broadcast.to(prevRoom).emit('update chat', 'SERVER', socket.username + '님이 나가셨습니다.');
    rooms.removeRoom(prevRoom);

    socket.broadcast.to(newRoom).emit('update chat', 'SERVER', user.name + '님이 입장하셨습니다.');
    socket.room = newRoom;

    socket.emit('update room', rooms.getRoomList(), newRoom);

  });

  // 방 나가기

  // 연결을 끊을 때
  socket.on('disconnect', () => {
    
    const username = socket.username;
    const room = socket.room;

    // 모든 소켓 세션에 이미터를 작동
    io.sockets.emit('update user', username);
    socket.broadcast.to(socket.room).emit('message others', socket.username, '님이 연결을 끊으셨습니다. [Server]');
    rooms.removeRoom(room);
    socket.leave(room);
  });

};