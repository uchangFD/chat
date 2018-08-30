'use strict';

const rooms = require('./room.js');
const users = require('./users.js');

module.exports = function(io, socket) {

  // 유저 입장.
  socket.on('user connect', (username, id) => {
    // console.log('id: ', id);
    // if(users.hasUser(id)) {

    //   const userInfo = users.getUser(id);

    //   if(userInfo.username !== username) {

    //     userInfo.username = username;
    //     users.updateUser(userInfo);
    //   }

    //   return;
    // }
    // 나인지 어떻게 알지? => uid 값으로
    socket.username = username;
    socket.uid = id;
    
    users.addUser({ id, username });

    io.to(socket.uid).emit('nickname', socket.username);
  });

  // 방 리스트
  io.sockets.emit('init room', rooms.getRoomList());

  // 방생성
  socket.on('createRoom', (room) => {

    if(rooms.hasRoom(room)) {
      console.log('분기 됨?')
      io.to(socket.uid).emit('can not create room', 'Already exist room');
      return;
    }

    const username = socket.username;

    // 소켓 세션에 사용자 정보 등록
    socket.room = room;

    socket.join(room);
    socket.emit('update chat', 'SERVER', room + '방에 연결되었습니다.');
    socket.emit('success create room', room);
    socket.broadcast.to(room).emit('update chat', 'SERVER', username + '님이 참가하였습니다.');


    rooms.addRoom({ room, username });
  });

  // 유저 참가
  socket.on('join', (room, username, isJoin) => {
    
    if(!isJoin) {
      return;
    }

    socket.room = room;
    socket.username = username;

    socket.join(room);
    socket.emit('update chat', 'SERVER', room + '방에 연결되었습니다.');
    socket.broadcast.to(room).emit('update chat', 'SERVER', username + '님이 입장하셨습니다.');

  });
  
  // 메시지 보내기
  socket.on('message', (data) => {
    
    io.sockets.in(socket.room).emit('message', socket.username, data);  
  });

  // 메시지 브로드캐스팅

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

    rooms.removeRoom(room);
    // 모든 소켓 세션에 이미터를 작동
    io.sockets.emit('update user', username);
    socket.broadcast.emit('update chat', 'SERVER', socket.username + '님이 연결을 끊으셨습니다.');
    socket.leave(room);
  });

};