const express = require("express");
const ApiComment = require('./api-comment');
const ApiAdmin = require('./api-admin');
const ApiNovel = require('./api-novel');
const ApiUser = require('./api-user');
const ApiLogin = require('./api-login');

const router = express.Router();

// 127.0.0.1:8081/api/login/
router.post("/login", ApiLogin.login);
// router.post('/logout', ApiLogin.logout);

router.get("/user", ApiUser.getUserInfo);
router.post("/user", ApiUser.addUser);
router.delete("/user", ApiUser.deleteUser);
router.post("/user-password", ApiUser.changeUserPassword);
router.post("/user-avatar", ApiUser.changeUserAvatar);

router.post("/novel", ApiNovel.addNovel);
router.delete("/novel", ApiNovel.deleteNovel);
router.get("/novel_list", ApiNovel.getNovelList);
router.post("/search-novel", ApiNovel.searchNovel);
router.get("/search-novel", ApiNovel.getNovelDetail);

router.post("/comment", ApiComment.postComment);
router.get("/comment", ApiComment.getComment);
router.put("/comment", ApiComment.updateComment);
router.delete("/comment", ApiComment.deleteComment);

router.get("/admin/users", ApiAdmin.getUsers);
router.get("/admin/books", ApiAdmin.getBooks);
router.get("/admin/comments", ApiAdmin.getComments);

module.exports = router;
