const nodemailer = require("nodemailer");

const { MAILUSER, MAIL, MAILPASSWORD } = require("../config");

const transporter = nodemailer.createTransport({
  host: MAIL,
  port: 465,
  secure: true,
  auth: {
    user: MAILUSER,
    pass: MAILPASSWORD,
  },
});

module.exports = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const options = { from: MAIL_USER, to, subject, html };

    return transporter
      .sendMail(options)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
