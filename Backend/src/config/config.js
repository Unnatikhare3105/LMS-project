import dotenv from 'dotenv';
dotenv.config();

const _config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  VERIFICATION_CODE_EXPIRES_IN: process.env.VERIFICATION_CODE_EXPIRES_IN,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_SECURE: process.env.SMTP_SECURE,

  REDIS_HOST : process.env.REDIS_HOST,
  REDIS_PORT:process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  youtube_api_key: process.env.youtube_api_key,

  google_gemini_api_key: process.env.google_gemini_api_key,
  
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  MESSAGE_SID:process.env.MESSAGE_SID
  
}

const config = Object.freeze(_config);

export default config;