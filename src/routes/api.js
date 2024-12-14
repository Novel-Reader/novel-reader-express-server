const express = require("express");
const multer = require('multer');
const ApiComment = require('./api-comment');
const ApiAdmin = require('./api-admin');
const ApiNovel = require('./api-novel');
const ApiUser = require('./api-user');
const ApiLogin = require('./api-login');
const ApiUserBook = require('./api-user-book');

const router = express.Router();

// 获取 POST 请求中的 formData 数据，可以使用 multer 中间件
const upload = multer();

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
router.get("/novel-detail", ApiNovel.getNovelDetail);

// upload.none() 表示不处理文件上传，只处理表单数据
// upload.single('file') 表示处理一个名为 file 的文件字段
// upload.array('files', 10) 表示允许上传最多 10 个文件，文件字段名称为 files
router.post("/batch-upload-novel", upload.array('files', 10), ApiNovel.batchUploadNovel);

router.post("/comment", ApiComment.postComment);
router.get("/comment", ApiComment.getComment);
router.put("/comment", ApiComment.updateComment);
router.delete("/comment", ApiComment.deleteComment);

router.get("/admin/users", ApiAdmin.getUsers);
router.get("/admin/books", ApiAdmin.getBooks);
router.get("/admin/comments", ApiAdmin.getComments);

router.get("/user-book", ApiUserBook.getUserBookList);
router.post("/user-book", ApiUserBook.updateUserBook);
router.delete("/user-book", ApiUserBook.deleteUserBook);

module.exports = router;
