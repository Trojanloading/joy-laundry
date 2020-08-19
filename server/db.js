//导入mongoose模块
const mongoose = require('mongoose');
//设置默认mongoose连接
const mongoDB = 'mongodb://127.0.0.1:27017/joyLaundry';
mongoose.connect(mongoDB);
// 让mongoose 使用全局Promise库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;

db.on('error', err => {
  console.log('mongodb connection error.' + err)
})

db.on('connected', function () {
  console.log("open mongodb")
})

db.on('disconnected', function () {
  console.log("close mongodb")
})

module.exports = mongoose
