const jwt = require("jsonwebtoken");

module.exports = (user, secret, expiresIn) => {
  const { id, fullName, email } = user;

  return jwt.sign({ id, fullName, email }, secret, { expiresIn });
};
