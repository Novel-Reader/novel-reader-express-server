const express = require('express');
const router = express.Router();

// 用于后端开发时，直接渲染单页面
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Genshin novel reader' });
});

// login
// TODO: add session
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/registor', function(req, res, next) {
  res.render('registor');
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});

module.exports = router;
