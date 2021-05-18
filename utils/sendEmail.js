const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;




// Using node mailer with Gmail

// const nodeMailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// const defaultEmailData = { from: "noreply@tradeward.com" };

// email data (from controllers/auth)
// const emailData = {
//     from: "noreply@Gather.com",
//     to: email,
//     subject: "Password Reset Instructions",
//     text: `Please use the following link to reset your password: ${
//         process.env.CLIENT_URL
//     }/reset-password/${token}`,
//     html: `<p>Please use the following link to reset your password:</p> <p>${
//         process.env.CLIENT_URL
//     }/reset-password/${token}</p>`
// };

// exports.sendEmail = (emailData) => {
//   const transporter = nodeMailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: process.env.FROM_EMAIL,
//       pass: process.env.APP_PASSWORD,
//     },
//   });
//   return transporter
//     .sendMail(emailData)
//     .then((info) => console.log(`Message sent: ${info.response}`))
//     .catch((err) => console.log(`Problem sending email: ${err}`));
// };
