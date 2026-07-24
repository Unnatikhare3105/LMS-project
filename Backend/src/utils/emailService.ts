import nodemailer, { Transporter } from 'nodemailer';
import config from '../config/config';
import logger from './logger';

let transporter: Transporter;

const getTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: config.SMTP_SERVICE,
      auth: {
        user: config.SMTP_MAIL,
        pass: config.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
};

export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  const transport = getTransporter();
  try {
    const info = await transport.sendMail({
      from: `"LearnAI" <${config.SMTP_MAIL}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
  } catch (err: any) {
    logger.error(`Email failed to ${to}: ${err.message}`);
    throw err;
  }
};

export const buildOTPEmail = (code: number): string => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa;">
  <h2 style="color:#4f46e5;text-align:center;margin-bottom:8px;">Verification Code</h2>
  <p style="color:#374151;font-size:15px;">Use the code below to verify your identity. It expires in <strong>10 minutes</strong>.</p>
  <div style="text-align:center;margin:24px 0;">
    <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;padding:12px 28px;border:2px dashed #4f46e5;border-radius:8px;background:#eef2ff;">
      ${code}
    </span>
  </div>
  <p style="color:#6b7280;font-size:13px;">If you did not request this, please ignore this email.</p>
  <footer style="margin-top:24px;text-align:center;font-size:12px;color:#9ca3af;">
    LearnAI Platform · Automated message, do not reply.
  </footer>
</div>
`;