const DBHelper = require("../utils/db-helper");
const logger = require("../utils/logger");

class ApiUser {

  static getUserInfo(req, res) {
    // TODO should not return password
    const email = req.query.email;
    const sql = `SELECT * FROM user WHERE email=?`;
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
      [email]
    );
  }

  static addUser(req, res) {
    const { email, name, password } = req.body;
    // verify user info must contain email, name and password
    if (!email || !name || !password) {
      res
        .status(400)
        .send({ error_massage: "Email, username or password is not correct" });
      return;
    }
    if (password.length < 6) {
      res.status(400).send({ error_massage: "Password is too short" });
      return;
    }
    let sql = `SELECT * FROM user WHERE email=?`;
    DBHelper(
      sql,
      (err, results) => {
        // exec error
        if (err) {
          logger.error(err);
          res.status(500).send({ error_massage: "Internal server error" });
          return;
        }
        if (results.length > 0) {
          res.status(400).send({ error_massage: "This email is used" });
          return;
        }
        // If can not find email in db, insert new email into db
        sql = `insert into user (name, email, password, avatar) values(?, ?, ?, ?)`;
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
          [
            name,
            email,
            password,
            "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
          ]
        );
      },
      [email]
    );
  }

  static deleteUser(req, res) {
    const email = req.query.email;
    const sql = `DELETE FROM user WHERE email=?`;
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
      [email]
    );
  }

  static changeUserPassword(req, res) {
    const { email, password } = req.body;
    const sql = `update user set password = ? where email = ?`;
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
      [password, email]
    );
  }

  static changeUserAvatar(req, res) {
    const { email, avatar } = req.body;
    const sql = `update user set avatar = ? where email = ?`;
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
      [avatar, email]
    );
  }
}

module.exports = ApiUser;
