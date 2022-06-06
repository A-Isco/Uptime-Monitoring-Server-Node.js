const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationMail = (user) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const content = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Verification Code",
    text: `Verifiy your email using this code ${user.verificationCode}`,
  };

  transporter.sendMail(content, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Verification mail was sent");
  });
};

module.exports = { sendVerificationMail };
