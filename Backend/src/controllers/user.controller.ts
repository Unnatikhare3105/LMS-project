// Backend/src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import CustomError from '@utils/customError';
import userModels from '@models/user.models';
import jwt from 'jsonwebtoken';
import redis from 'services/redis.services';
import { createUser, loginUser } from 'services/user.services';
import { sendVerificationCode, verifyOTP } from '@utils/verificationCode';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, mobile, password } = req.body;
    console.log(req.body);

    if (!username || !email || !mobile || !password) {
      return next(new CustomError('All fields are required.', 400));
    }

    function validatePhoneNumber(mobile: string): boolean {
      const phoneRegex = /^\+91\d{10}$/;
      return phoneRegex.test(mobile);
    }

    if (!validatePhoneNumber(mobile)) {
      return next(new CustomError('Invalid phone number.', 400));
    }

    const user = await createUser({
      email,
      mobile,
      password,
      username,
    });

    if (!user) {
      return next(new CustomError('User registration failed.', 500));
    }

    res.cookie('token', user.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.user,
      token: user.token,
    });
  } catch (error: any) {
    next(error);
  }
};

export const loginUserByPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError('All fields are required.', 400));
    }

    const user = await loginUser({ email, password });

    if (!user) {
      return next(new CustomError('Invalid credentials.', 401));
    }

    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError('Error generating token.', 500));
    }

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserByOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new CustomError('Email is required.', 400));
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError('User not found.', 404));
    }

    const verificationCode = await userModels.generateVerificationCode();

    const isVerificationCodeSent = await sendVerificationCode(
      verificationCode,
      email,
      'email',
      res
    );

    if (!isVerificationCodeSent) {
      return next(new CustomError('Error sending verification code.', 500));
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new CustomError('Email and OTP are required.', 400));
    }
    const verificationResult = await verifyOTP(email, otp);

    if (!verificationResult) {
      return next(new CustomError('Verification failed. Invalid OTP.', 400));
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError('User not found.', 404));
    }

    user.accountVerified = true;
    await user.save();

    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError('Error generating token.', 500));
    }

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Login successful.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const tokenKey = `blacklisted:${token}`;
    const ttl = await redis.ttl(tokenKey);

    if (Number(ttl) > 0) {
      return res.status(400).json({ message: 'Token is already blacklisted' });
    }

    if (ttl === -1) {
      return res
        .status(400)
        .json({ message: 'Token found but has no expiry set' });
    }

    if (ttl === -2) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        exp?: number;
      };

      if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: 'Invalid token' });
      }
      const timeRemaining = decoded.exp * 1000 - Date.now();
      await redis.set(tokenKey, 'true', {
        EX: Math.floor(timeRemaining / 1000)
      });

      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({ message: 'User logout successful' });
    }

    return res.status(500).json({ message: 'Unexpected error' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordByOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new CustomError('Email is required.', 400));
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError('User not found.', 404));
    }

    const otp = await userModels.generateVerificationCode();
    if (!otp) {
      return next(new CustomError('Error generating OTP.', 500));
    }
    const isSent = await sendVerificationCode(
      otp,
      email,
      'email',
      res
    );
    if (!isSent) {
      return next(new CustomError('Error sending OTP.', 500));
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to email for password reset.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new CustomError('Email and OTP are required.', 400));
    }

    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return next(new CustomError('Invalid or expired OTP.', 400));
    }

    await redis.set(`reset-allowed:${email}`, 'true', { 'EX': 10 * 60 }); // 10 minutes

    res.status(200).json({
      success: true,
      message: 'OTP verified. You can now reset your password.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordByOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new CustomError('Email and new password are required.', 400));
    }

    const allowed = await redis.get(`reset-allowed:${email}`);
    if (!allowed) {
      return next(
        new CustomError(
          'OTP verification required before resetting password.',
          400
        )
      );
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError('User not found.', 404));
    }

    user.password = await userModels.hashPassword(newPassword);
    await user.save();

    await redis.del(`reset-allowed:${email}`);

    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError('Error generating token.', 500));
    }

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
      token,
    });
  } catch (error) {
    next(error);
  }
};