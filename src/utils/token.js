const jwt = require("jsonwebtoken");
const { SIGN_KEY } = require("./constants");

const setToken = function (email) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ name: email }, SIGN_KEY, { expiresIn: "1h" });
    resolve(token);
  });
};

const verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    const info = jwt.verify(token.split(" ")[1], SIGN_KEY);
    resolve(info);
  });
};

export { setToken, verifyToken };
