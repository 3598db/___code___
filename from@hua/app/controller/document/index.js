'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mz-modules/mkdirp');
const pump = require('mz-modules/pump');
const unzip = require('unzip-gbk');
const fs = require('fs');
const fstream = require('fstream');
const rmrf = require('rmrf');
const random = require('string-random');
const findDown = require('finddown-sync');
const DICT = require('../../helper/dictionary');

class DocumentController extends Controller {

  // ����С��
  async addCategory() {
    const { ctx, service } = this;
    const responseData = {};
    const { topic, category } = ctx.request.body;
    const data = { topic, category };

    const categoryInDB = await service.document.index.getCategory(data);

    if (categoryInDB.length) {
      responseData.result = DICT.REQUEST_RESULT.FAIL;
      responseData.message = 'С���Ѵ���';
      ctx.body = responseData;
      return;
    }

    const info = await service.document.index.addCategory(data);

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = _.pick(info, [ 'id', 'topic', 'category' ]);

    ctx.body = responseData;
  }

  // ͨ�������ȡС��
  async getCategoryByTopic() {
    const { ctx, service } = this;
    const responseData = {};
    const { topic } = ctx.query;
    const data = { topic };

    let categoryList = await service.document.index.getCategory(data);

    categoryList = categoryList.map(category => {
      category.id = category._id;
      return _.pick(category, [ 'id', 'topic', 'category' ]);
    });

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = categoryList;
    ctx.body = responseData;
  }

  // �ϴ��ĵ�
  async uploadDocument() {
    const { ctx, service, config } = this;
    const { name, topic, category } = ctx.request.body;
    const responseData = {};
    const filenameReg = /(.+).zip$/;
    const file = ctx.request.files[0];
    const filename = file.filename.match(filenameReg)[1];
    const filepath = file.filepath;
    const randomKey = random(16);
    const target = path.resolve(config.staticResourcePath, randomKey);
    await mkdirp(target);
    const reader = fstream.Reader(filepath);
    const unz = unzip.Parse();
    const writer = fstream.Writer(target);
    reader.pipe(unz).pipe(writer);
    await new Promise(resolve => {
      writer.on('close', () => {
        resolve();
      });
    });

    const filePath = findDown('index.html', { cwd: target })[0];

    if (filePath) {
      await service.document.index.addDocument({
        dir: target,
        path: filePath,
        fileName: filename,
        name: name || filename,
        topic,
        category,
      });
      responseData.result = DICT.REQUEST_RESULT.SUCCESS;
      responseData.message = '�ϴ��ɹ�';
      ctx.body = responseData;
      return;
    }

    responseData.result = DICT.REQUEST_RESULT.FAIL;
    responseData.message = '�ĵ���û��index.html������';
    ctx.body = responseData;
  }

  // ��ȡ�ĵ���Ϣ
  async getDocument() {
    const { ctx, service, config } = this;
    const { topic, searchKey } = ctx.query;
    const responseData = {};
    const documents = await service.document.index.getDocument({
      topic,
      name: {
        $regex: (searchKey || '').toLowerCase(),
        $options: 'i',
      },
    });

    if (documents.length) {
      const result = [];
      const list = _.map(documents, item => {
        item.id = item._id.toString();
        item.date = item.date.toLocaleString();
        item.fileName = item.file_name;
        item.path = config.documentService + 'static/' + item.path.substr(config.staticResourcePath.length);
        return _.pick(item, [ 'id', 'category', 'date', 'fileName', 'name', 'topic', 'path' ]);
      });
      const group = _.groupBy(list, 'category');
      for (const key in group) {
        result.push({
          category: key,
          documents: group[key],
        });
      }

      responseData.result = DICT.REQUEST_RESULT.SUCCESS;
      responseData.data = result;
      ctx.body = responseData;
      return;
    }

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = [];
    ctx.body = responseData;
  }

  // �����ĵ���Ϣ
  async updateDocument() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const responseData = {};
    const id = body.id;
    const data = _.pick(body, [ 'name', 'topic', 'category' ]);

    await service.document.index.updateDocument({ id, data });

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.message = '���³ɹ�';
    ctx.body = responseData;
  }

  // ɾ���ĵ�
  async deleteDocument() {
    const { ctx, service } = this;
    const responseData = {};
    const id = ctx.params.document_id;
    const document = await service.document.index.getDocumentById(id);

    if (document) {
      await rmrf(document.dir);
      await service.document.index.deleteDocument(id);
      responseData.result = DICT.REQUEST_RESULT.SUCCESS;
      responseData.message = '���³ɹ�';
      ctx.body = responseData;
      return;
    }

    responseData.result = DICT.REQUEST_RESULT.FAIL;
    responseData.message = '�ĵ��Ѿ������ڣ���ˢ��ҳ��';
    ctx.body = responseData;
  }

  // ͼ���ϴ�ͼƬ
  async uploadPicture() {
    const { ctx, config } = this;
    const responseData = {};
    const file = ctx.request.files[0];
    const filepath = file.filepath;
    const filename = file.filename;
    const ext = path.extname(filename);
    const reader = fs.createReadStream(filepath);
    const target = path.join(config.pictureResourcePath, random(16) + ext);
    const writer = fs.createWriteStream(target);

    await pump(reader, writer);

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = config.documentService + 'image/' + target.substr(config.pictureResourcePath.length);
    ctx.body = responseData;
  }

  // ͼ��ͼƬ��ѯ
  async findPicture() {
    const { ctx, config, service } = this;
    const responseData = {};
    const data = await service.document.index.getAllImg(config.pictureResourcePath, config.documentService, ctx);

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = {};
    responseData.data.data = data;
    ctx.body = responseData;
  }

  // ͼ��ͼƬɾ��
  async deletePicture() {
    const { ctx, config, service } = this;
    const responseData = {};
    await service.document.index.deleteimgByName(config.pictureResourcePath, ctx);

    responseData.result = DICT.REQUEST_RESULT.SUCCESS;
    responseData.data = {};
    ctx.body = responseData;
  }
}

module.exports = DocumentController;
