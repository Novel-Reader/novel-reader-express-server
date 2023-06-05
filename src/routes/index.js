const express = require('express');
const router = express.Router();
const DBHelper = require('../utils/db-helper');
const { setToken } = require('../utils/token');
const logger = require('../utils/logger');

// 用于后端开发时，直接渲染单页面
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Genshin novel reader' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: null });
});

router.get('/registor', function(req, res, next) {
  res.render('registor');
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});

router.get('/home', function(req, res, next) {
  res.render('home', { token: null });
});

// 后面处理请求

// 用于后台管理员发送请求
router.post('/login', function(req, res, next) {
  const { email, password } = req.body;
  const sql = `SELECT * FROM user WHERE email=? and password=?`;
  // 现在直接返回去请求参数，应该是 redirect to 对应的界面，然后渲染信息
  // form 提交确实是单相页面，不支持获取返回值。如果需要获取返回值，那么需要使用 ajax 发送请求实现
  // 或者改成重新渲染界面，这样需要路由一样
  DBHelper(sql, (err, results) => {
    if (err) {
      // database return error, maybe not connect db
      if (err.sqlMessage) {
        logger.error(err.sqlMessage);
        // res.status(500).send({ error_massage: err.sqlMessage });
        res.render('login', { error: err.sqlMessage });
        return;
      }
      logger.error(err);
      // res.status(500).send({ error_massage: err });
      res.render('login', { error: String(err) });
      return;
    }
    if (results.length === 0) {
      res.render('login', { error: 'Email or password is not correct' });
      // res.status(400).send({ error_massage: 'Email or password is not correct' });
      return;
    }
    setToken(email).then((data) => {
      // redirect to home page(管理员主页)
      res.redirect('home', { token: data });
      return;
    });
  }, [email, password]);
});

module.exports = router;
