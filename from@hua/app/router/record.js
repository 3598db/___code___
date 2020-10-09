'use strict';

// sentry ·��ӳ��
module.exports = app => {
  const recordRouter = app.router.namespace('/record');

  recordRouter.get('/save', app.controller.sentry.record.saveErrorRecord);
  recordRouter.get('/search', app.controller.sentry.record.getRecordsList);
  recordRouter.put('/:record_id', app.controller.sentry.record.updateRecordStat);
  recordRouter.get('/dictionary', app.controller.sentry.record.getIpDictionary);
  recordRouter.delete('/:record_id', app.controller.sentry.record.delErrorRecord);

};

