'use strict';

// document ·��ӳ��
module.exports = app => {
  const documentRouter = app.router.namespace('/document');

  documentRouter.post('/category', app.controller.document.index.addCategory);
  documentRouter.get('/category', app.controller.document.index.getCategoryByTopic);
  documentRouter.post('/static', app.controller.document.index.uploadDocument);
  documentRouter.get('/static', app.controller.document.index.getDocument);
  documentRouter.put('/static', app.controller.document.index.updateDocument);
  documentRouter.delete('/static/:document_id', app.controller.document.index.deleteDocument);
  documentRouter.post('/picture', app.controller.document.index.uploadPicture);
  documentRouter.get('/picture/list', app.controller.document.index.findPicture);
  documentRouter.post('/picture/delete', app.controller.document.index.deletePicture);

};