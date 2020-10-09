'use strict';

const Service = require('egg').Service;

class RecordService extends Service {

  addRecord({
    apikey,
    serverIp,
    clientIp,
    title,
    url,
    type,
    version,
    userAgent,
    message,
    stack,
    colno,
    lineno,
    path,
    target,
    resourceUrl,
    outerHTML,
    method,
    status,
    response,
    requestUrl,
    vueMessage,
    lifecycleHook,
    component_name,
    metaData,
    occurrence_times,
  }) {
    const record = new this.ctx.model.Sentry.Record();
    record.apikey = apikey;
    record.server_ip = serverIp;
    record.client_ip = clientIp;
    record.title = title;
    record.url = url;
    record.type = type;
    record.version = version;
    record.user_agent = userAgent;
    record.message = message;
    record.stack = stack;
    record.col_no = colno;
    record.line_no = lineno;
    record.path = path;
    record.target = target;
    record.resource_url = resourceUrl;
    record.outer_html = outerHTML;
    record.method = method;
    record.status = status;
    record.response = response;
    record.request_url = requestUrl;
    record.vue_message = vueMessage;
    record.lifecycle_hook = lifecycleHook;
    record.component_name = component_name;
    record.meta_data = metaData;

    // �½�ʱ��ֱ�����һ����ʱ����������
    if (occurrence_times) {
      record.occurrence_times = occurrence_times;
    }

    return record.save();
  }

  getRecordDetail(id) {
    return this.ctx.model.Sentry.Record.findOne({ _id: id }).exec();
  }

  delRecord(id) {
    return this.ctx.model.Sentry.Record.remove({ _id: id }).exec();
  }

  getRecordsList({ limit, skip, searchParams }) {
    return this.ctx.model.Sentry.Record.find({ ...searchParams }).limit(limit).skip(skip)
      .sort('-create_at')
      .exec();
  }

  getRecordsCount(searchParams) {
    return this.ctx.model.Sentry.Record.find({ ...searchParams }).count().exec();
  }

  updateRecordStat({ id, stat }) {
    return this.ctx.model.Sentry.Record.update({ _id: id }, { stat }).exec();
  }

  getAllRecordsByApikey(apikey) {
    return this.ctx.model.Sentry.Record.find({ apikey }).exec();
  }

  getRecordsByCategory(category) {
    return this.ctx.model.Sentry.Record.find({ type: category }).exec();
  }

}

module.exports = RecordService;
