'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  getUserByLoginName(loginName) {
    return this.ctx.model.Base.User.findOne({
      name: loginName,
    }).exec();
  }

  getUserByName(username) {
    return this.ctx.model.Base.User.findOne({ username }).exec();
  }

  getUserByNameAndKey({ username, password }) {
    return this.ctx.model.Base.User.findOne({ username, password }).exec();
  }

  getUserById(uid) {
    return this.ctx.model.Base.User.findOne({ _id: uid }).exec();
  }

  getAllUsers() {
    return this.ctx.model.Base.User.find({}).exec();
  }

  addUser({ username, password, mail }) {
    const user = new this.ctx.model.Base.User();

    user.username = username;
    user.password = password;
    user.mail = mail;

    return user.save();
  }

}

module.exports = UserService;
