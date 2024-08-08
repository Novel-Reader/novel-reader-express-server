function crossOriginMiddleWare(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Headers", "content-type,Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
}

module.exports = crossOriginMiddleWare;
