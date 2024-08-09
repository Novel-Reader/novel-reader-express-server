const DBHelper = require("../utils/db-helper");
const logger = require("../utils/logger");

class ApiUserBook {

  static getUserBookList(req, res) {
    const { user_id } = req.query;
    const sql = `SELECT * FROM book b, user_book ub WHERE ub.userid=? and ub.bookid=b.id;`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      res.status(200).send(results);
    }, [user_id]);
  }

  static updateUserBook(req, res) {
    const { user_id, book_id } = req.body;
    const sql = `insert into user_book (userid, bookid) values(?, ?)`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      res.status(200).send("success");
    }, [user_id, book_id]);
  }

  static deleteUserBook(req, res) {
    const { user_id, book_id } = req.query;
    const sql = `DELETE FROM user_book WHERE userid=? and bookid=?`;
    DBHelper(sql, (err, results) => {
      if (err) {
        logger.error(err);
        res.status(400).send({ error_massage: err });
        return;
      }
      res.status(200).send("success");
    }, [user_id, book_id]);
  }
}

module.exports = ApiUserBook;
