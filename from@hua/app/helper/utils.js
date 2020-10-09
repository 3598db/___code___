'use strict';

function format(val) {
  return String(val).padStart(2, '0');
}

function getNowTime() {
  const date = new Date();
  const dataStr = `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
  const timeStr = `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`;
  return `${dataStr} ${timeStr}`;
}

module.exports = {
  getNowTime, // ��ȡ��ǰʱ�䣨yyyy-mm-dd hh:mm:ss)
};

// D:\_S_\app\helper\yaml.js
'use strict';

const fs = require('fs');
const yaml = require('yamljs');

function read(file) {
  return yaml.parse(fs.readFileSync(file).toString());
}

function write(file, data) {
  return new Promise(resolve => {
    const yamlString = yaml.stringify(data);
    fs.writeFile(file, yamlString, err => {
      resolve(err);
    });
  });
}

function parse(string) {
  return yaml.parse(string);
}

function stringify(object) {
  return yaml.stringify(object);
}

module.exports = {
  read,
  write,
  parse,
  stringify,
};
