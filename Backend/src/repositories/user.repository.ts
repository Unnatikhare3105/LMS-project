//backend/src/repositories/user.repository.ts

import mongoose from 'mongoose';
import UserModel, { IUser } from '../models/user.model';

// ─── Reads ────────────────────────────────────────────────────────────────────

export const findUserByEmail = async (
    email: string,
    includePassword = false
): Promise<IUser | null> => {
    const q = UserModel.findOne({ email });
    if (includePassword) q.select('+password');
    return q.exec();
};

export const findUserById = async (
    id: string | mongoose.Types.ObjectId
): Promise<IUser | null> => {
    return UserModel.findById(id).select('-password').exec();
};

export const findUserByUserId = async (userId: string): Promise<IUser | null> => {
    return UserModel.findOne({ userId }).select('-password').exec();
};

export const findLatestUnverifiedByEmail = async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email, accountVerified: false })
        .sort({ createdAt: -1 })
        .exec();
};

// ─── Writes ───────────────────────────────────────────────────────────────────

export const createUser = async (data: {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: string;
}): Promise<IUser> => {
    return UserModel.create(data);
};

export const saveUser = async (user: IUser): Promise<IUser> => {
    return user.save({ validateModifiedOnly: true });
};

export const updatePassword = async (
    email: string,
    hashedPassword: string
): Promise<IUser | null> => {
    return UserModel.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true }
    ).exec();
};

export const setVerificationCode = async (
    userId: string,
    code: number,
    expireMinutes: number
): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, {
        verificationCode: code,
        verificationCodeExpire: new Date(Date.now() + expireMinutes * 60 * 1000),
    }).exec();
};

// ─── Streak & Activity ────────────────────────────────────────────────────────

export const recordActivity = async (
    userId: string
): Promise<void> => {
    const today = new Date().toISOString().split('T')[0];
    // const user = await UserModel.findById(userId).exec();
    const user = await UserModel.findOne({ userId }).exec();
    if (!user) return;

    const lastDate = user.streak.lastActivityDate
        ? new Date(user.streak.lastActivityDate).toISOString().split('T')[0]
        : null;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Update streak logic
    if (lastDate !== today) {
        if (lastDate === yesterday) {
            user.streak.current += 1;
        } else {
            user.streak.current = 1;
        }
        if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
        }
        user.streak.lastActivityDate = new Date();
    }

    // Upsert today's activity entry
    const existingIdx = user.activityLog.findIndex((a) => a.date === today);
    if (existingIdx >= 0) {
        user.activityLog[existingIdx].count += 1;
    } else {
        user.activityLog.push({ date: today, count: 1 });
        // Keep only last 365 entries
        if (user.activityLog.length > 365) {
            user.activityLog = user.activityLog.slice(-365);
        }
    }

    await user.save({ validateModifiedOnly: true });
};

export const incrementQuizCount = async (
    userId: string
): Promise<void> => {
   await UserModel.findOneAndUpdate({ userId }, { $inc: { totalQuizzesTaken: 1 } }).exec();
};

export const incrementTopicCount = async (
    userId: string
): Promise<void> => {
    await UserModel.findOneAndUpdate({ userId }, { $inc: { totalTopicsSearched: 1 } }).exec();
};