const CryptoJS = require("crypto-js");
const request = require("request");
const querystring = require("querystring");
const express = require('express')
const router = express.Router()
const models = require('./models/virus')
// const fn = () => { }
//allow custom header and CORS 处理跨域问题，修改请求头
router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); //让options请求快速返回
  }
  else {
    next();
  }
});



router.get('/doit', (req, res) => {
  res.send("第一次成功");
});

// 用户注册
router.post('/user/register', (req, res) => {
  var userModel = new models.user(req.body);
  userModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
  // models.user.findOne(
  //   { "username": "luoshuo" },
  //   "password",
  //   function (err, users) {
  //     if (err) {
  //       console.log("find error")
  //     } else {
  //       console.log(users)
  //     }
  //   }
  // )
});

// 用户登录
router.post('/user/login', (req, res) => {
  models.user.find(
    {
      "username": req.body.username,
      "password": req.body.password
    },
    function (err, users) {
      if (err) {
        console.log("find error")
      } else {
        if (users.length == 0) {
          res.end("false");
          console.log("该用户未注册")
        } else {
          models.user.findOne(
            { "username": req.body.username },
            '_id username',
            function (err, usersInfo) {
              if (err) {
                console.log("find error")
              } else {
                res.send(usersInfo)
                console.log(usersInfo)
              }
            }
          )
          console.log("存在该用户，可以登录");
        }
      }
    }
  )
});

// 验证用户是否已经注册
router.post('/user/register/usernameValidate', (req, res) => {
  console.log(req.body)
  models.user.find(
    { "username": req.body.username },
    function (err, users) {
      if (err) {
        console.log("find error")
      } else {
        if (users.length == 0) {
          res.end("未注册");
          console.log("没有该用户，还没注册")
        } else {
          res.end("已注册");
          console.log("该用户已注册");
        }
      }
    }
  )
})


// 短信验证码API
router.post('/sms_send', (req, res) => {
  /**
  * npm install crypto-js request
  */
  // var CryptoJS = require("crypto-js");
  // var request = require('request');
  // var querystring = require('querystring');

  // 云市场分配的密钥Id
  let secretId = "AKIDbeLPjJ6iebF1Az86oj11HjK4U0GgZ612n1dl";
  // 云市场分配的密钥Key
  let secretKey = "57pi4C6MGUY13NmwkR9K6BpDz6a64L1K6437RU9";
  let source = "market";

  // 签名
  let datetime = (new Date()).toGMTString();
  let signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
  let sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
  let auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';

  // 请求方法
  let method = 'GET';
  // 请求头
  let headers = {
    "X-Source": source,
    "X-Date": datetime,
    "Authorization": auth,
  }
  // 查询参数
  let code = `${Math.floor(Math.random() * 999999)}`;
  let queryParams = {
    'mobile': `${req.body.phoneNumber}`,
    'param': `**验证码**:${code}`,
    'smsSignId': '7e368ce4cb3943f6a9e64f9cbf0abebb',
    'templateId': '264916e277394ee88c10fc1cb9e0140f'
  }
  // body参数（POST方法下）
  let bodyParams = {
  }
  // url参数拼接
  let url = 'http://service-m6t5cido-1256923570.gz.apigw.tencentcs.com/release/sms/send';
  if (Object.keys(queryParams).length > 0) {
    url += '?' + querystring.stringify(queryParams);
  }

  let options = {
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
    // if (error !== null) {
    //   console.log('error:', error);
    //   return;
    // } else {
    //   res.send(code);
    //   console.log(body);
    //   console.log(response);

    // }
    if (!error && response.statusCode == 200) {
      console.log(body) // 打印接口返回内容
      const jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
      console.log(jsonObj.msg);
      if (jsonObj.msg == "成功") {
        res.end(code);
      } else {
        res.end(jsonObj.msg);
      }
      // let count = 0;
      // setInterval(() => {
      //   res.send("sadf")
      // }, 1000)
      doSecond();

    } else {
      codeSecond = 0;
      res.end("500,服务器错误！")
      console.log(response);
      // doSecond();
    }
  });
  // 聚合数据的API
  // let code = `${Math.floor(Math.random() * 999999)}`;
  // const queryData = querystring.stringify({
  //   "mobile": req.body.phoneNumber,  // 接受短信的用户手机号码
  //   "tpl_id": "215335",  // 您申请的短信模板ID，根据实际情况修改
  //   "tpl_value": `#code#=${code}`,  // 您设置的模板变量，根据实际情况修改
  //   "key": "fbfa7b194f9d59e4bf7f1c70e19ed948"  // 应用APPKEY(应用详细页查询)
  // });

  // const queryUrl = 'http://v.juhe.cn/sms/send?' + queryData;
  // request(queryUrl, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body) // 打印接口返回内容
  //     const jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
  //     console.log(jsonObj);
  //     res.send(code);
  //   } else {
  //     console.log(response.statusCode);
  //     res.send("err");

  //   }
  // })
})


let codeSecond = 30;
function doSecond() {
  codeSecond = 30;
  let timer = setInterval(() => {
    codeSecond--;
    console.log(codeSecond);
    if (codeSecond == 0) { clearInterval(timer) }
  }, 1000)
}

// -------------------------------------------
// 忘记密码
// 验证用户是否存在
router.post('/user/forget/usernameValidate', (req, res) => {
  console.log(req.body)
  models.user.find(
    { "username": req.body.username },
    function (err, users) {
      if (err) {
        console.log("find error")
      } else {
        if (users.length == 0) {
          res.end("未注册");
          console.log("没有该用户，还没注册")
        } else {
          res.end("已注册");
          console.log("该用户已注册");
        }
      }
    }
  )
})

// 验证用户手机号码是否正确
router.post('/user/forget/phoneValidate', (req, res) => {
  console.log(req.body)
  models.user.find(
    {
      "username": req.body.username,
      "phone": req.body.phone
    },
    function (err, users) {
      if (err) {
        console.log("find error")
      } else {
        if (users.length == 0) {
          res.send(false);
          console.log("手机号码不正确")
        } else {
          res.send(true);
          console.log("手机号码正确");
        }
      }
    }
  )
})

// 找回密码
router.post('/user/forget', (req, res) => {
  console.log(req.body)
  models.user.findOne(
    {
      "username": req.body.username,
      "phone": req.body.phone
    },
    "password",
    function (err, users) {
      if (err) {
        console.log("find error")
      } else {
        if (users.length == 0) {
          res.send(false);
          console.log("密码未找到")
        } else {
          res.send(users);
          console.log("密码已找到");
        }
      }
    }
  )
})


// --------------------------------------------
// 搜索会员
router.post('/vipManagement/search', (req, res) => {
  console.log(req.body);
  if (req.body.state == "") {
    res.end(false)
    console.log("不能为空")
  } else {
    models.vip.find(
      { vipID: req.body.state },
      function (err, vips) {
        if (err) {
          res.end("数据库查找错误");
          console.log("find error");
        } else {
          if (vips.length == 0) {
            console.log("不对，继续")
            models.vip.find(
              { vipName: req.body.state },
              function (err, vips1) {
                if (err) {
                  res.end("数据库查找错误");
                  console.log("find error");
                } else {
                  if (vips1.length == 0) {
                    res.end(false)
                    console.log("没有该会员")
                  } else {
                    console.log(vips1);
                    res.send(vips1);
                    console.log("找到了，是名称");
                  }
                }
              }
            )
          } else {
            console.log(vips);
            res.send(vips);
            console.log("找到了，是ID");
          }
        }
      }
    )
  }
})

// 搜索加载全部会员
router.post('/vipManagement/loadAll', (req, res) => {
  console.log(req.body);
  models.vip.find(
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.end("集合为空");
          console.log("集合为空")
        } else {
          console.log(vips);
          res.send(vips);
          console.log("vips发回前端");
        }
      }
    }
  )
})

// 添加会员
router.post('/vipManagement/addVip', (req, res) => {
  console.log(req.body)
  var userModel = new models.vip(req.body);
  userModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 添加会员时验证是否存在该会员
router.post('/vipManagement/addVip/vipIDValidate', (req, res) => {
  console.log(req.body)
  models.vip.find(
    { "vipID": req.body.vipID },
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.end("还未存在该会员卡号");
          console.log("还未存在该会员卡号，可以继续")
        } else {
          res.end("已存在");
          console.log("该会员卡号已存在");
        }
      }
    }
  )
})

// 会员补卡时验证旧密码
router.post('/vipManagement/reissueCard/oldVipPasswordValidate', (req, res) => {
  console.log(req.body)
  models.vip.find(
    { "vipID": req.body.vipID },
    "vipPassword",
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.end("error");
          console.log("不知道为什么长度为空")
        } else {
          res.send(vips[0]);
          console.log(vips[0])
          console.log("返回旧密码");
        }
      }
    }
  )
})

// 会员补卡表单提交
router.post('/vipManagement/reissueCard', (req, res) => {
  console.log(req.body)
  models.vip.findOneAndUpdate(
    { "vipID": req.body.oldVipID },
    {
      $set: {
        "vipID": req.body.newVipID,
        "vipPassword": req.body.newVipPassword
      }
    },
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.end("error");
          console.log("更新出错")
        } else {
          res.send(true);
          console.log(vips)
          console.log("更新成功");
        }
      }
    }
  )
})

// 会员删除
router.post('/vipManagement/deleteVip', (req, res) => {
  console.log(req.body)
  models.vip.findOneAndRemove(
    { vipID: req.body.vipID },
    function (err) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("删除成功");
      }
    }
  )
})

// 编辑会员
router.post('/vipManagement/editorVip', (req, res) => {
  console.log(req.body)
  models.vip.findOneAndUpdate(
    { "vipID": req.body.vipID },
    req.body,
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log(vips)
        console.log("更新成功");
      }
    }
  )
})

// ------------------------------------------------------------------

// 会员充值卡号验证搜索
router.post('/vipTopUp/vipIDValidate', (req, res) => {
  console.log(req.body)
  models.vip.find(
    { "vipID": req.body.vipID },
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.send(false);
          console.log("还未存在该会员卡号")
        } else {
          res.send(vips[0]);
          console.log(vips);
          console.log("该会员卡号已存在");
        }
      }
    }
  )
})

// 会员充值，添加充值记录，更新余额
router.post('/vipTopUp', (req, res) => {
  console.log(req.body)
  var userModel = new models.vipTopUp(req.body);
  userModel.save(function (error, response) {
    if (error) {
      res.end("no");
      console.log("error" + error);
      console.log(response);
    } else {
      models.vip.findOne(
        { "vipID": req.body.vipID },
        function (err, vips) {
          if (err) {
            res.send(false);
            console.log("find error");
          } else {
            if (vips.length == 0) {
              res.send(false);
              console.log("卡内余额更新出错")
            } else {
              vips.balance += Number(req.body.paidInActual)
              vips.save();
              res.send(`${vips.balance}`);
              console.log(vips)
              console.log("更新成功");
            }
          }
        }
      )
    }
  })
})

// 搜索某会员充值记录
router.post('/vipTopUp/record', (req, res) => {
  console.log(req.body)
  models.vipTopUp.find(
    { "vipID": req.body.vipID },
    function (err, vips) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.send(false);
          console.log("无记录")
        } else {
          res.send(vips);
          console.log(vips);
          console.log("有记录");
        }
      }
    }
  )
})









// ---------------------------------
// 系统管理

// 搜索加载全部会员充值记录
router.post('/memberConsumptionStatistics/loadAll', (req, res) => {
  console.log(req.body);
  models.vipTopUp.find(
    function (err, vipTU) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vipTU.length == 0) {
          res.end("集合为空");
          console.log("集合为空")
        } else {
          console.log(vipTU);
          res.send(vipTU);
          console.log("vipTU发回前端");
        }
      }
    }
  )
})

// 搜索会员卡充值记录
router.post('/memberConsumptionStatistics/search', (req, res) => {
  console.log(req.body);
  if (req.body.state == "") {
    res.end(false)
    console.log("不能为空")
  } else {
    models.vipTopUp.find(
      { vipID: req.body.state },
      function (err, vipTU) {
        if (err) {
          res.end("数据库查找错误");
          console.log("find error");
        } else {
          if (vipTU.length == 0) {
            console.log("不对，继续")
            models.vipTopUp.find(
              { vipName: req.body.state },
              function (err, vipTU1) {
                if (err) {
                  res.end("数据库查找错误");
                  console.log("find error");
                } else {
                  if (vipTU1.length == 0) {
                    res.end(false)
                    console.log("没有该会员")
                  } else {
                    console.log(vipTU1);
                    res.send(vipTU1);
                    console.log("找到了，是名称");
                  }
                }
              }
            )
          } else {
            console.log(vipTU);
            res.send(vipTU);
            console.log("找到了，是ID");
          }
        }
      }
    )
  }
})


// 删除会员充值记录
router.post('/memberConsumptionStatistics/deleteRecord', (req, res) => {
  console.log(req.body)
  models.vipTopUp.findOneAndRemove(
    { _id: req.body._id },
    function (err) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("删除成功");
      }
    }
  )
})


// ----------------------------------------------------
// 收取衣物

// 查询是否存在该订单号
router.post('/collectionClothings/addClothes/validationOrder', (req, res) => {
  console.log(req.body)
  models.order.find(
    { "transactionNumber": req.body.transactionNumber },
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (orders.length == 0) {
          res.send(true);
          console.log("还未存在该订单号")
        } else {
          res.send(false);
          console.log(orders);
          console.log("该订单号已存在");
        }
      }
    }
  )
})

// 数值格式化
function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || "ceil"; //"ceil","floor","round"
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {

      var k = Math.pow(10, prec);
      console.log();

      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// 添加衣物订单，并去更新用户的信息，如余额.等
router.post('/collectionClothings/addClothes', (req, res) => {
  console.log(req.body)
  var orderModel = new models.order(req.body);
  orderModel.save(function (error, response) {
    if (error) {
      res.end("no");
      console.log("error" + error);
      console.log(response);
    } else {
      models.vip.findOne(
        { "vipID": req.body.vipID },
        function (err, vips) {
          if (err) {
            res.send(false);
            console.log("find error");
          } else {
            if (vips.length == 0) {
              res.send(false);
              console.log("会员查找出错")
            } else {
              vips.totalConsumption = number_format(vips.totalConsumption + Number(req.body.amountReceivable), 2, ".", ",", "round");

              // vips.totalConsumption += Number(req.body.amountReceivable);
              vips.numberOfConsumption++;
              if (req.body.paymentMethod == "卡内余额") {
                vips.balance -= Number(req.body.amountReceivable);
              }
              vips.save();
              res.send(`${vips.balance}`);
              console.log(vips)
              console.log("更新成功");
            }
          }
        }
      )
    }
  })
})


// 加载某会员的全部订单信息
router.post('/collectionClothings/laundryManagement/loadOrder', (req, res) => {
  console.log(req.body);
  models.order.find({ "vipID": req.body.vipID },
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (orders.length == 0) {
          res.send(false);
          console.log("集合为空")
        } else {
          console.log(orders);
          res.send(orders);
          console.log("orders发回前端");
        }
      }
    }
  )
})

// 加载全部订单信息
router.post('/collectionClothings/laundryManagement/loadAllOrder', (req, res) => {
  models.order.find(
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (orders.length == 0) {
          res.send(false);
          console.log("还没有订单信息")
        } else {
          console.log(orders);
          res.send(orders);
          console.log("orders发回前端");
        }
      }
    }
  )
})


// 搜索订单信息
router.post('/collectionClothings/laundryManagement/search', (req, res) => {
  console.log(req.body);
  if (req.body.state == "") {
    res.end(false)
    console.log("不能为空")
  } else {
    models.order.find(
      { transactionNumber: req.body.state },
      function (err, orders) {
        if (err) {
          res.end("数据库查找错误");
          console.log("find error");
        } else {
          if (orders.length == 0) {
            console.log("不对，继续")
            models.order.find(
              { vipName: req.body.state },
              function (err, orders1) {
                if (err) {
                  res.end("数据库查找错误");
                  console.log("find error");
                } else {
                  if (orders1.length == 0) {
                    res.end(false)
                    console.log("没有该会员的订单记录")
                  } else {
                    console.log(orders1);
                    res.send(orders1);
                    console.log("找到了，是名称");
                  }
                }
              }
            )
          } else {
            console.log(orders);
            res.send(orders);
            console.log("找到了，是订单号");
          }
        }
      }
    )
  }
})

// 删除某条订单记录
router.post('/collectionClothings/laundryManagement/delOrder', (req, res) => {
  console.log(req.body)
  models.order.findOneAndRemove(
    { transactionNumber: req.body.transactionNumber },
    function (err) {
      if (err) {
        res.end("数据库查找删除错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("删除成功");
      }
    }
  )
})


// 编辑订单信息
router.post('/collectionClothings/laundryManagement/editorOrder', (req, res) => {
  console.log(req.body)
  models.order.findOneAndUpdate(
    { "transactionNumber": req.body.transactionNumber },
    req.body,
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log(orders)
        console.log("更新成功");
      }
    }
  )
})


// --------------------------------
// 领取衣物

// 进入结单时加载会员信息
router.post('/getClothings/takeStatements/loadVip', (req, res) => {
  console.log(req.body)
  models.vip.findOne(
    { "vipID": req.body.vipID },
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(vips);
        console.log(vips)
        console.log("更新成功");
      }
    }
  )
})

// 取衣结单
router.post('/getClothings/takeStatements', (req, res) => {
  console.log(req.body)
  models.order.findOneAndUpdate(
    { "transactionNumber": req.body.transactionNumber },
    { "whetherTake": "是" },
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log(orders)
        console.log("更新成功");
      }
    }
  )
})

// 订单付费
router.post('/getClothings/paid', (req, res) => {
  console.log(req.body);
  models.order.findOneAndUpdate(
    { "transactionNumber": req.body.transactionNumber },
    {
      "ispaid": "是",
      "paidInAmount": req.body.amountReceivable
    },
    function (err, orders) {
      console.log(orders);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        models.vip.findOne(
          { "vipID": req.body.vipID },
          function (err, vips) {
            if (err) {
              res.send(false);
              console.log("find error");
            } else {
              if (vips.length == 0) {
                res.send(false);
                console.log("会员查找出错")
              } else {
                // vips.totalConsumption = number_format(vips.totalConsumption + Number(req.body.amountReceivable), 2, ".", ",", "round");
                // vips.totalConsumption += Number(req.body.amountReceivable);
                // vips.numberOfConsumption++;
                if (req.body.paymentMethod == "卡内余额") {
                  vips.balance -= Number(req.body.amountReceivable);
                }
                vips.save();
                res.send(`${vips.balance}`);
                console.log(vips)
                console.log("更新成功");
              }
            }
          }
        )
      }
    }
  )
})


// 订单重洗
router.post('/getClothings/rewashes', (req, res) => {
  console.log(req.body);
  models.order.findOneAndUpdate(
    { "transactionNumber": req.body.transactionNumber },
    {
      "rewashes": "是",
      "collectionDate": req.body.newCollectionDate
    },
    function (err, orders) {
      console.log(orders);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
        console.log("返回重洗成功")
      }
    }
  )
})

// 订单退赔之获取操作员
router.post('/getClothings/salesReturn/getOperator', (req, res) => {
  console.log(req.body);
  models.user.findOne(
    { "_id": req.body.operator_id },
    function (err, users) {
      console.log(users);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(users);
        console.log("查找操作员成功")
      }
    }
  )
})

// 查询是否存在该退赔订单号
router.post('/getClothings/salesReturn/validationOrder', (req, res) => {
  console.log(req.body)
  models.salesReturn.find(
    { "compensationNumber": req.body.compensationNumber },
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (orders.length == 0) {
          res.send(true);
          console.log("还未存在该退赔订单号")
        } else {
          res.send(false);
          console.log(orders);
          console.log("该退赔订单号已存在");
        }
      }
    }
  )
})

// 验证操作员的密码
router.post('/getClothings/salesReturn/validPassword', (req, res) => {
  console.log(req.body)
  models.user.find(
    {
      "username": req.body.username,
      "password": req.body.password
    },
    function (err, users) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (users.length == 0) {
          res.send(false);
          console.log("密码错误")
        } else {
          res.send(true);
          console.log(users);
          console.log("密码正确");
        }
      }
    }
  )
})


// 退赔衣物，添加退赔单
router.post('/getClothings/salesReturn', (req, res) => {
  console.log(req.body)
  var salesReturnModel = new models.salesReturn(req.body);
  salesReturnModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      models.order.findOneAndUpdate(
        { "transactionNumber": req.body.transactionNumber },
        {
          "whetherTake": "是",
          "salesReturn": "是"
        },
        function (err, orders) {
          console.log(orders);
          if (err) {
            res.send(false);
            console.log("find error");
          } else {
            models.vip.findOne(
              { "vipID": req.body.vipID },
              function (err, vips) {
                if (err) {
                  res.send(false);
                  console.log("find error");
                } else {
                  if (vips.length == 0) {
                    res.send(false);
                    console.log("会员查找出错")
                  } else {
                    vips.balance += Number(req.body.amount);
                    vips.save();
                    res.status(200).end("success");
                    console.log("取走成功")
                  }
                }
              }
            )
          }
        }
      )
    }
  })
})

// ------------------------------
// 撤销单子

// 查询是否存在该撤销单号
router.post('/getClothings/cancelOrder/validationOrder', (req, res) => {
  console.log(req.body)
  models.cancelOrder.find(
    { "cancelOrderNumber": req.body.cancelOrderNumber },
    function (err, orders) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (orders.length == 0) {
          res.send(true);
          console.log("还未存在该撤销单号")
        } else {
          res.send(false);
          console.log(orders);
          console.log("该撤销单号已存在");
        }
      }
    }
  )
})

// 撤销单子，添加撤销单
router.post('/getClothings/cancelOrder', (req, res) => {
  console.log(req.body)
  var cancelOrderModel = new models.cancelOrder(req.body);
  cancelOrderModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      models.order.findOneAndRemove(
        { "transactionNumber": req.body.transactionNumber },
        function (err, orders) {
          console.log(orders);
          if (err) {
            res.send(false);
            console.log("find error");
          } else {
            models.vip.findOne(
              { "vipID": req.body.vipID },
              function (err, vips) {
                if (err) {
                  res.send(false);
                  console.log("find error");
                } else {
                  if (vips.length == 0) {
                    res.send(false);
                    console.log("会员查找出错")
                  } else {
                    vips.totalConsumption = number_format(vips.totalConsumption - Number(req.body.payFee), 2, ".", ",", "round");
                    vips.numberOfConsumption--;
                    vips.balance += Number(req.body.payFee);
                    vips.save();
                    res.status(200).end("success");
                    console.log("取走成功")
                  }
                }
              }
            )
          }
        }
      )
    }
  })
})


// ----------------------------------------------
// 头部导航条

// 获取cookie中_id的用户名
router.post('/layout/navbar/getUsername', (req, res) => {
  console.log(req.body)
  models.user.find(
    {
      "_id": req.body.user_id,
    },
    "username",
    function (err, users) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (users.length == 0) {
          res.send(false);
          console.log("")
        } else {
          res.send(users[0]);
          console.log(users);
          console.log("");
        }
      }
    }
  )
})

// 修改密码
router.post('/layout/changePassword', (req, res) => {
  console.log(req.body);
  models.user.findOne(
    {
      "_id": req.body.user_id,
      "password": req.body.oldPassword
    },
    function (err, users) {
      console.log(users);
      if (err) {
        res.send(false);
        console.log("find error");
      } else if (users) {
        users.password = req.body.newPassword;
        users.save();
        res.send(true);
        console.log("修改成功")
      } else {
        res.send(false);
      }
    }

  )
})


// ----------------------
// 用户反馈建议
router.post('/userFeedback', (req, res) => {
  console.log(req.body)
  var userFeedbackModel = new models.userFeedback(req.body);
  userFeedbackModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).send(true);
      console.log("建议保存成功")
    }
  })
})

// 获取用户反馈建议
router.post('/getUserFeedback', (req, res) => {
  console.log(req.body);
  models.userFeedback.find(
    function (err, userFeedbacks) {
      console.log(userFeedbacks);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(userFeedbacks);
        res.send(userFeedbacks);
      }
    }
  )
})

// 获取某用户反馈建议
router.post('/geOnetUserFeedback', (req, res) => {
  console.log(req.body);
  models.userFeedback.find(
    { username: req.body.username },
    function (err, userFeedbacks) {
      console.log(userFeedbacks);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(userFeedbacks);
        res.send(userFeedbacks);
      }
    }
  )
})


// 回复某反馈记录
router.post('/feedbackManagement/repFeedback', (req, res) => {
  console.log(req.body)
  models.userFeedback.findOneAndUpdate(
    {
      username: req.body.username,
      date: req.body.date,
      feedback: req.body.feedback
    },
    { reply: req.body.reply },
    function (err) {
      if (err) {
        res.end("数据库查找删除错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("更新成功");
      }
    }
  )
})


// 删除某反馈记录
router.post('/feedbackManagement/delFeedback', (req, res) => {
  console.log(req.body)
  models.userFeedback.findOneAndRemove(
    req.body,
    function (err) {
      if (err) {
        res.end("数据库查找删除错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("删除成功");
      }
    }
  )
})

// ------------------------------------
// 添加系统公告
router.post('/notice', (req, res) => {
  console.log(req.body)
  var noticeModel = new models.notice(req.body);
  noticeModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).send(true);
      console.log("公告保存成功")
    }
  })
})

// 获取系统公告
router.post('/getNotice', (req, res) => {
  models.notice.find(
    function (err, notices) {
      console.log(notices);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(notices);
        res.send(notices);
      }
    }
  )
})

// 删除某公告记录
router.post('/notice/delNotice', (req, res) => {
  console.log(req.body)
  models.notice.findOneAndRemove(
    req.body,
    function (err) {
      if (err) {
        res.end("数据库查找删除错误");
        console.log("find error");
      } else {
        res.send(true);
        console.log("删除成功");
      }
    }
  )
})



// -------------------------------------
// 个人信息
// 用户个人信息中加载用户信息
router.post('/getUserInfo', (req, res) => {
  console.log(req.body)
  models.user.find(
    {
      "_id": req.body.user_id,
    },
    function (err, users) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (users.length == 0) {
          res.send(false);
          console.log("")
        } else {
          res.send(users[0]);
          console.log(users);
          console.log("");
        }
      }
    }
  )
})

// 申请会员
router.post('/userInfo/applyVip', (req, res) => {
  console.log(req.body)
  var applyVipModel = new models.applyVip(req.body);
  applyVipModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).send(true);
      console.log("会员申请保存成功")
    }
  })
})

// 获取会员申请列表
router.post('/getApplyVip', (req, res) => {
  models.applyVip.find(
    function (err, applyVips) {
      console.log(applyVips);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(applyVips);
        res.send(applyVips);
      }
    }
  )
})

// 更新审核状况
router.post('/setApplyVip', (req, res) => {
  models.applyVip.findOneAndUpdate(
    {
      username: req.body.username
    },
    { ispass: "通过" },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
        console.log("更新成功");
      }
    }
  )
})


// 更新用户会员卡号
router.post('/setUserInVip', (req, res) => {
  console.log(req.body)
  models.user.findOneAndUpdate(
    {
      username: req.body.username
    },
    { vipID: req.body.vipID },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
        console.log("更新成功");
      }
    }
  )
})

// 更新拒绝理由和审核状态
router.post('/setReason', (req, res) => {
  models.applyVip.findOneAndUpdate(
    {
      username: req.body.username
    },
    {
      reason: req.body.reason,
      ispass: "拒绝",
      read: 1
    },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
        console.log("更新成功");
      }
    }
  )
})

// 挂载个人信息时，加载他的会员信息
router.post('/getVipInfo', (req, res) => {
  console.log(req.body);
  models.vip.find(
    { vipID: req.body.vipID },
    function (err, vips) {
      if (err) {
        res.end("数据库查找错误");
        console.log("find error");
      } else {
        if (vips.length == 0) {
          res.end(false);
          console.log("集合为空")
        } else {
          console.log(vips);
          res.send(vips[0]);
          console.log("vips发回前端");
        }
      }
    }
  )
})

// -------------------------------------
// 会员申请添加衣物
// 添加衣物订单，并去更新用户的信息，如余额.等
router.post('/collectionClothings/ApplyAddClothes', (req, res) => {
  console.log(req.body)
  var orderModel = new models.orderApply(req.body);
  orderModel.save(function (error, response) {
    if (error) {
      res.end("no");
      console.log("error" + error);
      console.log(response);
    } else {
      models.vip.findOne(
        { "vipID": req.body.vipID },
        function (err, vips) {
          if (err) {
            res.send(false);
            console.log("find error");
          } else {
            if (vips.length == 0) {
              res.send(false);
              console.log("会员查找出错")
            } else {
              vips.totalConsumption = number_format(vips.totalConsumption + Number(req.body.amountReceivable), 2, ".", ",", "round");

              // vips.totalConsumption += Number(req.body.amountReceivable);
              vips.numberOfConsumption++;
              if (req.body.paymentMethod == "卡内余额") {
                vips.balance -= Number(req.body.amountReceivable);
              }
              vips.save();
              res.send(`${vips.balance}`);
              console.log(vips)
              console.log("更新成功");
            }
          }
        }
      )
    }
  })
})

// 获取会员申请添加衣物列表
router.post('/getApplyAddClothes', (req, res) => {
  models.orderApply.find(
    function (err, orderApplys) {
      console.log(orderApplys);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(orderApplys);
        res.send(orderApplys);
      }
    }
  )
})

// 同意会员添加衣物申请，并放入洗衣单集合中
router.post('/applyAddClothes/addClothes', (req, res) => {
  console.log(req.body)
  var orderModel = new models.order(req.body);
  orderModel.save(function (error) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).send(true);
      console.log("洗衣单添加成功")
    }
  })
})

// 拒绝申请添加衣物，并撤销单子
router.post('/applyAddClothes/cancelOrder', (req, res) => {
  console.log(req.body)
  models.orderApply.findOneAndRemove(
    { "transactionNumber": req.body.transactionNumber },
    function (err, orders) {
      console.log(orders);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        models.vip.findOne(
          { "vipID": req.body.vipID },
          function (err, vips) {
            if (err) {
              res.send(false);
              console.log("find error");
            } else {
              if (vips.length == 0) {
                res.send(false);
                console.log("会员查找出错")
              } else {
                vips.totalConsumption = number_format(vips.totalConsumption - Number(req.body.amountReceivable), 2, ".", ",", "round");
                vips.numberOfConsumption--;
                vips.balance += Number(req.body.amountReceivable);
                vips.save();
                res.status(200).end("success");
                console.log("取走成功")
              }
            }
          }
        )
      }
    }
  )
})

// ---------------------
// 系统设置-基础资料设置

// 衣服名称设置
// 加载全部衣服名称集合
router.post('/clothesName/loadAll', (req, res) => {
  models.clothesName.find(
    function (err, clothesNames) {
      console.log(clothesNames);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(clothesNames);
        res.send(clothesNames);
      }
    }
  )
})

// 查询是否存在某衣服名称
router.post('/clothesName/CNValidate', (req, res) => {
  models.clothesName.find(
    { "type": req.body.type },
    function (err, clothesNames) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothesNames.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加衣服名称
router.post('/clothesName/addClothesName', (req, res) => {
  var CAModel = new models.clothesName(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改衣服名称
router.post('/clothesName/editClothesName', (req, res) => {
  models.clothesName.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, clothesNames) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothesNames.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除衣服名称
router.post('/clothesName/deleteClothesName', (req, res) => {
  models.clothesName.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})

// 衣服附件设置
// 加载全部衣服附件集合
router.post('/clothingAccessories/loadAll', (req, res) => {
  models.clothingAccessories.find(
    function (err, clothingAccessoriess) {
      console.log(clothingAccessoriess);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(clothingAccessoriess);
        res.send(clothingAccessoriess);
      }
    }
  )
})

// 查询是否存在某衣服附件
router.post('/clothingAccessories/CAValidate', (req, res) => {
  models.clothingAccessories.find(
    { "type": req.body.type },
    function (err, clothingAccessoriess) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingAccessoriess.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加衣物附件
router.post('/clothingAccessories/addClothingAccessories', (req, res) => {
  var CAModel = new models.clothingAccessories(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改衣物附件
router.post('/clothingAccessories/editClothingAccessories', (req, res) => {
  models.clothingAccessories.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, clothingAccessoriess) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingAccessoriess.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除衣物附件
router.post('/clothingAccessories/deleteClothingAccessories', (req, res) => {
  models.clothingAccessories.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})


// 衣服瑕疵设置
// 加载全部衣服瑕疵集合
router.post('/clothingBlemishes/loadAll', (req, res) => {
  models.clothingBlemishes.find(
    function (err, clothingBlemishess) {
      console.log(clothingBlemishess);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(clothingBlemishess);
        res.send(clothingBlemishess);
      }
    }
  )
})

// 查询是否存在某衣服瑕疵
router.post('/clothingBlemishes/CBValidate', (req, res) => {
  models.clothingBlemishes.find(
    { "type": req.body.type },
    function (err, clothingBlemishess) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingBlemishess.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加衣物瑕疵
router.post('/clothingBlemishes/addClothingBlemishes', (req, res) => {
  var CAModel = new models.clothingBlemishes(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改衣物瑕疵
router.post('/clothingBlemishes/editClothingBlemishes', (req, res) => {
  models.clothingBlemishes.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, clothingBlemishess) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingBlemishess.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除衣物瑕疵
router.post('/clothingBlemishes/deleteClothingBlemishes', (req, res) => {
  models.clothingBlemishes.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})


// 衣服品牌设置
// 加载全部衣服品牌集合
router.post('/clothingBrand/loadAll', (req, res) => {
  models.clothingBrand.find(
    function (err, clothingBrands) {
      console.log(clothingBrands);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(clothingBrands);
        res.send(clothingBrands);
      }
    }
  )
})

// 查询是否存在某衣服品牌
router.post('/clothingBrand/CBValidate', (req, res) => {
  models.clothingBrand.find(
    { "type": req.body.type },
    function (err, clothingBrands) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingBrands.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加衣物品牌
router.post('/clothingBrand/addClothingBrand', (req, res) => {
  var CAModel = new models.clothingBrand(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改衣物品牌
router.post('/clothingBrand/editClothingBrand', (req, res) => {
  models.clothingBrand.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, clothingBrands) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothingBrands.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除衣物品牌
router.post('/clothingBrand/deleteClothingBrand', (req, res) => {
  models.clothingBrand.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})

// 洗衣类型设置
// 加载全部洗衣类型集合
router.post('/laundryType/loadAll', (req, res) => {
  models.laundryType.find(
    function (err, laundryTypes) {
      console.log(laundryTypes);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(laundryTypes);
        res.send(laundryTypes);
      }
    }
  )
})

// 查询是否存在某洗衣类型
router.post('/laundryType/LTValidate', (req, res) => {
  models.laundryType.find(
    { "type": req.body.type },
    function (err, laundryTypes) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (laundryTypes.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加洗衣类型
router.post('/laundryType/addLaundryType', (req, res) => {
  var CAModel = new models.laundryType(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改洗衣类型
router.post('/laundryType/editLaundryType', (req, res) => {
  models.laundryType.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, laundryTypes) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (laundryTypes.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除洗衣类型
router.post('/laundryType/deleteLaundryType', (req, res) => {
  models.laundryType.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})

// 付款方式设置
// 加载全部付款方式集合
router.post('/paymentMethods/loadAll', (req, res) => {
  models.paymentMethods.find(
    function (err, paymentMethodss) {
      console.log(paymentMethodss);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(paymentMethodss);
        res.send(paymentMethodss);
      }
    }
  )
})

// 查询是否存在某付款方式
router.post('/paymentMethods/PMValidate', (req, res) => {
  models.paymentMethods.find(
    { "type": req.body.type },
    function (err, paymentMethodss) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (paymentMethodss.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加付款方式
router.post('/paymentMethods/addPaymentMethods', (req, res) => {
  var CAModel = new models.paymentMethods(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改付款方式
router.post('/paymentMethods/editPaymentMethods', (req, res) => {
  models.paymentMethods.findOneAndUpdate(
    { "type": req.body.oldType },
    { "type": req.body.type },
    function (err, paymentMethodss) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (paymentMethodss.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除付款方式
router.post('/paymentMethods/deletePaymentMethods', (req, res) => {
  models.paymentMethods.findOneAndRemove(
    { "type": req.body.type },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})


// -------------------------
// 系统设置-衣物价格设置

// 加载全部衣服价格集合 
router.post('/clothesPrice/loadAll', (req, res) => {
  models.clothesPrice.find(
    function (err, clothesPrices) {
      console.log(clothesPrices);
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        console.log(clothesPrices);
        res.send(clothesPrices);
      }
    }
  )
})

// 查询是否存在某衣服价格
router.post('/clothesPrice/CPValidate', (req, res) => {
  models.clothesPrice.find(
    {
      "clothesName": req.body.clothesName,
      "laundryType": req.body.laundryType
    },
    function (err, clothesPrices) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothesPrices.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 添加衣服价格
router.post('/clothesPrice/addClothesPrice', (req, res) => {
  var CAModel = new models.clothesPrice(req.body);
  CAModel.save(function (error, response) {
    if (error) {
      console.log("error" + error);
    } else {
      res.status(200).end("success");
      console.log(response);
    }
  })
})

// 修改衣服价格
router.post('/clothesPrice/editClothesPrice', (req, res) => {
  models.clothesPrice.findOneAndUpdate(
    {
      "clothesName": req.body.clothesName,
      "laundryType": req.body.laundryType
    },
    req.body,
    function (err, clothesPrices) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothesPrices.length == 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  )
})

// 删除衣服价格
router.post('/clothesPrice/deleteClothesPrice', (req, res) => {
  models.clothesPrice.findOneAndRemove(
    {
      "clothesName": req.body.clothesName,
      "laundryType": req.body.laundryType
    },
    function (err) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        res.send(true);
      }
    }
  )
})

// 查询某衣服的价格
router.post('/clothesPrice/onePrice', (req, res) => {
  models.clothesPrice.find(
    {
      "clothesName": req.body.clothesName,
      "laundryType": req.body.laundryType
    },
    "originalPrice",
    function (err, clothesPrices) {
      if (err) {
        res.send(false);
        console.log("find error");
      } else {
        if (clothesPrices.length == 0) {
          res.send(false);
        } else {
          res.send(clothesPrices);
        }
      }
    }
  )
})





router.post('/timer', (req, res) => {
  res.end(`${codeSecond}`);
})

module.exports = router