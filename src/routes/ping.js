const express = require("express");
const router = express.Router();

// 测试服务器 API
router.get("/", function (req, res, next) {
  res.send("pong");
});

router.post("/", function (req, res, next) {
  res.send("pong");
});

module.exports = router;
