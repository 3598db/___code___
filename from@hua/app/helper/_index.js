'use strict';

const path = require('path');
const os = require('os');
const exec = require('child_process').exec;
const yaml = require('./yaml');
const DICT = require('./dictionary');

const configPath = path.join(__dirname, '../../config/blog.yml');
const config = yaml.read(configPath);

function getRemoveDirCmd(listDir, dir) {
  const osType = os.type();
  let removeCmd = `cd ${listDir} && rm -rf`;
  if (osType === 'Windows_NT') {
    removeCmd = `cd /d ${listDir} && rd /s /q`;
  }

  return `${removeCmd} ${dir}`;
}

function compile() {
  return new Promise(resolve => {
    const buildHexo = 'hexo deploy --generate';
    exec(`${getRemoveDirCmd(config.source, 'public')} && ${buildHexo}`, err => {
      if (err) {
        resolve({
          result: DICT.REQUEST_RESULT.FAIL,
          message: `hexo�������ʧ�ܡ�ʧ��ԭ��${err}`,
        });
        return;
      }
      resolve({ result: DICT.REQUEST_RESULT.SUCCESS });
    });
  });
}

module.exports = compile;