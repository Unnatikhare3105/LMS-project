import { Response } from 'express';
import config from '@config/config';
import CustomError from './customError';
import { sendMail } from './emailService';
import userModels from '@models/user.models';

export const sendVerificationCode = async (
  verificationCode: number,
  email: string,
  verificationMethod: 'email' | 'sms',
  res: Response
): Promise<Response> => {
  try {
    if (verificationMethod === 'email') {
      const message = generateEmailTemplate(verificationCode);
      await sendMail(email, 'Verification Code', message);
      console.log('Email sent successfully');
      
      return res.status(200).json({
        success: true,
        message: `Verification code sent successfully ${verificationCode}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid verification method',
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    
    return res.status(500).json({
      success: false,
      message: `Verification code failed to send. ${error}`,
    });
  }
};

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    const userAllEntries = await userModels
      .find({
        $or: [
          {
            email,
            accountVerified: false,
          },
        ],
      })
      .sort({ createdAt: -1 });

    if (!userAllEntries.length) {
      throw new CustomError('User not found.', 404);
    }

    const user = userAllEntries[0];

    if (user.verificationCode !== Number(otp)) {
      throw new CustomError('Invalid OTP.', 400);
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    console.log('Current time:', currentTime);
    console.log('Expiry time:', verificationCodeExpire);

    if (currentTime > verificationCodeExpire) {
      throw new CustomError('OTP Expired.', 400);
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Internal Server Error.', 500);
  }
};

function generateEmailTemplate(verificationCode: number): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}