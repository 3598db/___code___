'use strict';

module.exports = app => {
  // const baseRouter = app.router.namespace('/user');

  // baseRouter.post('/register', app.controller.base.user.register);
  // baseRouter.post('/login', app.controller.base.user.login);
  // baseRouter.get('/logout', app.controller.base.user.logout);
  // baseRouter.get('/all', app.controller.base.user.getUsersList);

  const baseRouter = app.router.namespace('/base');
  baseRouter.get('/whoConnect', app.controller.base.base.whoConnect);

};
