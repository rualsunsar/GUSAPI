const express = require('express')
const path = require('path')
const app = express()
// 导入cors解决跨域问题
const cors = require('cors')
const expressJwt = require('express-jwt')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const userRouter = require('./router/user')
const roleRouter = require('./router/role')
const menuRouter = require('./router/menu')
const logRouter = require('./router/user-log')
const articleRouter = require('./router/article')
const webaApiRouter = require('./router/webApi')

// const history = require('connect-history-api-fallback')
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/public',express.static('public'))
// app.use(history())

// 配置cors中间件，解决跨域问题
app.use(cors())

app.use(expressJwt({
  secret: 'bigfool.cn' // 签名的密钥 或 PublicKey
}).unless({
  path: [
    '/', 
    '/user/login', 
    { url: /^\/webApi\/.*/, methods: ['GET', 'POST'] },
  ] // 指定路径不经过 Token 解析
}))

app.use(bodyParser.urlencoded({
  extends: false
}))

app.use(bodyParser.json())

// 自定义日志格式
const myLogFormat = ':method :url :status :response-time ms - :res[content-length]';

app.use(morgan(myLogFormat))

app.use(function(err, req, res, next) {
  console.log('err',err)
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('token已失效')
  } else {
    res.status(500).send('服务器错误')
  }
})

//  使用路由 / 是路由指向名称
app.use('/user', userRouter)
app.use('/user-log', logRouter)
app.use('/role', roleRouter)
app.use('/menu', menuRouter)
app.use('/article', articleRouter)
app.use('/webApi', webaApiRouter)

// 配置服务端口
const port = 8002
const hostname = '0.0.0.0'
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

