// const P = require('./public')
module.exports = areaList

// 获取全局设置
async function areaList(ctx) {
  console.log('123123')
  ctx.body = {
    success: true,
    message: '',
    data: []
  }
}
