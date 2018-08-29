'use strict';

module.exports = class Room {

  constructor() {
    this.rooms = [];
  }

  hasRoom(title) {
    return !!this.rooms.find(_room => {
      return _room.title === title;
    })
  }

  addRoom(room) {

    if(this.hasRoom(room.title)) {
      return false;
    }

    this.rooms.push(room);

    return true;
  }

  updateRoom(room, updateInfo) {
    
    if(!this.hasRoom(room.title)) {
      return false;
    }

    this.rooms = this.rooms.map(_room => {
      
      if(_room === room) {
        return Object.assign(_room, room);
      }

      return _room;
    })

    return true;
  }

  deleteRoom(room) {

    if(!this.hasRoom(room)) {
      return false;
    }

    this.rooms = this.rooms.filter(_room => { _room.title !== room.title });

    return true;
  }
}