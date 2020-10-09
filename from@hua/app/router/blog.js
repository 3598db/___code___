'use strict';

// user ·��ӳ��
module.exports = app => {
  const blogRouter = app.router.namespace('/blog');

  blogRouter.get('/list', app.controller.blog.api.getArticleList);
  blogRouter.post('/delete', app.controller.blog.api.deleteArticleByName);
  blogRouter.get('/config', app.controller.blog.api.getConfig);
  blogRouter.put('/config', app.controller.blog.api.saveConfigFile);
  blogRouter.post('/article', app.controller.blog.api.saveArticle);
  blogRouter.get('/build', app.controller.blog.api.build);

};