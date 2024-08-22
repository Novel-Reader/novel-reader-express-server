const logger = require("../utils/logger");

const monitorMiddleware = (req, res, next) => {
  const { method, path: url } = req;

  let body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    body = Buffer.concat(body).toString();
    logger.info(`REQUEST: [${method}] ${url}`);
  });

  const send = res.send;
  res.send = (...args) => {
    const result = send.apply(res, args);
    const statusCode = res.statusCode;
    res.on("finish", () => {
      logger.info(`RESPONSE: [${method}]: ${url} Status: ${statusCode}`);
    });
    return result;
  };

  next();
};

module.exports = monitorMiddleware;
