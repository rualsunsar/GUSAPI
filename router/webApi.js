const express = require('express')
const router = express.Router()
const ArticleModel = require('../model/articles')

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

module.exports = router
