'use strict';

// hexo ��ص� api

const path = require('path');
const fs = require('fs');
// const exec = require('child_process').exec

const yaml = require('../yaml');
const utils = require('../utils');
const compile = require('../utils/compile');

// ��ȡ�����ļ�
const configPath = path.join(__dirname, '../../config/app.yml');
let config = yaml.read(configPath);

/**
 * ����tags��ʽ
 * @param {string} tagString ���ŷָ���tag
 * @return {string} ��׼hexo�ĵ���tags��ʽ
 */
function formatTags(tagString) {
  if (typeof tagString !== 'string') {
    return '';
  }
  const tagList = tagString.split(/[,��]/g);
  // tagList�ǳ��ȴ���0������
  if (!(Array.isArray(tagList) && tagList.length > 0)) {
    return '';
  }
  let newTags = 'tags: ';
  if (tagList.length === 1) {
    newTags += tagList[0];
  } else {
    tagList.forEach(tag => {
      newTags += newTags === 'tags: ' ? `[${tag}` : `, ${tag}`;
    });
    newTags += ']';
  }
  return newTags;
}

module.exports = function(router) {
  // ��ȡ config �����ļ���Ϣ( config/app.yml )
  router.get('/api/config/get', async ctx => {
    ctx.body = {
      code: 0,
      data: config,
    };
  });

  router.post('/api/config/save', async ctx => {
    const body = ctx.request.body;
    const source = body.source;
    const categories = body.categories;
    const tags = body.tags;
    const authors = body.authors;
    if (!source || !categories || !tags) {
      ctx.status = 400;
      ctx.body = '����Ĳ�����ʽ';
      return;
    }

    const hexo = {
      source,
      categories,
      tags,
      authors,
    };
    const newConfig = { ...config, ...{ hexo } };
    const err = await yaml.write(configPath, newConfig);

    if (err) {
      ctx.body = { code: 1, errMsg: '���������ļ�ʧ��' };
      return;
    }
    // ���µ�ǰ��config�ļ�
    config = yaml.read(configPath);

    ctx.body = { code: 0 };
  });

  // �ύ�ĵ�
  router.post('/api/submit', async ctx => {
    const body = ctx.request.body;
    const title = body.title; // ����
    const date = utils.getNowTime(); // ����ʱ��
    const categories = body.categories; // ����
    const content = body.content; // ����
    const tags = formatTags(body.tags); // ��ǩ
    const author = body.author; // ����

    // ������һ����ǩ
    if (tags === '') {
      ctx.status = 400;
      ctx.body = '����Ĳ�����ʽ';
      return;
    }

    // ת���ɱ�׼��hexo�ĵ���ʽ
    const markdown = `\
---
title: ${title}
author: ${author}
date: ${date}
categories: ${categories}
${tags}
---

${content}
`;

    const res = await new Promise(resolve => {
      const fileName = `./${title}.md`;
      const filePath = path.join(__dirname, fileName); // ���ɵ��ĵ�����

      fs.writeFile(filePath, markdown, () => {
        const sourceFile = path.join(__dirname, fileName);
        const targetFile = path.join(config.hexo.source, 'source/_posts', fileName);

        if (body.name) {
          const oldFilePath = path.join(config.hexo.source, 'source/_posts', `${body.name}.md`);
          fs.unlinkSync(oldFilePath, err => {
            if (err) {
              resolve({ code: 1, errMsg: 'ɾ��ԭhexo�ĵ�ʧ��' });
            }
          });
        }

        fs.rename(sourceFile, targetFile, async err => {
          if (err) {
            resolve({ code: 1, errMsg: '����hexo�ĵ�ʧ��' });
            return;
          }
          // ִ��hexo����
          const result = await compile();
          resolve(result);
        });
      });
    });

    if (res.code !== 0) {
      ctx.body = res.errMsg;
      return;
    }

    ctx.body = res;
  });
};
