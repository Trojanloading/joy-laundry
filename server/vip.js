const mongoose = require('./db');


//一种数据模型
const Schema = mongoose.Schema

const vipSchema = new Schema({
  vipID: String,
  vipName: String
})

module.exports = mongoose.model("vip", vipSchema);