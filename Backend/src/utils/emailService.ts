import nodemailer, { Transporter } from 'nodemailer';
import config from '@config/config';

const transporter: Transporter = nodemailer.createTransport({
  service: config.SMTP_SERVICE,
  auth: {
    user: config.SMTP_MAIL,
    pass: config.SMTP_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> => {
  const mailOptions = {
    from: config.SMTP_MAIL,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};