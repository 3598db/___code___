'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SentryStoreSchema = new Schema({
    name: { type: String },
    desc: { type: String },
    create_at: { type: Date, default: Date.now },
  });

  return mongoose.model('SentryStore', SentryStoreSchema);
};