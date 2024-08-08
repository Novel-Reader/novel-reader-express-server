const DBHelper = require("../utils/db-helper");
const logger = require("../utils/logger");
const { setToken } = require("../utils/token");

class ApiLogin {
  static login(req, res, next) {
    const { email, password } = req.body;
    const sql = `SELECT * FROM user WHERE email=? and password=?`;
    DBHelper(
      sql,
      (err, results) => {
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
          res
            .status(400)
            .send({ error_massage: "Email or password is not correct" });
          return;
        }
        setToken(email).then((data) => {
          res.status(200).json({ token: data });
        });
      },
      [email, password]
    );
  }

  // TODO logout
  // 删除本地 token，服务器怎么设置某个 token 失效？
  // 代码案例中，用户退出登录的实现都是清除了浏览器端保存的token信息，本质上并不是让token失效
  // Token强制失效的方案
  // 1、在服务器端建立黑名单，保存强制失效的token，这样服务器就可以通过查询黑名单来禁止强制失效token正常工作了。
  // 该方案违背了token的初衷，token初衷是实现服务器端无状态保存，现在虽然不保存登录状态，但是却要保存黑名单token，依旧会给集群服务器带来管理压力。
}

module.exports = ApiLogin;
