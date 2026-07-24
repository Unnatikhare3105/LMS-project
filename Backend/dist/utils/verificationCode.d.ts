import { Response } from 'express';
export declare const sendVerificationCode: (code: number, email: string, method: "email" | "sms", res: Response) => Promise<Response>;
export declare const verifyOTP: (email: string, otp: string | number) => Promise<boolean>;
//# sourceMappingURL=verificationCode.d.ts.map