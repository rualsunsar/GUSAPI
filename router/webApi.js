const express = require('express')
const router = express.Router()
const ArticleModel = require('../model/articles')

/**
 * 获取文章列表
 */
router.get('/articleList', (req, res, next) => {
  console.log('/articleList')
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

/**
 * 获取文章详情
 */
router.get('/articleInfo', (req, res, next) => {
  ArticleModel.findOne({
    where: {
      article_id: req.query.article_id || 0
  }
  }).then(function(article) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: article
    })
  })
})

module.exports = router
