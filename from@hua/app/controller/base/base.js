'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const exec = require('child_process').exec;
const yaml = require('../../helper/yaml');
const appConfigFilePath = path.resolve(__dirname, '../../../config/app.yml');
const user = yaml.read(appConfigFilePath).user;

class BaseController extends Controller {
  async whoConnect() {
    const { ctx } = this;
    const result = await this.connect();

    if (result !== 'none') {
      ctx.body = JSON.stringify({
        ip: result,
        name: user[result],
      });
    } else {
      ctx.body = JSON.stringify({
        ip: null,
        name: null,
      });
    }

  }

  connect() {
    const { config } = this;
    return new Promise((resolve, reject) => {
      const bat = path.resolve(__dirname, '../../../bin/netstat.bat');
      exec(bat, (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }
        const a = stdout.split(/TCP|UDP/g);
        let str = '';
        for (const v of a) {
          /* eslint-disable no-bitwise */
          if (~v.indexOf(`${config.serverIp}:3389`)) {
            str = v.replace(`${config.serverIp}:3389`, '')
              .trim()
              .split(':')
              .slice(0, 1)[0];
            break;
          }
        }
        if (str) {
          resolve(str);
        }
        resolve('none');
      });
    });
  }
}

module.exports = BaseController;
