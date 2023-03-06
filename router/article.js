const express = require('express')
const router = express.Router()
const ArticleModel = require('../model/articles')
const multiparty = require('multiparty')
const fs = require('fs')
// const Sequelize = require('sequelize')
// const Op = Sequelize.Op

router.get('/list', (req, res, next) => {
    ArticleModel.findAll({
      where: req.query
    }).then(function(articles) {
      const data = {
        articles: articles,
        count: articles ? articles.length : 0
      }
      return res.json({
        code: 20000,
        message: '获取成功',
        data: data
      })
    })
})

router.post('/add', (req, res, next) => {
    ArticleModel.create(req.body).then(function(article) {
    if (!article) {
      return res.json({
        code: 40000,
        message: '创建失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '创建成功',
      data: article.article_id
    })
  })
})

router.post('/edit', (req, res, next) => {
  delete req.body.article_id
  const data = req.body
  data.update_time = new Date()
  if(data.status == 1) {
    data.published_time = new Date()
  }
  ArticleModel.update(data, {
    where: {
        article_id: req.query.article_id || 0
    }
  }).then(function(article) {
    if (!article) {
      return res.json({
        code: 40000,
        message: '修改失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '修改成功',
      data: article
    })
  })
})

router.post('/del', (req, res, next) => {
    ArticleModel.destroy({
    where: { article_id: req.body }
  }).then(function(article) {
    return res.json({
      code: 20000,
      message: '删除',
      data: article
    })
  })
})

router.get('/get', (req, res, next) => {
  ArticleModel.findOne({
    where: req.query
  }).then(function(article) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: article
    })
  })
})

router.post('/uploadLogoL', (req, res, next) => {
  console.log('LogoL图片上传')
  let form = new multiparty.Form()
  form.uploadDir = './public/img'
  form.parse(req, function (err, fields, files) {
    console.log('fields', fields)
    // 解析FormData
    const file = files.logoL[0]
    const title = fields.title[0]
    const id = fields.id[0]
    const type = fields.type[0]
    const oldP = file.path // 就文件名
    const suffix = oldP.split('.')[1] //文件扩展名
    const date = new Date().getTime() //当前时间戳
    const newP = 'public/img/' + title + '-' + date + '.' + suffix // 组装新文件名
    console.log(oldP, newP)
    fs.rename(oldP, newP, async (err) => {
      // 文件重命名
      if (err) {
        throw err
      } else {
        // 将用户头像服务器地址 存储在用户信息的logoL上
        const result1 = await ArticleModel.findAll({
          where: {
              article_id: id
          }
        }) //查询用户信息
        const oldImg = result1[0].logoL
        const result = await ArticleModel.update({
          logoL: newP
        }, {
          where: {
              article_id: id
          }
        })
        if (result) {
          console.log('更新成功')
          // 如果是更新图片，删除旧图片
          if (type === 'updata') {
            fs.unlink(oldImg, function () {
              console.log('删除成功')
            })
          }
          return res.json({
            code: 20000,
            message: '修改成功',
            data: newP
          })
        } else {
          return res.json({
            code: 40000,
            message: '修改失败',
            data: null
          })
        }
      }
    })
  })
})

module.exports = router
