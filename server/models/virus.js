const mongoose = require('../db')
const Schema = mongoose.Schema

// 用户
const userSchema = new Schema({
  username: String,
  password: String,
  phone: Number,
  verificationCode: String,
  vipID: { type: String, default: "HY00000000000" },
  updated: { type: Date, default: Date.now },
  _someId: { default: Schema.Types.ObjectId },
})

// 会员信息
const vipSchema = new Schema({
  vipID: String,
  vipName: String,
  vipState: String,
  vipLevel: String,
  vipDiscount: Number,
  balance: { type: Number, default: 0 },
  totalConsumption: { type: Number, default: 0 },
  numberOfConsumption: { type: Number, default: 0 },
  contact: Number,
  vipIntegral: Number,
  gender: String,
  registrationDate: String,
  vipPassword: String,
  note: String
})

// 会员充值记录表
const vipTopUpSchema = new Schema({
  vipID: String,
  vipName: String,
  vipLevel: String,
  contact: Number,
  paidInAmount: Number,
  paidInActual: Number,
  topUpDate: String,
  paymentMethod: String,
  note: String
})

// 洗衣订单详情
const orderSchmma = new Schema({
  transactionNumber: String,
  clothesName: String,
  laundryType: String,
  clothingBrand: String,
  paymentMethod: String,
  addedDate: String,
  collectionDate: String,
  clothingColor: String,
  clothingAccessories: [],
  clothingBlemishes: [],
  originalPrice: Number,
  discount: Number,
  discountPrice: Number,
  amountReceivable: Number,
  paidInAmount: Number,
  maLingAmount: Number,
  address: String,
  vipID: String,
  vipName: String,
  vipState: String,
  vipLevel: String,
  contact: Number,
  gender: String,
  ispaid: String,
  whetherTake: String,
  rewashes: String,
  salesReturn: String,
  note: String
})

// 退赔衣物集合
const salesReturnSchmma = new Schema({
  compensationNumber: String,
  transactionNumber: String,
  amount: String,
  date: String,
  operator: String,
  why: String,
  vipID: String,
  vipName: String
})

// 撤销单子集合
const cancelOrderSchmma = new Schema({
  cancelOrderNumber: String,
  transactionNumber: String,
  payFee: String,
  date: String,
  operator: String,
  why: String,
  vipID: String,
  vipName: String
})

// 用户反馈建议集合
const userFeedbackSchmma = new Schema({
  username: String,
  date: String,
  feedback: String,
  reply: String
})

// 系统公告集合
const noticeSchmma = new Schema({
  operator: String,
  date: String,
  content: String
})

// 用户申请会员集合
const applyVipSchmma = new Schema({
  username: String,
  vipName: String,
  contact: String,
  gender: String,
  vipPassword: String,
  registrationDate: String,
  ispass: { type: String, default: "" },
  reason: String,
  read: { type: Number, default: 0 }
})

// 用户订单申请集合
const orderApplySchmma = new Schema({
  transactionNumber: String,
  clothesName: String,
  laundryType: String,
  clothingBrand: String,
  paymentMethod: String,
  addedDate: String,
  collectionDate: String,
  clothingColor: String,
  clothingAccessories: [],
  clothingBlemishes: [],
  originalPrice: Number,
  discount: Number,
  discountPrice: Number,
  amountReceivable: Number,
  paidInAmount: Number,
  maLingAmount: Number,
  address: String,
  vipID: String,
  vipName: String,
  vipState: String,
  vipLevel: String,
  contact: Number,
  gender: String,
  ispaid: String,
  whetherTake: String,
  rewashes: String,
  salesReturn: String,
  note: String
})

// ------------------
// 系统设置-基础资料设置

// 衣服名称集合
const clothesNameSchmma = new Schema({
  type: String,
})
// 衣服附件集合
const clothingAccessoriesSchmma = new Schema({
  type: String,
})
// 洗衣类型集合
const laundryTypeSchmma = new Schema({
  type: String,
})
// 衣服品牌集合
const clothingBrandSchmma = new Schema({
  type: String,
})
// 衣服瑕疵集合
const clothingBlemishesSchmma = new Schema({
  type: String,
})
// 付款方式集合
const paymentMethodsSchmma = new Schema({
  type: String,
})

// 系统设置-衣物价格设置
const clothesPriceSchmma = new Schema({
  clothesName: String,
  laundryType: String,
  originalPrice: Number,
  operator: String,
  addedDate: String,
})



const Models = {
  user: mongoose.model('user', userSchema),
  vip: mongoose.model('vip', vipSchema),
  vipTopUp: mongoose.model('vipTopUp', vipTopUpSchema),
  order: mongoose.model('order', orderSchmma),
  salesReturn: mongoose.model('salesReturn', salesReturnSchmma),
  cancelOrder: mongoose.model('cancelOrder', cancelOrderSchmma),
  userFeedback: mongoose.model('userFeedback', userFeedbackSchmma),
  notice: mongoose.model('notice', noticeSchmma),
  applyVip: mongoose.model('applyVip', applyVipSchmma),
  orderApply: mongoose.model('orderApply', orderApplySchmma),
  clothesName: mongoose.model('clothesName', clothesNameSchmma),
  clothingAccessories: mongoose.model('clothingAccessories', clothingAccessoriesSchmma),
  laundryType: mongoose.model('laundryType', laundryTypeSchmma),
  clothingBrand: mongoose.model('clothingBrand', clothingBrandSchmma),
  clothingBlemishes: mongoose.model('clothingBlemishes', clothingBlemishesSchmma),
  paymentMethods: mongoose.model('paymentMethods', paymentMethodsSchmma),
  clothesPrice: mongoose.model('clothesPrice', clothesPriceSchmma),
}

module.exports = Models