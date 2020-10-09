'use strict';

const Controller = require('egg').Controller;
const dict = require('../../helper/dictionary.js');

class RecordController extends Controller {

  async saveErrorRecord() {
    const responseData = {};
    const { ctx, service } = this;
    const req = ctx.request;
    const query = ctx.query;
    const list = JSON.parse(query._ || '[]');
    const ipRegexp = /^http(s)?:\/\/([\d\w\.]+)/;
    const _clientIpFragment = req.ip.split(':');
    const storeId = list[0] && list[0].apikey || '';
    const store = await service.sentry.store.getStoreById(storeId);

    if (!store) {
      responseData.code = 520;
      responseData.message = 'apikey������ ����ϵ����Ա����';

      ctx.body = responseData;
      return;
    }

    list.forEach(item => {
      const {
        apikey, url, title, type, version, userAgent, metaData,
        message = '',
        stack = {},
        colno = 0,
        lineno = 0,
        path = '',
        target = '',
        resourceUrl = '',
        outerHTML = '',
        method = '',
        status = '200',
        response = '',
        requestUrl = '',
        vueMessage = {},
        lifecycleHook = '',
        componentName = '',
      } = item;

      const matches = ipRegexp.exec(url);
      const serverIp = matches[2] || 'No matches';
      const clientIp = _clientIpFragment[_clientIpFragment.length - 1];

      this.errorHandler({
        serverIp,
        clientIp,
        apikey,
        title,
        url,
        type,
        version,
        userAgent,
        metaData,
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
        componentName,
      });
    });

    ctx.body = '';
  }

  errorHandler(record) {
    switch (record.type) {
      case dict.ERROR_TYPE.DIY:
        return this.polymerize(record, () => false);
      case dict.ERROR_TYPE.HTTP:
        return this.polymerize(record, item => {
          if (record.resource_url === item.resource_url) {
            return true;
          }
          return false;
        });
      case dict.ERROR_TYPE.PROMISE:
        return this.polymerize(record, item => {
          if (record.reason === item.reason) {
            return true;
          }
          return false;
        });
      case dict.ERROR_TYPE.VUE:
        return this.polymerize(record, item => {
          if (record.vue_message.message === item.vue_message.message
          && record.lifecycle_hook === item.lifecycle_hook
          && record.component_name === item.component_name) {
            return true;
          }
          return false;
        });
      case dict.ERROR_TYPE.WINDOW:
        return this.polymerize(record, item => {
          if (record.message === item.message
          && record.colno === item.colno
          && record.lineno === item.lineno) {
            return true;
          }
          return false;
        });
      case dict.ERROR_TYPE.XHR:
        return this.polymerize(record, item => {
          if (record.method === item.method
          && record.status === item.status
          && record.request_url === item.request_url) {
            return true;
          }
          return false;
        });
      default:
        break;
    }
  }

  async polymerize(record, validate) {
    const { service } = this;
    const responseData = {};

    const records = await service.sentry.record.getRecordsByCategory(record.type);

    let flag = false;
    if (records && records.length) {
      for (let i = 0; i < records.length; i++) {
        if (validate.call(this, records[i])) {
          /* eslint-disable no-loop-func */
          service.sentry.record.getRecordDetail(records[i]._id, (err, item) => {
            if (err) {
              responseData.code = 520;
              responseData.message = err;
            } else {
              item.occurrence_times.push({
                time: Date.now(),
                client_ip: record.client_ip,
              });
              item.createTime = Date.now();
              item.save();

              responseData.code = 200;
              responseData.message = '����ɹ�';
            }
          });

          flag = true;
          break;
        }
      }

      if (!flag) {
        this.saveRecord(record, err => {
          if (err) {
            responseData.code = 520;
            responseData.message = err;
          } else {
            responseData.code = 200;
            responseData.message = '����ɹ�';
          }
        });
      }
    // �½�
    } else {
      record.occurrence_times = [{
        time: Date.now(),
        client_ip: record.client_ip,
      }];
      this.saveRecord(record, err => {
        if (err) {
          responseData.code = 520;
          responseData.message = err;
        } else {
          responseData.code = 200;
          responseData.message = '����ɹ�';
        }
      });
    }
  }

  saveRecord(record, callback) {
    const { service } = this;
    service.sentry.record.addRecord(record, callback);
  }

  async delErrorRecord() {
    const responseData = {};
    const { ctx, service } = this;
    const params = ctx.params;
    const recordId = params.record_id || '';

    const record = await service.sentry.record.delRecord(recordId);

    if (record && record.deletedCount) {
      responseData.code = 200;
      responseData.message = 'ɾ���ɹ�';
    } else {
      responseData.code = 520;
      responseData.message = 'ɾ��ʧ��';
    }

    ctx.body = responseData;
  }

  async getRecordsList() {
    const responseData = {};
    const searchParams = {};
    const { ctx, service } = this;
    const req = ctx.request;
    // apikey ����
    searchParams.apikey = req.query.apikey || '';
    req.query.clientIp ? searchParams.ip = req.query.clientIp : null;
    req.query.serverIp ? searchParams.url = new RegExp(req.query.serverIp) : null;
    const limit = Number(req.query.pageSize || 10);
    let page = Number(req.query.page || 1);
    let pages = 0;

    const recordsCount = await service.sentry.record.getRecordsCount(searchParams);

    pages = Math.ceil(recordsCount / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);

    const skip = (page - 1) * limit;

    const records = await service.sentry.record.getRecordsList({ limit, skip, searchParams });

    if (records) {
      responseData.code = '200';
      responseData.result = records;
    } else {
      responseData.code = '520';
      responseData.result = [];
    }

    ctx.body = responseData;
  }

  async updateRecordStat() {
    const responseData = {};
    const { ctx, service } = this;
    const params = ctx.params;
    const req = ctx.request;
    const id = params.record_id || '';
    const stat = Number(req.body.stat);

    const record = await service.sentry.record.updateRecordStat({ id, stat });

    if (record) {
      responseData.code = 200;
      responseData.message = '�޸ĳɹ�';
    } else {
      responseData.code = 520;
      responseData.message = 'ϵͳ��æ';
    }

    ctx.body = responseData;
  }

  async getIpDictionary() {
    const responseData = {};
    const { ctx, service } = this;
    const storeId = ctx.query.storeId;

    const allRecords = await service.sentry.record.getAllRecordsByApikey(storeId);

    if (allRecords) {
      const serverIpList = new Set();
      const clientIpList = new Set();
      allRecords && allRecords.forEach(item => {
        serverIpList.add(item.server_ip);

        if (item.occurrence_times && item.occurrence_times.length) {
          item.occurrence_times.forEach(timeInfo => {
            clientIpList.add(timeInfo.client_ip);
          });
        }
      });

      responseData.code = 200;
      responseData.result = {
        serverIpList: [ ...serverIpList ],
        clientIpList: [ ...clientIpList ],
      };
    }

    ctx.body = responseData;
  }
}

module.exports = RecordController;
