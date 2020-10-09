'use strict';


let timeInterval = null;
const common = require('./common');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   */
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552922883164_877';

  // add your middleware config here
  config.middleware = [];

  // mongoose
  config.mongoose = {
    url: 'mongodb://10.35.93.100:27017/vServer',
    options: {
      poolSize: 20,
      reconnectTries: 10,
      reconnectInterval: 500,
    },
  };

  // security
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // upload plugin
  config.multipart = {
    mode: 'file',
    fileSize: '500mb',
  };

  // add your user config here
  const userConfig = {
    // dev
    // staticResourcePath: 'D:/source/document/static/',
    // pictureResourcePath: 'D:/source/document/image/',
    // prod
    staticResourcePath: 'F:/source/document/static/',
    pictureResourcePath: 'F:/source/document/image/',
    // dev
    // documentService: 'http://10.33.68.25:801/',
    // prod
    documentService: 'http://10.35.93.100:801/',
  };

  // hexo config
  const hexo = {
    configPath: '',
  };

  // ��ʱ����ű� ��������
  const startDate = new Date().toLocaleDateString();
  const copyDate = Date.parse(startDate.replace(/-/g, '/')) + 60 * 60 * 24 * 1000;
  if (!timeInterval) {
    timeInterval = setInterval(() => {
      let nowDate = Date.parse(new Date());
      if (copyDate < nowDate) {
        clearTimeout(timeInterval);
        common.setTime(startDate);
        setInterval(() => {
          nowDate = new Date().toLocaleDateString();
          common.setTime(nowDate);
        }, 86400000);
      }
    }, 1000);
  }


  return {
    ...config,
    ...userConfig,
    ...hexo,
  };
};