import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: config.SMTP_SERVICE,
  auth: {
    user: config.SMTP_MAIL,
    pass: config.SMTP_PASSWORD,
  },
});

export const sendMail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: config.SMTP_MAIL,
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log("error in mail->", err);
    console.log("info->", info);
  });
};