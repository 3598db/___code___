'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  const UserStoreSchema = new Schema({
    store_id: { type: ObjectId },
    user_id: { type: ObjectId },
    create_at: { type: Date, default: Date.now },
    store: { type: Schema.Types.ObjectId, ref: 'SentryStore' },
  });

  return mongoose.model('UserStore', UserStoreSchema);
};
