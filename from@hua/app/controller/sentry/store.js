'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class StoreController extends Controller {

  async saveSentryStore() {
    const responseData = {};
    const { ctx, service } = this;
    const req = ctx.request;
    const storeName = req.body.storeName;
    const storeDesc = req.body.storeDesc || '';

    const store = await service.sentry.store.addStore({ storeName, storeDesc });

    if (store) {
      responseData.code = 200;
      responseData.message = '����ɹ�';
    } else {
      responseData.code = 520;
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }

  async getSentryStoreList() {
    const responseData = {};
    const { ctx, service } = this;

    let stores = await service.sentry.store.getStoreList();

    if (stores) {
      stores = stores.map(store => {
        return _.pick(store, [ 'id', 'name', 'desc' ]);
      });
      responseData.code = 200;
      responseData.result = stores;
    } else {
      responseData.code = 520;
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }

  async getStoreListByUser() {
    const responseData = {};
    const { ctx, service } = this;
    const params = ctx.params;
    const userId = params.user_id || '';

    let stores = await service.sentry.store.getStoreByUser({ user_id: userId });

    if (stores) {
      stores = stores.map(store => {
        return _.pick(store, [ 'id', 'name', 'desc' ]);
      });
      responseData.code = 200;
      responseData.result = stores;
    } else {
      responseData.code = 520;
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }

}

module.exports = StoreController;
