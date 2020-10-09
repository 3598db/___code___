'use strict';

const Service = require('egg').Service;

class StoreService extends Service {

  addStore({ storeName, storeDesc }) {
    const store = new this.ctx.model.Sentry.Store();

    store.name = storeName;
    store.desc = storeDesc;

    return store.save();
  }

  getStoreList() {
    return this.ctx.model.Sentry.Store.find({}).exec();
  }

  updateStore({ storeId, storeName, storeDesc }) {
    return this.ctx.model.Sentry.Store.update({ _id: storeId }, { name: storeName, desc: storeDesc }).exec();
  }

  delStore(storeId) {
    return this.ctx.model.Sentry.Store.remove({ _id: storeId }).exec();
  }

  getStoreById(storeId) {
    return this.ctx.model.Sentry.Store.findOne({ _id: storeId }).exec();
  }

  addStoreWithUser({ userId, storeId }) {
    const userStore = new this.ctx.model.Base.UserStore();

    userStore.user_id = userId;
    userStore.store_id = storeId;
    userStore.store = storeId;

    return userStore.save();
  }

  findStoreWithUser({ userId, storeId }) {
    return this.ctx.model.Base.UserStore.find({ user_id: userId, store_id: storeId }).exec();
  }

  delStoreWithUser(id) {
    return this.ctx.model.Base.UserStore.remove({ _id: id }).exec();
  }

  searchRelationList({ limit, skip, searchParams }) {
    return this.ctx.model.Base.UserStore.find({ ...searchParams }).limit(limit).skip(skip)
      .populate('SentryStore')
      .sort('-create_at')
      .exec();
  }

  getRelationCount(searchParams) {
    return this.ctx.model.Base.UserStore.find({ ...searchParams }).count().exec();
  }

  getStoreByUser(searchParams) {
    return this.ctx.model.Base.UserStore.find({ ...searchParams }).populate('SentryStore').sort('-create_at')
      .exec();
  }

}

module.exports = StoreService;

