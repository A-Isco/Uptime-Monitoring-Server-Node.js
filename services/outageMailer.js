const nodemailer = require("nodemailer");
require("dotenv").config();
const Check = require("../models/Check");
const Report = require("../models/Report");
const User = require("../models/User");

const sendOutageMail = async (check) => {
  const checkOwnerId = check.ownedBy;

  const ownerUser = await User.findOne({
    _id: checkOwnerId,
  }).select({ email: 1 });

  const ownerEmail = ownerUser.email;

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const content = {
    from: process.env.EMAIL_USERNAME,
    to: ownerEmail,
    subject: "Url Outage",
    text: `Outage was detected for your checkUrl: ${check.url} `,
  };

  transporter.sendMail(content, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(
      ` email sent :: checkUrl: ${check.url} , ownerEmail: ${ownerEmail}`
    );
  });
};

module.exports = { sendOutageMail };
