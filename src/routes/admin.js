const express = require('express');
const router = express.Router();
const DBHelper = require('../utils/db-helper');
const { setToken } = require('../utils/token');
const logger = require('../utils/logger');

// 用于后台管理员发送请求
router.post('/login', function(req, res, next) {
  const { email, password } = req.body;
  const sql = `SELECT * FROM user WHERE email=? and password=?`;
  // 现在直接返回去请求参数，应该是 redirect to 对应的界面，然后渲染信息
  DBHelper(sql, (err, results) => {
    if (err) {
      // database return error, maybe not connect db
      if (err.sqlMessage) {
        logger.error(err.sqlMessage);
        res.status(500).send({ error_massage: err.sqlMessage });
        return;
      }
      logger.error(err);
      res.status(500).send({ error_massage: err });
      return;
    }
    if (results.length === 0) {
      res.status(400).send({ error_massage: 'Email or password is not correct' });
      return;
    }
    setToken(email).then((data) => {
      res.status(200).json({ token: data });
      return;
    });
  }, [email, password]);
});

module.exports = router;
