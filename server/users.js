'use strict';

class Users {
  
  constructor() {
    this.users = [];
  }

  getUser(id) {
    
    return this.users.find(user => user.id === id);
  }

  hasUser(id) {

    return !!this.getUser(id);
  }


  addUser(userInfo) {

    if(this.hasUser(userInfo.id)) {
      return false;
    }

    this.users.push(userInfo);

    return true;
  }

  removeUser(id) {
    
    if(!this.hasUser(id)) {
      return false;
    }

    this.users = this.users.filter(user => user.id !== id);

    return true;
  }

  updateUser(userInfo) {

    if(!this.hasUser(userInfo.id)) {
      return false;
    }

    this.users = this.users.map(user => user.id === userInfo.id && Object.assign(user, userInfo));

    return true;
  }

}

const users = new Users();

module.exports = users;