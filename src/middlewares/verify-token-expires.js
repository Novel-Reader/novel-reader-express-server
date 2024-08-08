const { expressjwt } = require("express-jwt");
const { SIGNKEY } = require("../utils/constants");

const verifyTokenExpiresMiddleWare = expressjwt({
  secret: SIGNKEY,
  algorithms: ["HS256"],
}).unless({
  // Specify which routes need not be verified. In addition to login or registor, other URLs need to be verified
  path: ["/api/login", "/api/registor"],
});

module.exports = verifyTokenExpiresMiddleWare;
