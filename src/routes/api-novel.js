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

  static batchUploadNovel(req, res) {
    const files = req.files;
    try {
      const fileContents = files.map(file => file.buffer.toString('utf8'));    
      const fileNames = files.map(file => {
        if (file.encoding === 'utf-8') {
          return file.originalname;
        }
        // 格式 7bit 编码格式是 ASCII 编码格式的一个子集，用于表示 ASCII 字符集中的字符，需要 'latin1'转换
        else if (file.encoding === '7bit') {
          return Buffer.from(file.originalname, 'latin1').toString('utf8');
        }
        else if (file.encoding === 'binary') {
          return Buffer.from(file.originalname, 'binary').toString('utf8');
        }
        else if (file.encoding === 'gbk' || file.encoding === 'gb2312') {
          return Buffer.from(file.originalname, file.encoding).toString('utf8');
        }
      });
      const cover_photo = "https://www.baidu.com/img/flexible/logo/pc/result@2.png"; // use default book image
      const author = "佚名";
      const price = 0;
      const size = 1;
      const tag = "";
      const briefs = fileContents.map(item => item.slice(0, 300));
      // 在 MariaDB 中，你可以使用以下方法来插入多条数据：使用单个 INSERT INTO 语句，多个 VALUES 子句：
      // INSERT INTO book (name, cover_photo, author, detail, price, brief, size, tag) VALUES (), ()
      let sql = 'INSERT INTO book (name, cover_photo, author, detail, price, brief, size, tag) VALUES';
      let data = [];
      for (let i = 0; i < fileNames.length; i++) {
        if (i === fileNames.length - 1) {
          sql += `(?, ?, ?, ?, ?, ?, ?, ?);`;
        } else {
          sql += `(?, ?, ?, ?, ?, ?, ?, ?),`;
        }
        data.push(fileNames[i], cover_photo, author, fileContents[i], price, briefs[i], size, tag);
      }
      DBHelper(sql, (err, results) => {
        if (err) {
          logger.error(err);
          res.status(400).send({ error_massage: err });
          return;
        }
        res.status(200).send("success");
      }, data);
    } catch (error) {
      logger.error(error);
      res.status(400).send({ error_massage: 'File upload failed, coding is not supported, please try again' });
    }
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
