const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = require('./init')
const tools = require('../utils/tools')

// 定义表的模型
const ArticleModel = sequelize.define('article', {
	article_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
    type: Sequelize.STRING(255)
  },
	subtitle: {
    type: Sequelize.STRING(255)
  },
	sort: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
	logoS: {
    type: Sequelize.STRING(255)
  },
	logoM: {
    type: Sequelize.STRING(255)
  },
	logoL: {
    type: Sequelize.STRING(255)
  },
	link: {
    type: Sequelize.STRING(255)
  },
	content: {
    type: Sequelize.DataTypes.TEXT('medium')
  },
	richtext: {
    type: Sequelize.DataTypes.TEXT('medium')
  },
	author: {
    type: Sequelize.STRING(30)
  },
	source: {
    type: Sequelize.STRING(255)
  },
	status: {
    type: Sequelize.TINYINT(4),
    defaultValue: 0
  },
	deleted: {
    type: Sequelize.TINYINT(1),
    defaultValue: 0
  },
	published_time: {
    type: Sequelize.DATE,
    get() {
      return this.getDataValue('published_time') ? moment(this.getDataValue('published_time')).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
	update_time: {
    type: Sequelize.DATE,
    get() {
      return this.getDataValue('update_time') ? moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

ArticleModel.getListTree = async function(where = {}) {
  const articles = await ArticleModel.findAll({
    where: where,
    order: [['sort', 'DESC']]
  })
  const articlesArr = articles.map(function(item) {
    return item.get({ plain: true })
  })
  return tools.getTreeData(articlesArr, null, 'article_id')
}

module.exports = ArticleModel