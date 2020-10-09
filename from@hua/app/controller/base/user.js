
'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class UserController extends Controller {

  async register() {
    const { ctx, service } = this;
    const responseData = {};
    const req = ctx.request;
    const username = req.body.username;
    const password = req.body.password;
    const mail = req.body.mail;

    const user = await service.base.user.getUserByName(username);

    if (!user) {
      await service.base.user.addUser({ username, password, mail });
      responseData.code = 200;
      responseData.message = 'ע��ɹ�';
    } else {
      responseData.code = 520;
      responseData.message = '�˻��Ѵ���';
    }

    ctx.body = responseData;
  }

  async login() {
    const { ctx, service } = this;
    const responseData = {};
    const req = ctx.request;
    const username = req.body.username;
    const password = req.body.password;

    const user = await service.base.user.getUserByNameAndKey({ username, password });

    if (!user) {
      responseData.code = 520;
      responseData.message = '�û������������';
    } else {
      responseData.code = 200;
      responseData.message = '��¼�ɹ�';
      responseData.user = {
        userid: user._id,
        username: user.username,
      };
    }

    ctx.body = responseData;
  }

  logout() {
    const { ctx } = this;
    const responseData = {
      code: 200,
      message: '�ǳ��ɹ�',
    };
    ctx.body = responseData;
  }

  async getUsersList() {
    const responseData = {};
    const { ctx, service } = this;
    let users = await service.base.user.getAllUsers();

    users = users.map(user => {
      user.id = user._id;
      return _.pick(user, [ 'id', 'username', 'mail' ]);
    });

    responseData.code = 200;
    responseData.result = users;
    ctx.body = responseData;
  }

}

module.exports = UserController;
