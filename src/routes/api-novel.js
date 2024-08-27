const DBHelper = require("../utils/db-helper");
const logger = require("../utils/logger");
const { getValueFromRedis, setValueFromRedis } = require("../utils/redis-helper");

class ApiNovel {

  static addNovel(req, res) {
    let { name, cover_photo, author, detail, price, brief, size, tag } = req.body;
    // TODO optimize codes
    if (!cover_photo) {
      cover_photo = "https://www.baidu.com/img/flexible/logo/pc/result@2.png"; // use default book image
    }
    if (!author) {
      author = "佚名";
    }
    if (!price) {
      price = 0;
    }
    if (!brief) {
      brief = detail.slice(0, 300);
    }
    if (!size) {
      size = 1;
    }
    if (!tag) {
      tag = "";
    }
    const sql = `insert into book (name, cover_photo, author, detail, price, brief, size, tag) values(?, ?, ?, ?, ?, ?, ?, ?)`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      DBHelper('SELECT id, name FROM book ORDER BY id DESC LIMIT 1', (err2, results2) => {
        if (err2) {
          logger.error(err2);
          res.status(400).send({ error_massage: err });
          return;
        }
        res.status(200).send(results2);
      }, []);
    }, [name, cover_photo, author, detail, price, brief, size, tag]);
  }

  static deleteNovel(req, res) {
    const id = req.query.id;
    const sql = `DELETE FROM book WHERE id=?`;
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
      [id]
    );
  }

  // get novel list for index page
  static getNovelList(req, res) {
    const sql = `SELECT id, name, cover_photo, author, brief, price, size, tag, download_count FROM book ORDER BY download_count DESC limit 10`;
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
      []
    );
  }

  // search novel and return 10 results
  static searchNovel(req, res) {
    const { name, author, price } = req.body;
    if (!name && !author && !price) {
      res.status(400).send({ error_massage: "query parameters is null" });
    }
    let sql = `SELECT id, name, author, price, brief, cover_photo, size, tag FROM book WHERE `;
    const params = [];
    const sql_list = [];
    if (name) {
      sql_list.push(" name LIKE ? ");
      params.push(`%${name}%`);
    }
    if (author) {
      sql_list.push(" author LIKE ? ");
      params.push(`%${author}%`);
    }
    if (price) {
      sql_list.push(" price=? ");
      params.push(price);
    }
    sql += sql_list.join("and");
    sql += " limit 10";
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
      params
    );
  }

  // get novel detail
  static async getNovelDetail(req, res) {
    // 01 generate download info
    const { book_id, user_id } = req.query;
    const sql = `insert into download_info (userid, bookid) values(?, ?)`;
    await DBHelper(sql,(err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      // Count the download count of download_info table and write it into the book table
      if (results) {
        const sql = `update book set download_count = (select count(id) from download_info WHERE bookid=?) where id=?;`;
        DBHelper(sql,(err, results) => {
          if (err) {
            logger.error(err);
            res.status(400).send({ error_massage: err });
            return;
          }
        },[book_id, book_id]);
      }
    },[user_id, book_id]);
    // 02 get detail from redis, if not, get from mysql
    getValueFromRedis("book-" + book_id, (err, result) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      if (result) {
        res.status(200).send(JSON.parse(result));
        return;
      } else {
        const sql = `SELECT * from book WHERE id=?`;
        DBHelper(
          sql,
          (err, results) => {
            if (err) {
              logger.error(err);
              res.status(400).send({ error_massage: err });
              return;
            }
            setValueFromRedis("book-" + book_id, JSON.stringify(results));
            res.status(200).send(results);
          },
          [book_id]
        );
      }
    });
  }

}

module.exports = ApiNovel;
