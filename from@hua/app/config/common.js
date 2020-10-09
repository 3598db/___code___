'use strict';
const process = require('child_process');
const fs = require('fs');
const dbpath = 'E:/MongoDB/data/mongodb-bak-daily';
const commonFun = {
  setTime: startDate => {
    process.exec(`db.bat ${startDate}`, { cwd: 'E:/MongoDB/bin/' }, err => {
      if (err) {
        console.log(err);
        return;
      }
      commonFun.deleteFiles(commonFun.getFileList(), dbpath);
      console.log('�������ݿ�ɹ�');
    });
  },
  getFileList: () => {
    const files = fs.readdirSync(dbpath);
    const times = files.map(item => {
      return Date.parse(item.replace(/-/g, '/'));
    });
    const allFiles = times.sort();
    if (allFiles.length > 7) {
      const deleteFilestime = allFiles.splice(0, allFiles.length - 7);// ɾ�������7����ı���
      const deleteFiles = deleteFilestime.map(item => {
        return new Date(item).toLocaleDateString();
      });
      return deleteFiles;
    }
    return null;
  },
  deleteFiles: (list, path) => {
    if (!list) return;
    if (fs.existsSync(path) && list.length > 0) {
      list.forEach(item => {
        console.log(item);
        const currentpath = `${path}/${item}`;
        if (fs.statSync(currentpath).isDirectory()) {
          commonFun.deleteFiles(fs.readdirSync(currentpath), currentpath);
        } else {
          fs.unlinkSync(currentpath);
        }
      });

    }
    if (fs.existsSync(path) && list.length === 0) {
      fs.rmdirSync(path);
    }
  },
};

module.exports = {
  setTime: commonFun.setTime,
};