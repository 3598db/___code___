'use strict';

const Service = require('egg').Service;
const fs = require('fs');

class DocumentService extends Service {

  // ����
  addCategory({ topic, category }) {
    const { ctx } = this;
    const model = new ctx.model.Document.Category();

    model.topic = topic;
    model.category = category;

    return model.save();
  }

  // ͨ�������С����С�����ƻ�ȡ����
  getCategory(data) {
    return this.ctx.model.Document.Category.find(data).exec();
  }

  // ͨ��С��id��ȡС��
  getCategoryById(id) {
    return this.ctx.model.Document.Category.findOne({
      _id: id,
    }).exec();
  }

  // �����ĵ���Ϣ
  addDocument({ name, fileName, topic, category, path, dir }) {
    const { ctx } = this;
    const model = new ctx.model.Document.Collection();

    model.name = name;
    model.file_name = fileName;
    model.topic = topic;
    model.category = category;
    model.path = path;
    model.dir = dir;

    return model.save();
  }

  // ��ȡ�ĵ�
  getDocument(data) {
    return this.ctx.model.Document.Collection.find(data).exec();
  }

  // ͨ��id��ȡ�ĵ�
  getDocumentById(id) {
    return this.ctx.model.Document.Collection.findOne({ _id: id }).exec();
  }

  // �����ĵ���Ϣ
  updateDocument({ id, data }) {
    return this.ctx.model.Document.Collection.updateOne({ _id: id }, { $set: data }).exec();
  }

  // ɾ���ĵ�
  deleteDocument(id) {
    return this.ctx.model.Document.Collection.remove({ _id: id }).exec();
  }

  // ��ѯ����ͼƬ
  getAllImg(pictureResourcePath, documentService, ctx) {
    const pageIndex = ctx.query.pageIndex || 1;
    const pageSize = ctx.query.pageSize || 12;
    const key = ctx.query.key || '';
    let fileArr = fs.readdirSync(pictureResourcePath);
    if (key !== '') {
      fileArr = fileArr.filter(item => {
        return item.indexOf(key) > -1;
      });
    }
    const images = fileArr.slice(pageSize * (pageIndex - 1), pageSize * pageIndex);
    return images.map(image => {
      return `${documentService}image/${image}`;
    });
  }

  deleteimgByName(pictureResourcePath, ctx) {
    fs.unlinkSync(pictureResourcePath + ctx.request.body.name);
  }

}

module.exports = DocumentService;