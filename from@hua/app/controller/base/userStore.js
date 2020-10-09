'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class UserStoreController extends Controller {

  async addRepertoryWithUser() {
    const responseData = {};
    const { ctx, service } = this;
    const req = ctx.request;

    const userId = req.body.userId;
    const storeId = req.body.storeId;

    const has = await service.sentry.store.findStoreWithUser({ userId, storeId });

    if (has && has.length) {
      responseData.code = 520;
      responseData.message = '�û���ӵ�иòֿ�Ȩ��';

      ctx.body = responseData;
      return;
    }

    const userStore = await service.sentry.store.addStoreWithUser({ userId, storeId });

    if (userStore) {
      responseData.code = 200;
      responseData.message = '����ɹ�';
    } else {
      responseData.code = 520;
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }

  async delRepertoryWithUser() {
    const responseData = {};
    const { ctx, service } = this;
    const params = ctx.params;
    const id = params.relation_id || '';

    const userStore = await service.sentry.store.delStoreWithUser(id);

    if (userStore && userStore.deletedCount) {
      responseData.code = 200;
      responseData.message = 'ɾ���ɹ�';
    } else {
      responseData.code = 520;
      responseData.message = 'ɾ��ʧ��';
    }

    ctx.body = responseData;
  }

  async searchRelationList() {
    const responseData = {};
    const { ctx, service } = this;
    const searchParams = {};
    const req = ctx.request;
    req.query.userId ? searchParams.user_id = req.query.userId : '';
    const limit = Number(req.query.pageSize || 10);
    let page = Number(req.query.page || 1);
    let pages = 0;

    const count = await service.sentry.store.getRelationCount(searchParams);

    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);

    const skip = (page - 1) * limit;

    let list = await service.sentry.store.searchRelationList({ limit, skip, searchParams });

    list = list.map(item => {
      item.id = item._id;
      item.name = item._id;
      return _.pick(item, [ 'id', 'name', 'desc' ]);
    });

    if (list) {
      responseData.code = '200';
      responseData.result = [ ...list ];
    } else {
      responseData.code = '520';
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }
}

module.exports = UserStoreController;
