'use strict';

const ERROR_TYPE = {
  DIY: '000',
  WINDOW: '001',
  HTTP: '002',
  XHR: '003',
  VUE: '004',
  PROMISE: '005',
};

const REQUEST_RESULT = {
  SUCCESS: 'success',
  FAIL: 'fail',
};

module.exports = {
  ERROR_TYPE,
  REQUEST_RESULT,
};
