'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  const ErrorRecordSchema = new Schema({
    apikey: { type: ObjectId },
    server_ip: { type: String },
    client_ip: String,
    title: { type: String },
    url: { type: String },
    type: { type: String },
    version: { type: String },
    user_agent: { type: String },
    message: { type: String },
    stack: { type: Object, default: {} },
    col_no: { type: Number, default: 0 },
    line_no: { type: Number, default: 0 },
    path: { type: String },
    target: { type: String },
    resource_url: { type: String },
    outer_html: { type: String },
    method: { type: String },
    status: { type: Number },
    response: { type: String },
    request_url: { type: String },
    vue_message: { type: Object, default: {} },
    lifecycle_hook: { type: String },
    component_name: { type: String },
    meta_data: { type: Object, default: {} },
    stat: { type: Number, default: 0 }, // ״̬ 0->�ѽ�� | -1->����� | 1->����� | 2->�ѽ��,
    createTime: { type: Date, default: Date.now },
    occurrence_times: { type: Array, default: [] },
  });

  return mongoose.model('ErrorRecord', ErrorRecordSchema);
};