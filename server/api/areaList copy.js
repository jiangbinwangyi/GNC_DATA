const P = require('./public')
module.exports = areaList

// 获取全局设置
async function areaList(ctx) {
  const connection = await P.mysql.createConnection(P.config.mysqlDB)
  const [list] = await connection.execute('SELECT id, area FROM `area`', [])
  await connection.end()
  ctx.body = {
    success: true,
    message: '',
    data: list
  }
}
