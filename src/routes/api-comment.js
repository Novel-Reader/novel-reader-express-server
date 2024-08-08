const DBHelper = require("../utils/db-helper");
const logger = require("../utils/logger");

class ApiComment {

  static getComment(req, res) {
    const { book_id, start = 1, limit = 10 } = req.query;
    if (!book_id) {
      res.status(400).send({ error_massage: "book_id is required" });
    }
    const sql = `SELECT id, author, detail, created_at FROM comment WHERE book_id=? limit ?, ?`;
    DBHelper(
      sql,
      (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ error_massage: err });
          return;
        }
        res.status(200).send(results);
      },
      [book_id, (start - 1) * limit, Number(limit)]
    );
  }

  static postComment(req, res) {
    let { book_id, detail, author } = req.body;
    if (!book_id) {
      res.status(400).send({ error_massage: "book_id is required" });
    }
    // TODO 检查书籍是否存在
    // select * from book 先查询一下 book 是否存在
    const sql = `insert into comment (book_id, detail, author, created_at) values(?, ?, ?, ?)`;
    // 注：mysql 使用 NOW() 生成的时间是数据库的时间，nodejs 使用 new Date() 生成的是当前服务器的时间，可能不一样。所以这里用 nodejs 服务器时间
    const t = new Date();
    DBHelper(
      sql,
      (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ error_massage: err });
          return;
        }
        res.status(200).send("success");
      },
      [book_id, detail, author, t]
    );
  }

  static updateComment(req, res) {
    let { comment_id, detail } = req.body;
    if (!comment_id || !detail) {
      res
        .status(400)
        .send({ error_massage: "comment_id and detail are required" });
    }
    // TODO add column last updated times
    const sql = `update comment set detail = ? where id = ?`;
    DBHelper(
      sql,
      (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ error_massage: err });
          return;
        }
        res.status(200).send("success");
      },
      [detail, comment_id]
    );
  }

  static deleteComment(req, res) {
    const comment_id = req.query.id;
    if (!comment_id) {
      res.status(400).send({ error_massage: "comment_id is required" });
    }
    const sql = `DELETE FROM comment WHERE id=?`;
    DBHelper(
      sql,
      (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ error_massage: err });
          return;
        }
        logger.info(results);
        res.status(200).send("success");
      },
      [comment_id]
    );
  }

}

module.exports = ApiComment;
