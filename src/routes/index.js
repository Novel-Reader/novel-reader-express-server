const express = require("express");
const router = express.Router();

// 目前不需要支持直接后端登录，这个暂时放在这里，不使用
router.get("/", function (req, res, next) {
  res.render("index", { title: "Genshin novel reader" });
});

router.post("/", function (req, res, next) {
  res.render("index", { title: "Genshin novel reader" });
});

// login
// TODO: add session
router.get("/login", function (req, res, next) {
  res.render("login");
});

// register
router.get("/register", function (req, res, next) {
  res.render("register");
});

// logout
router.get("/logout", function (req, res, next) {
  res.render("logout");
});

module.exports = router;
