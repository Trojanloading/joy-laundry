// var AWS = require('aws-sdk')
var S3 = require('aws-sdk/clients/s3')
// var AWS = require('aws-sdk/global');
import 'aws-sdk/lib/node_loader' // [Hack] needed before the first import
import { config } from 'aws-sdk/lib/core' // or any other `aws-sdk` export

// import request from './request'
// import { getS3Key, setS3Key } from './auth'
import moment from 'moment'

export class S3Api {
  static uploadFile(file) {
    // const data = JSON.parse(getS3Key())
    return new Promise((resolve, reject) => {
      // 时间
      const time = moment().format('YYYYMMddHHmmss') // 2019-01-09 11:22:29
      // 随机数
      var arr = []
      for (var i = 0; i < 6; i++) {
        var num = Math.random() * 10
        num = parseInt(num, 10)
        arr.push(num)
      }
      var randomString = arr.join('')

      var filePath = 'files/' + time + '_' + randomString
      var fileType = file.type || file[0].type
      var index = fileType.lastIndexOf('/')
      var suffix = fileType.substring(index + 1, fileType.length)
      if (suffix === 'jpeg') {
        suffix = 'jpg'
      }
      filePath += '.' + suffix

      // 上传
      var credentials = {
        // accessKeyId: data.access_key_id,
        accessKeyId: 'AKIA5CLP6K6AW2BPVMPV',
        // secretAccessKey: decode(data.secret_access_key),
        secretAccessKey: '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'
        // sessionToken: data.session_token
      } // 秘钥形式的登录上传
      config.update(credentials)
      // config.region = data.aws_region // 设置区域
      config.region = 'ap-southeast-1' // 设置区域

      // S3.config

      // var bucket = new S3({ params: { Bucket: data.aws_bucket }}) // 选择桶
      var bucket = new S3({ params: { Bucket: 's4a-hk' }}) // 选择桶

      var params = {
        Key: filePath,
        ContentType: file.type,
        Body: file,
        'Access-Control-Allow-Credentials': '*'
        // ACL: 'public-read'
      } // key可以设置为桶的相抵路径，Body为文件， ACL最好要设置
      bucket
        .upload(params)
        .promise()
        .then(res => {
          resolve(res)
        })
        .catch(function(reason) {
          reject(reason)
        })
    })
  }

  // static getSignedUrl = function (path) {
  //   if (!path) {
  //     return ''
  //   }
  //   return s3.getSignedUrl('getObject', {
  //     Bucket: myBucket,
  //     Key: path,
  //     ResponseContentType: mime.getType(path)
  //   })
  // }
  // static getS3KeyAction() {
  //   if (getS3Key()) {
  //     return true
  //   }
  //   request({
  //     url: 'system/s3secret',
  //     method: 'get'
  //   }).then(result => {
  //     setS3Key(result)
  //   })
  // }
}

// function decode(secret) {
//   return atob(secret)
//     .split('')
//     .reverse()
//     .join('')
//     .match(/(.{1,2})/g)
//     .map(function(ord) {
//       return String.fromCharCode(parseInt(ord, 36))
//     })
//     .join('')
// }
