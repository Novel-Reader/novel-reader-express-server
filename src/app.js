const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { expressjwt } = require("express-jwt");
const logger = require('./utils/logger');
const { verifyToken } = require('./utils/token');
const { SIGNKEY } = require('./utils/constants');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
// const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// handle POST request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// handle static public import path
app.use(express.static(path.join(__dirname, 'public')));

// 这两个用于后台登录，不需要执行跨域（如果放在跨域后面，返回值解析不正确）
app.use('/', indexRouter);
// app.use('/admin', adminRouter);

// handle browser cross origin
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Headers", "content-type,Authorization");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 这个用于前端项目发送请求，需要处理跨域
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// verify token
app.use(function (req, res, next) {
  const token = req.headers.authorization;
  if (token === undefined) {
    return next();
  } else {
    verifyToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      logger.error(error);
      return next();
    });
  }
});

// verify token expires
app.use(expressjwt({
  secret: SIGNKEY,
  algorithms: ["HS256"]
}).unless({
  // Specify which routes need not be verified. In addition to login or registor, other URLs need to be verified
  path: ['/api/login', '/api/registor']
}));

// When token fails, return 401 error
app.use(function (err, req, res, next) {
  if (err) {
    logger.info(err);
    if (err.status === 401) {
      return res.status(401).send('Token is invalid');
    }
  }
});

module.exports = app;
