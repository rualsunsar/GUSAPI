const express = require('express')
const router = express.Router()
const ArticleModel = require('../model/articles')
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

module.exports = router
