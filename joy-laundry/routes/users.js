var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  /**
 * npm install crypto-js request
 */
  var CryptoJS = require("crypto-js");
  var request = require('request');
  var querystring = require('querystring');

  // 云市场分配的密钥Id
  var secretId = "AKIDbeLPjJ6iebF1Az86oj11HjK4U0GgZ612n1dl";
  // 云市场分配的密钥Key
  var secretKey = "57pi4C6MGUY13NmwkR9K6BpDz6a64L1K6437RU9";
  var source = "market";

  // 签名
  var datetime = (new Date()).toGMTString();
  var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
  var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
  var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';

  // 请求方法
  var method = 'GET';
  // 请求头
  var headers = {
    "X-Source": source,
    "X-Date": datetime,
    "Authorization": auth,
  }
  // 查询参数
  let code = `${Math.floor(Math.random() * 999999)}`;
  var queryParams = {
    'mobile': '13630488002',
    'param': `**验证码**:${code}`,
    'smsSignId': '7e368ce4cb3943f6a9e64f9cbf0abebb',
    'templateId': '264916e277394ee88c10fc1cb9e0140f'
  }
  // body参数（POST方法下）
  var bodyParams = {
  }
  // url参数拼接
  var url = 'http://service-m6t5cido-1256923570.gz.apigw.tencentcs.com/release/sms/send';
  if (Object.keys(queryParams).length > 0) {
    url += '?' + querystring.stringify(queryParams);
  }

  var options = {
    url: url,
    timeout: 5000,
    method: method,
    headers: headers
  }
  if (['POST', 'PUT', 'PATCH'].indexOf(method) != -1) {
    options['body'] = querystring.stringify(bodyParams);
    options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
  }

  request(options, function (error, response, body) {
    if (error !== null) {
      console.log('error:', error);
      return;
    }
    console.log(body);
  });
});

module.exports = router;
