const crypto = require("crypto");

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  createToken,
};
