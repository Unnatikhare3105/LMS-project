import mongoose from 'mongoose';
import { IUser } from '../models/user.model';
export declare const findUserByEmail: (email: string, includePassword?: boolean) => Promise<IUser | null>;
export declare const findUserById: (id: string | mongoose.Types.ObjectId) => Promise<IUser | null>;
export declare const findUserByUserId: (userId: string) => Promise<IUser | null>;
export declare const findLatestUnverifiedByEmail: (email: string) => Promise<IUser | null>;
export declare const createUser: (data: {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: string;
}) => Promise<IUser>;
export declare const saveUser: (user: IUser) => Promise<IUser>;
export declare const updatePassword: (email: string, hashedPassword: string) => Promise<IUser | null>;
export declare const setVerificationCode: (userId: string, code: number, expireMinutes: number) => Promise<void>;
export declare const recordActivity: (userId: string) => Promise<void>;
export declare const incrementQuizCount: (userId: string) => Promise<void>;
export declare const incrementTopicCount: (userId: string) => Promise<void>;
//# sourceMappingURL=user.repository.d.ts.map