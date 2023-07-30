const express = require('express');
const moment = require('moment');
const router = express.Router();
const DBHelper = require('../utils/db-helper');
const { setToken } = require('../utils/token');
const logger = require('../utils/logger');

// 主要是这个文件
// 127.0.0.1:8081/api/login/
router.post('/login', function(req, res, next) {
  const { email, password } = req.body;
  const sql = `SELECT * FROM user WHERE email=? and password=?`;
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
    });
  }, [email, password]);
});

// TODO
// router.post('/logout'
// 删除本地 token，服务器怎么设置某个 token 失效？
// 代码案例中，用户退出登录的实现都是清除了浏览器端保存的token信息，本质上并不是让token失效

// Token强制失效的方案
// 1、在服务器端建立黑名单，保存强制失效的token，这样服务器就可以通过查询黑名单来禁止强制失效token正常工作了。
// 该方案违背了token的初衷，token初衷是实现服务器端无状态保存，现在虽然不保存登录状态，但是却要保存黑名单token，依旧会给集群服务器带来管理压力。


// get user info
router.get('/user', function (req, res) {
  // TODO should not return password
  const email = req.query.email;
  const sql = `SELECT * FROM user WHERE email=?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  }, [email]);
});

// add user
router.post('/user', function (req, res) {
  const { email, name, password } = req.body;
  // verify user info must contain email, name and password
  if (!email || !name || !password) {
    res.status(400).send({ error_massage: 'Email, username or password is not correct' });
    return;
  }
  if (password.length < 6) {
    res.status(400).send({ error_massage: 'Password is too short' });
    return;
  }
  let sql = `SELECT * FROM user WHERE email=?`;
  DBHelper(sql, (err, results) => {
    // exec error
    if (err) {
      logger.error(err);
      res.status(500).send({ error_massage: 'Internal server error' });
      return;
    }
    if (results.length > 0) {
      res.status(400).send({ error_massage: 'This emial is used' });
      return;
    }
    // If can not find email in db, insert new email into db
    sql = `insert into user (name, email, password, avatar) values(?, ?, ?, ?)`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      res.status(200).send('success');
    }, [name, email, password, 'https://www.baidu.com/img/flexible/logo/pc/result@2.png']);
  }, [email]);
});

router.delete('/user', function (req, res) {
  const email = req.query.email;
  const sql = `DELETE FROM user WHERE email=?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    logger.info(results);
    res.status(200).send('success');
  }, [email]);
});

router.post('/user-password', function (req, res) {
  const { email, password } = req.body;
  const sql = `update user set password = ? where email = ?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send('success');
  }, [password, email]);
});

router.post('/user-avatar', function (req, res) {
  const { email, avatar } = req.body;
  const sql = `update user set avatar = ? where email = ?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send('success');
  }, [avatar, email]);
});

// list all user infos for admin
router.get('/users', function (req, res) {
  // check admin
  // TODO should not return password
  const sql = `SELECT * FROM user order by id asc`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  });
});

router.post('/novel', function (req, res) {
  let { name, cover_photo, author, detail, price, brief } = req.body;
  if (!cover_photo) {
    // use default book image
    cover_photo = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png';
  }
  if (!author) {
    author = '佚名';
  }
  if (!price) {
    price = 0;
  }
  if (!brief) {
    brief = detail.slice(0, 300);
  }
  const sql = `insert into book (name, cover_photo, author, detail, price, brief) values(?, ?, ?, ?, ?, ?)`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send('success');
  }, [name, cover_photo, author, detail, price, brief]);
});

router.delete('/novel', function (req, res) {
  const id = req.query.id;
  const sql = `DELETE FROM book WHERE id=?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    logger.info(results);
    res.status(200).send('success');
  }, [id]);
});

// get novel list for index page
router.get('/novel_list', function (req, res) {
  const sql = `SELECT id, name, cover_photo, author, brief, price FROM book limit 10`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  }, []);
});

// search novel and return 10 results
router.post('/search-novel', function (req, res) {
  const { name, author, price } = req.body;
  if (!name && !author && !price) {
    res.status(400).send({ error_massage: 'query parameters is null' });
  }
  let sql = `SELECT id, name, author, price, brief, cover_photo FROM book WHERE `;
  const params = [];
  const sql_list = [];
  if (name) {
    sql_list.push(' name LIKE ? ');
    params.push(`%${name}%`);
  }
  if (author) {
    sql_list.push(' author LIKE ? ');
    params.push(`%${author}%`);
  }
  if (price) {
    sql_list.push(' price=? ');
    params.push(price);
  }
  sql += sql_list.join('and');
  sql += ' limit 10';
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  }, params);
});

// get novel detail
router.get('/search-novel', function (req, res) {
  const id = req.query.id;
  const sql = `SELECT * from book WHERE id=?`;
  // TODO: Once per download, the database records the number of downloads (download hot list)
  // which also facilitates hotspot monitoring and early warning
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  }, [id]);
});

router.post('/comment', function (req, res) {
  let { book_id, detail, author } = req.body;
  if (!book_id) {
    res.status(400).send({ error_massage: 'book_id is required' });
  }
  // TODO 检查书籍是否存在
  // select * from book 先查询一下 book 是否存在
  const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
  const sql = `insert into comment (book_id, detail, author, created_at) values(?, ?, ?, ?)`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send('success');
  }, [book_id, detail, author, created_at]);
});

router.get('/comment', function (req, res) {
  const { book_id, start = 1, limit = 10 } = req.query;
  if (!book_id) {
    res.status(400).send({ error_massage: 'book_id is required' });
  }
  const sql = `SELECT id, author, detail, created_at FROM comment WHERE book_id=? limit ?, ?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send(results);
  }, [book_id, (start - 1) * limit, Number(limit)]);
});

router.put('/comment', function (req, res) {
  let { comment_id, detail } = req.body;
  if (!comment_id || !detail) {
    res.status(400).send({ error_massage: 'comment_id and detail are required' });
  }
  // TODO add column last updated times
  const sql = `update comment set detail = ? where id = ?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    res.status(200).send('success');
  }, [detail, comment_id]);
});

router.delete('/comment', function (req, res) {
  const comment_id = req.query.id;
  if (!comment_id) {
    res.status(400).send({ error_massage: 'comment_id is required' });
  }
  const sql = `DELETE FROM comment WHERE id=?`;
  DBHelper(sql, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).send({ error_massage: err });
      return;
    }
    logger.info(results);
    res.status(200).send('success');
  }, [comment_id]);
});

module.exports = router;
