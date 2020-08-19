const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const api = require('./api');
// const db = require('./db');
const app = express();

app.set('port', (process.env.port || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(api);

//allow custom header and CORS 处理跨域问题，修改请求头
app.all('*', function (req, res, next) {
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

// 监听端口
app.listen(app.get('port'), () => {
    console.log(`open on port ${app.get('port')}`);
});
