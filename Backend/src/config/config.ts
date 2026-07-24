import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const _config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV ,
  CLIENT_URL: process.env.CLIENT_URL,

  DB_URL: process.env.DB_URL as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION ,
  VERIFICATION_CODE_EXPIRES_IN: Number(process.env.VERIFICATION_CODE_EXPIRES_IN) ,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  YOUTUBE_API_KEY: process.env.youtube_api_key as string,
  groq_api_key: process.env.groq_api_key as string,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  MESSAGE_SID: process.env.MESSAGE_SID,
};

const config = Object.freeze(_config);

export default config;
