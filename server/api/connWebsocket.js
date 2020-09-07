const ws = require('nodejs-websocket')
module.exports = connWebsocket

async function connWebsocket(ctx) {
  const server = ws.createServer(function(conn) {
    console.log('New connection')
    conn.on('text', function(str) {
      console.log('Received ' + str)
      conn.sendText(str.toUpperCase() + '!!!')
    })
    conn.on('close', function(code, reason) {
      console.log('Connection closed')
    })
  }).listen(9528)
  console.log(server)
  ctx.body = {
    success: true,
    message: '',
    data: []
  }
}
