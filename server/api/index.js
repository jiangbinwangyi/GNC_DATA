const fs = require('fs')
const readDir = fs.readdirSync('./server/api/')
const obj = {}
const exclude = ['index.js', 'public.js'] // 排除文件
readDir.forEach(function(file) {
  if (file.endsWith('.js') && !exclude.includes(file)) {
    obj[file.replace('.js', '')] = require('./' + file)
  }
})
module.exports = obj
