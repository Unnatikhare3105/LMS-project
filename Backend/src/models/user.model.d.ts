import { Document, Model } from 'mongoose';
import { UserRole, IDailyActivityEntry, IStreakData } from '../types';
export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role: UserRole;
    accountVerified: boolean;
    verificationCode?: number | null;
    verificationCodeExpire?: Date | null;
    streak: IStreakData;
    activityLog: IDailyActivityEntry[];
    totalQuizzesTaken: number;
    totalTopicsSearched: number;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}
export interface IUserModel extends Model<IUser> {
    hashPassword(password: string): Promise<string>;
    verifyAuthToken(token: string): any;
    generateVerificationCode(): number;
}
declare const UserModel: IUserModel;
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map