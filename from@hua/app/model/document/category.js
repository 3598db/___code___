'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const DocumentCategory = new Schema({
    topic: { type: String },
    category: { type: String },
  });
  return mongoose.model('DocumentCategory', DocumentCategory);
};