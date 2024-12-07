const { expressjwt } = require("express-jwt");
const { SIGN_KEY } = require("../utils/constants");

const verifyTokenExpiresMiddleWare = expressjwt({
  secret: SIGN_KEY,
  algorithms: ["HS256"],
}).unless({
  // Specify which routes need not be verified. In addition to login or register, other URLs need to be verified
  path: ["/api/login", "/api/register"],
});

module.exports = verifyTokenExpiresMiddleWare;
