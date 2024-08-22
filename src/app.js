const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const pingRouter = require("./routes/ping");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const crossOriginMiddleWare = require("./middlewares/cross-origin");
const errorHandlerMiddleWare = require("./middlewares/error-handler");
const verifyTokenMiddleWare = require("./middlewares/verify-token");
const verifyTokenExpiresMiddleWare = require("./middlewares/verify-token-expires");
const monitorMiddleWare = require("./middlewares/monitor");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// handle POST request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// handle static public import path
app.use(express.static(path.join(__dirname, "public")));

app.all("*", crossOriginMiddleWare);
app.use(monitorMiddleWare);

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandlerMiddleWare);
app.use(verifyTokenMiddleWare);
app.use(verifyTokenExpiresMiddleWare);

// When token fails, return 401 error
app.use(function (err, req, res, next) {
  if (err) {
    logger.info(err);
    if (err.status === 401) {
      return res.status(401).send("Token is invalid");
    }
  }
});

module.exports = app;
