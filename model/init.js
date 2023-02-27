const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'sar_test', // 数据库名
  'root', // 用户名
  'Sar621214#', // 密码
  {
    'dialect': 'mysql', // 数据库类型
    // 'host': '124.222.91.249', // 正式库ip
    'host': 'localhost', // 本地库ip
    'port': 3306, // 端口
    define: {
      timestamps: false
    },
    timezone: '+08:00' // 东八时区
  }
)

module.exports = sequelize
