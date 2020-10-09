/* eslint-disable no-new */

// @author gong_mingzhi
// @update 19-09-12

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const child_process = require('child_process');
const svgRootPath = path.resolve(__dirname, '../src/common/_os_Img/svg');
const svgResourcePath = path.resolve(__dirname, '../src/common/_os_Img/svg/resource');
const demoOutputPath = path.resolve(__dirname, '../src/components/consoleComponets/BaseComponent');
const log = console.log;

new Promise((resolve) => {
  child_process.exec(`cd ${svgRootPath} & python svg.py`, (err) => {
    if (err) {
      throw err;
    }
    log(`${chalk.green('[Log]')}: SVG ICONS���ɳɹ���`);
    resolve();
  });
}).then(() => {
  return new Promise((resolve) => {
    fs.readdir(svgResourcePath, 'utf8', (readError, icons) => {
      if (readError) {
        throw readError;
      }

      let iconNikeNames = [];
      const regExp = /^svgIcon_smb_([a-zA-Z0-9_-]+).svg$/;

      if (icons.length) {
        icons.map((name) => {
          const [fullName, nikeName] = name.match(regExp);

          if (fullName && nikeName) {
            iconNikeNames.push({
              desc: nikeName.replace('-', ' '),
              name: nikeName
            });
          }

        });
      } else {
        log(`${chalk.yellow('[Warning]')}: δ��ȡ��SVGͼ�ꡣ`);
      }
      resolve(iconNikeNames);
    });
  });
}).then((iconNikeNames) => {
  fs.writeFile(`${demoOutputPath}/icons.js`,
    `export const icons = ${JSON.stringify(iconNikeNames)}`,
    (writeError) => {
      if (writeError) {
        throw writeError;
      }

      log(`${chalk.green('[Log]')}: icons.js�ļ�����ɹ���`);
    }
  );
}).catch((err) => {
  log(`${chalk.red('[Error]')}: ${err}`);
});
