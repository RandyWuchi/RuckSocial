const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

module.exports = (token) => {
  return new Promise(async (resolve, reject) => {
    const authUser = await jwt.verify(token, SECRET_KEY);

    if (authUser) {
      resolve(authUser);
    } else {
      reject("Couldn't authenticate user");
    }
  });
};
