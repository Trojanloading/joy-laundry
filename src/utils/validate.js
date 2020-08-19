/**
 * Created by ShuoLuo on 05/13/2020.
 */

/**
 * @param {string} username
 * @returns {Boolean}
 */
//验证用户名称(用户名称不能为空且不能包含空格)
export function validUsername(username) {
  // return username.trim().length > 0
  return /^[^\s]{1,20}$/.test(username)
}

/**
 * @param {string} password
 * @returns {Boolean}
 */
//验证密码(密码必须由6-16位（字母、数字、! @ # * - _ .）组成)
export function validPassword(password) {
  return /^[\w-_@#*!.]{6,16}$/.test(password)
}

/**
 * @param {Number} phoneNumber
 * @returns {Boolean}
 */
//验证手机号码(请输入正确的手机号码（必须由11位数字组成）)
export function validPhone(phoneNumber) {
  // return parseInt(phoneNumber.trim()).toString().length == 11
  return parseInt(phoneNumber.toString().trim()).toString().length == 11
}

/**
 * @param {string} verificationCode
 * @returns {Boolean}
 */
//验证验证码(验证码不能为空且不能包含空格)
export function validVerificationCode(verificationCode) {
  return /^[^\s]{1,20}$/.test(verificationCode)
}

/**
 * @param {string} vipID
 * @returns {Boolean}
 */
//验证会员卡ID(会员卡号不能为空且不能包含空格)
export function validVipID(vipID) {
  // return username.trim().length > 0
  return /^[^\s]{1,20}$/.test(vipID)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
//非空
export function validNotEmpty(str) {
  return /^[^\s]{1,20}$/.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
//非空可以有空格
export function validNotEmpty1(str) {
  return /\S/.test(str)
}

/**
 * @param {string} Number
 * @returns {Boolean}
 */
//整数或者小数（两位小数）
export function validNumber(Number) {
  return /^[0-9]+\.{0,1}[0-9]{0,2}$/.test(Number)
}

/**
 * @param {string} discount
 * @returns {Boolean}
 */
//折扣0~1
export function validDiscount(discount) {
  return /^0+\.[1-9]{1}[0-9]{0,1}$/.test(discount)
}

/**
 * @param {string} paidInAmount
 * @returns {Boolean}
 */
//
export function validPaidInAmount(paidInAmount) {
  return /^[0-9]+\.{0,1}[0-9]{0,2}$/.test(paidInAmount)
}