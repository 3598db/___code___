'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const random = require('string-random');
const yaml = require('../../helper/yaml');
const DICT = require('../../helper/dictionary');
const compile = require('../../helper/compile');
const blogConfigFilePath = path.resolve(__dirname, '../../../config/blog.yml');
let config = yaml.read(blogConfigFilePath);

class BlogApiController extends Controller {

  async getArticleList() {
    const { ctx } = this;
    const source = yaml.read(blogConfigFilePath).source || '';
    const blogAssetsPath = path.join(source, 'source/_posts');
    const blogDetailsList = [];
    let _id = 0;

    const blogAssetsFiles = await new Promise((resolve, reject) => {
      fs.readdir(blogAssetsPath, (err, files) => {
        if (err) {
          reject(err);
        }

        resolve(files);
      });
    });

    blogAssetsFiles.forEach(blogName => {

      if (path.extname(blogName) !== '.md') return;
      let yamlData = '';
      const blogNameWithoutExtname = blogName.replace(/\.md$/, '');
      const blogContent = fs.readFileSync(path.join(blogAssetsPath, blogName), 'utf-8');
      const yamlInBlogContent = (blogContent.match(/^-{3,}[\s\S]*?-{3,}/) || [])[0];
      if (!yamlInBlogContent) return;
      try {
        yamlData = yaml.parse(yamlInBlogContent.replace(/-{3,}/g, ''));
      } catch (e) {
        return;
      }
      const { date, categories, tags, author, title } = yamlData;

      blogDetailsList.push({
        id: _id++,
        name: blogNameWithoutExtname,
        date: date.toLocaleString(),
        content: blogContent.replace(/^-{3,}[\s\S]*?-{3,}\n/, ''),
        categories,
        tags,
        author,
        title,
      });
    });

    blogDetailsList.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    ctx.body = {
      result: DICT.REQUEST_RESULT.SUCCESS,
      data: blogDetailsList,
    };
  }

  async deleteArticleByName() {
    const { ctx } = this;
    const source = yaml.read(blogConfigFilePath).source || '';
    const blogAssetsPath = path.join(source, 'source/_posts');
    const body = ctx.request.body;
    const { name } = body;

    if (!body.name) {
      ctx.body = {
        result: DICT.REQUEST_RESULT.FAIL,
        message: '����������Ϊ��',
      };
      return;
    }

    const targetFilePath = path.join(blogAssetsPath, `${name}.md`);
    const result = await new Promise(resolve => {
      fs.unlink(targetFilePath, async err => {
        if (err) {
          resolve({
            result: DICT.REQUEST_RESULT.FAIL,
            message: 'ɾ������ʧ��',
          });
          return;
        }

        resolve({ result: DICT.REQUEST_RESULT.SUCCESS });
      });
    });

    ctx.body = result;
  }

  async saveArticle() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { name, title, categories, content, tags, author } = body;
    const date = new Date().toLocaleString();
    const yamlInBlogContent = yaml.stringify({
      title,
      author,
      date,
      categories,
      tags,
    });
    const markdown = `---\n${yamlInBlogContent}\n---\n${content}`;

    const result = await new Promise(resolve => {
      const blogAssetsPath = path.join(config.source, 'source/_posts');
      const blogFilePath = path.join(blogAssetsPath, `./${title}.${random(16)}.md`);
      const targetFile = path.join(blogAssetsPath, `${title}.md`);

      fs.writeFile(blogFilePath, markdown, () => {

        if (name) {
          const oldFilePath = path.join(blogAssetsPath, `${name}.md`);
          fs.unlinkSync(oldFilePath, err => {
            if (err) {
              resolve({
                result: DICT.REQUEST_RESULT.FAIL,
                message: 'ɾ������ԭ�ļ�ʧ��',
              });
            }
          });
        }

        fs.rename(blogFilePath, targetFile, async err => {
          if (err) {
            resolve({
              result: DICT.REQUEST_RESULT.FAIL,
              message: '����md�ļ�ʧ��',
            });
            return;
          }

          resolve({ result: DICT.REQUEST_RESULT.SUCCESS });
        });
      });
    });

    ctx.body = result;
  }

  getConfig() {
    const { ctx } = this;
    ctx.body = {
      result: DICT.REQUEST_RESULT.SUCCESS,
      data: config,
    };
  }

  async saveConfigFile() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { source, port, categories, tags, authors } = body;
    const result = await yaml.write(blogConfigFilePath, {
      source,
      port,
      categories,
      tags,
      authors,
    });

    if (result) {
      ctx.body = {
        result: DICT.REQUEST_RESULT.FAIL,
        message: result,
      };
      return;
    }

    config = yaml.read(blogConfigFilePath);

    ctx.body = {
      result: DICT.REQUEST_RESULT.SUCCESS,
    };
  }

  async build() {
    const { ctx } = this;
    ctx.body = await compile();
  }

}

module.exports = BlogApiController;
