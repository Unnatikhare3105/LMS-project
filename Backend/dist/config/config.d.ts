declare const config: Readonly<{
    PORT: string | undefined;
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string | undefined;
    VERIFICATION_CODE_EXPIRES_IN: number;
    SMTP_HOST: string | undefined;
    SMTP_PORT: string | undefined;
    SMTP_SERVICE: string | undefined;
    SMTP_MAIL: string | undefined;
    SMTP_PASSWORD: string | undefined;
    SMTP_SECURE: boolean;
    REDIS_HOST: string | undefined;
    REDIS_PORT: string | undefined;
    REDIS_PASSWORD: string | undefined;
    YOUTUBE_API_KEY: string;
    groq_api_key: string;
    TWILIO_ACCOUNT_SID: string | undefined;
    TWILIO_AUTH_TOKEN: string | undefined;
    TWILIO_PHONE_NUMBER: string | undefined;
    MESSAGE_SID: string | undefined;
}>;
export default config;
//# sourceMappingURL=config.d.ts.map