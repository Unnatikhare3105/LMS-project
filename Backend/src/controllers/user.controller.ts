//backend/src/controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import * as userRepo from '../repositories/user.repository';
import { sendVerificationCode, verifyOTP } from '../utils/verificationCode';
import logger from '../utils/logger';
import { redisSet, redisDel } from '@services/redis.service';

// ─── Register ──────────────────────────────────────────────────────────────────

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, mobile, password } = req.body;

    if (!username || !email || !mobile || !password) {
      return next(new CustomError('All fields are required.', 400));
    }


    const { user, token } = await userService.createUser({ username, email, mobile, password });



    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        accountVerified: user.accountVerified,
      },
      token,
    });
  } catch (error) {
    logger.error("error during the register", error)
    next(error);
  }
};

// ─── Login by password ─────────────────────────────────────────────────────────

export const loginByPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new CustomError('Email and password are required.', 400));
    }

    const { user, token } = await userService.loginUser({ email, password });



    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Send OTP (login / register flow) ─────────────────────────────────────────

export const sendOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) return next(new CustomError('Email is required.', 400));

    const user = await userRepo.findUserByEmail(email);
    if (!user) return next(new CustomError('User not found.', 404));

    const code = UserModel.generateVerificationCode();
    await userRepo.setVerificationCode(user._id as any, code, 10);
    await sendVerificationCode(code, email, 'email', res);
  } catch (error) {
    logger.error("error in login otp", error)
    next(error);
  }
};

// ─── Verify OTP ────────────────────────────────────────────────────────────────

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

    const valid = await verifyOTP(email, otp);
    if (!valid) return next(new CustomError('Invalid or expired OTP.', 400));

    const user = await UserModel.findOne({ email }).exec();
    if (!user) return next(new CustomError('User not found.', 404));

    const token = user.generateAuthToken();



    res.status(200).json({
      success: true,
      message: 'OTP verified. Login successful.',
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────────

export const logoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided.' });
    }

    const blacklistKey = `blacklisted:${token}`;
    await redisSet(blacklistKey, 'true', 7 * 24 * 60 * 60);


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { exp?: number };

    if (!decoded?.exp) {
      return res.status(400).json({ success: false, message: 'Invalid token.' });
    }

    const ttl = Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
    if (ttl > 0) await redisSet(blacklistKey, 'true', ttl);

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get profile ───────────────────────────────────────────────────────────────

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserProfile(req.user._id.toString());
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ─── Activity chart (GitHub-style) ────────────────────────────────────────────

export const getActivityChartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await userService.getActivityChart(req.user._id.toString());
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot password – send OTP ────────────────────────────────────────────────

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) return next(new CustomError('Email is required.', 400));

    const user = await userRepo.findUserByEmail(email);
    if (!user) return next(new CustomError('User not found.', 404));

    const code = UserModel.generateVerificationCode();
    await userRepo.setVerificationCode(user._id as any, code, 10);
    await sendVerificationCode(code, email, 'email', res);
  } catch (error) {
    next(error);
  }
};

// ─── Forgot password – verify OTP ─────────────────────────────────────────────

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

    const valid = await verifyOTP(email, otp);
    if (!valid) {

      return next(new CustomError('Invalid or expired OTP.', 400));
    }



    await redisSet(`reset-allowed:${email}`, 'true', 10 * 60);



    res.status(200).json({
      success: true,
      message: 'OTP verified. You may now reset your password.',
    });
  } catch (error) {

    res.status(500).json({ success: false, message: `Internal server error. ${error}` });
    next(error);
  }
};

// ─── Forgot password – reset password ─────────────────────────────────────────

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new CustomError('Email and new password are required.', 400));
    }

    await redisDel(`reset-allowed:${email}`);


    const hashed = await UserModel.hashPassword(newPassword);
    const user = await userRepo.updatePassword(email, hashed);
    if (!user) return next(new CustomError('User not found.', 404));

    await redisDel(`reset-allowed:${email}`);

    const fullUser = await UserModel.findById((user as any)._id).exec();
    if (!fullUser) return next(new CustomError('User not found.', 404));
    const token = fullUser.generateAuthToken();



    res.status(200).json({ success: true, message: 'Password reset successfully.', token });
  } catch (error) {
    next(error);
  }
};