'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const DocumentCollection = new Schema({
    name: { type: String },
    file_name: { type: String },
    topic: { type: String },
    category: { type: String },
    date: { type: Date, default: Date.now },
    path: { type: String },
    dir: { type: String },
  });
  return mongoose.model('DocumentCollection', DocumentCollection);
};