'use strict';

module.exports = app => {
  const storeRouter = app.router.namespace('/store');

  storeRouter.post('/save', app.controller.sentry.store.saveSentryStore);
  storeRouter.get('/search', app.controller.sentry.store.getSentryStoreList);
  storeRouter.get('/search/:user_id', app.controller.sentry.store.getStoreListByUser);
  storeRouter.post('/relate', app.controller.base.userStore.addRepertoryWithUser);
  storeRouter.delete('/relate/:relation_id', app.controller.base.userStore.delRepertoryWithUser);
  storeRouter.get('/relate', app.controller.base.userStore.searchRelationList);

};