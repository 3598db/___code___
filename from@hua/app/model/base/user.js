'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    mail: { type: String },
    is_admin: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
  });

  return mongoose.model('User', UserSchema);
};
