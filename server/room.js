'use strict';

class Room {

  constructor() {
    this.rooms = [];
  }

  hasRoom(room) {
    return !!this.rooms.find(_room => {
      return _room.room === room;
    })
  }

  addRoom(roomInfo) {

    if(this.hasRoom(roomInfo.room)) {
      return false;
    }

    this.rooms.push(roomInfo);

    return true;
  }

  updateRoom(room, updateInfo) {
    
    if(!this.hasRoom(room)) {
      return false;
    }

    this.rooms = this.rooms.map(_room => {
      
      if(_room.room === room) {
        return Object.assign(_room, updateInfo);
      }

      return _room;
    });

    return true;
  }

  removeRoom(room) {

    if(!this.hasRoom(room)) {
      return false;
    }

    this.rooms = this.rooms.filter(_room => { _room.room !== room });

    return true;
  }

  getRoomList() {
    return this.rooms.map(_room => _room.room);
  }
}

const rooms = new Room();

module.exports = rooms;