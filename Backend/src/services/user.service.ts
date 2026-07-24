//backend/src/services/user.service.ts


import UserModel, { IUser } from '../models/user.model';
import CustomError from '../utils/customError';
import * as userRepo from '../repositories/user.repository';
import { ICreateUserInput, ILoginInput } from '../types';

// ─── Register ─────────────────────────────────────────────────────────────────

export const createUser = async (
  input: ICreateUserInput
): Promise<{ user: IUser; token: string }> => {
  const { email, mobile, password, username } = input;

  const existing = await UserModel.findOne({
    $or: [
      { email, accountVerified: true },
      { mobile, accountVerified: true },
    ],
  });

  if (existing) {
    throw new CustomError('An account with this email or mobile already exists.', 409);
  }

  const user = await userRepo.createUser({ name: username, email, mobile, password });
  const token = user.generateAuthToken();
  return { user, token };
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginUser = async (
  input: ILoginInput
): Promise<{ user: IUser; token: string }> => {
  const { email, password } = input;

  const user = await UserModel.findOne({ email }).select('+password').exec();
  if (!user) throw new CustomError('Invalid credentials.', 401);

  const match = await user.comparePassword(password);
  if (!match) throw new CustomError('Invalid credentials.', 401);

  const token = user.generateAuthToken();
  return { user, token };
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new CustomError('User not found.', 404);
  return user;
};

// ─── Activity chart ───────────────────────────────────────────────────────────

export const getActivityChart = async (userId: string) => {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new CustomError('User not found.', 404);

  return {
    activityLog: user.activityLog,
    streak: user.streak,
    totalQuizzesTaken: user.totalQuizzesTaken,
    totalTopicsSearched: user.totalTopicsSearched,
  };
};