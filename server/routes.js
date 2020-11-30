// 后台路由配置
const jwt = require('jsonwebtoken')
const config = require('./config.js')
const api = require('./api/index')
const common = require('./common').default
const koaRouter = require('koa-router')
const multer = require('koa-multer')
const fs = require('fs')

const routes = koaRouter()

// userType:需要的用户权限  0:游客 1:超级管理员 2:普通管理员 3:VIP用户 4:普通用户
const urls = {
  'areaList': { userType: 0 } // 用户登录（游客）
}

Object.getOwnPropertyNames(urls).forEach(key => {
  if (Object.prototype.hasOwnProperty.call(common.page_grade, key)) {
    urls[key].userType = common.page_grade[key]// 覆盖访问权限
  }
  if (key !== 'upFile') {
    const obj = urls[key]
    const url = '/' + key + (obj.url || '')
    routes[obj.method ? obj.method : 'post'](url, api[key])
  }
})

// 文件上传配置
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let path = ''
    config.upPath.split('/').forEach(p => {
      if (p && !fs.existsSync(path += p + '/')) {
        fs.mkdirSync(path)
      }
    })
    cb(null, config.upPath)
  },
  filename: function(req, file, cb) {
    const path = Date.now() + file.originalname.match(/\.\w+$/)[0]
    cb(null, path)
  }
})

// 上传文件
routes.post('/upFile', multer({ storage }).single('file'), async ctx => {
  const { originalname, mimetype, filename, path, size } = ctx.req.file
  let msg
  let isDel = 0
  const fullPath = config.upPath.replace('dist/', '/') + filename
  if (size > common.upFile_maxSize || !common.upFile_accept.test(mimetype)) {
    msg = size > common.upFile_maxSize ? '上传文件大小超出' : '非法上传文件格式'
    isDel = 1
    fs.unlinkSync(path)// 同步删除文件
  }
  if (ctx.state.userInfo.id) {
    // 正常后台上传
    await api.saveUpFile([ctx.state.userInfo.id, originalname, fullPath, mimetype, size, isDel, new Date().toLocaleString()])
  } else {
    // 前台不登陆上传签名
    const id = parseInt(ctx.req.body.id) - 8888
    const d = new Date()
    const time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    await api.orderSignUpdate([fullPath, time, id])
  }
  // eslint-disable-next-line require-atomic-updates
  ctx.body = {
    success: !msg,
    message: msg,
    data: {
      filename: fullPath
    }
  }
})

// 验证权限函数
async function verify(ctx) {
  return new Promise((resolve, reject) => {
    if (ctx.url.substring(0, 5) !== '/api/') {
      resolve({})// 非后端接口请求
    }
    const arr = /\/api\/([a-zA-Z]+)/.exec(ctx.url)
    const key = arr ? arr[1] : ''
    const obj = urls[key]
    if (!Object.prototype.hasOwnProperty.call(urls, key)) {
      resolve('非法请求链接：' + ctx.url)
    } else if (ctx.method !== (obj.method ? obj.method : 'post').toUpperCase()) {
      resolve('非法请求方式：' + ctx.method)
    }
    // 异步验证token
    const userType = obj.userType
    if (userType === 0) {
      resolve({}) // 不需要验证token
    }
    jwt.verify(ctx.request.header.authorization, config.JWTs.secret, (err, decoded) => {
      if (err) {
        resolve('token验证错误！')
      } else {
        if (config.getClientIP(ctx) !== decoded.ip || !Number.isInteger(decoded.id)) {
          resolve('登录超时')
        } else if (decoded.user_type > userType) {
          resolve('对不起您无权操作！')
        }
      }
      resolve(decoded)// 把用户信息带上
    })
  })
}

module.exports = {
  verify,
  routes
}
