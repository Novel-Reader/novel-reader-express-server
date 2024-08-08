const { verifyToken } = require("../utils/token");

function verifyTokenMiddleWare(req, res, next) {
  const token = req.headers.authorization;
  if (token === undefined) {
    return next();
  } else {
    verifyToken(token)
      .then((data) => {
        req.data = data;
        return next();
      })
      .catch((error) => {
        logger.error(error);
        return next();
      });
  }
}

module.exports = verifyTokenMiddleWare;
