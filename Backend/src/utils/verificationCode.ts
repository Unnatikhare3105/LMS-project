//backend/src/utils/verificationCode.ts

import { Response } from 'express';
import UserModel from '../models/user.model';
import { sendMail, buildOTPEmail } from './emailService';
import CustomError from './customError';
import logger from './logger';

export const sendVerificationCode = async (
  code: number,
  email: string,
  method: 'email' | 'sms',
  res: Response
): Promise<Response> => {
  try {
    if (method === 'email') {
      const html = buildOTPEmail(code);
      await sendMail(email, 'Your Verification Code – LearnAI', html);
      logger.info(`OTP sent to ${email}`);
      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email.',
      });
    }
    return res.status(400).json({ success: false, message: 'Unsupported verification method.' });
  } catch (error: any) {
    logger.error(`Failed to send OTP: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to send verification code.' });
  }
};

export const verifyOTP = async (email: string, otp: string | number): Promise<boolean> => {
  const user = await UserModel.findOne({ email }).sort({ createdAt: -1 }).exec();
  if (!user) throw new CustomError('User not found.', 404);

  if (user.verificationCode !== Number(otp)) {
    throw new CustomError('Invalid OTP.', 400);
  }

  if (!user.verificationCodeExpire) {
    throw new CustomError('OTP has no expiry set.', 400);
  }

  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
    throw new CustomError('OTP has expired. Please request a new one.', 400);
  }

  // Clear OTP after successful verification
  await UserModel.findByIdAndUpdate(user._id, {
    $set: { verificationCode: null, verificationCodeExpire: null },
  });

  return true;
};