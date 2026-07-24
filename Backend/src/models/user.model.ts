//backend/src/models/user.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRole, IDailyActivityEntry, IStreakData } from '../types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

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
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export interface IUserModel extends Model<IUser> {
  // Static methods
  hashPassword(password: string): Promise<string>;
  verifyAuthToken(token: string): any;
  generateVerificationCode(): number;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const streakSchema = new Schema<IStreakData>(
  {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
  },
  { _id: false }
);

const activitySchema = new Schema<IDailyActivityEntry>(
  {
    date: { type: String, required: true },  // YYYY-MM-DD
    count: { type: Number, default: 1 },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser, IUserModel>(
  {
    userId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: { type: String, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    accountVerified: { type: Boolean, default: false },
    verificationCode: { type: Number, default: null },
    verificationCodeExpire: { type: Date, default: null },
    streak: {
      type: streakSchema,
      default: () => ({ current: 0, longest: 0, lastActivityDate: null }),
    },
    activityLog: { type: [activitySchema], default: [] },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalTopicsSearched: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

userSchema.index({ mobile: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, accountVerified: 1 });

// ─── Pre-save ─────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance methods ─────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { _id: this._id.toString(), userId: this.userId, role: this.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// ─── Static methods ───────────────────────────────────────────────────────────

userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  return bcrypt.hash(password, 12);
};

userSchema.statics.verifyAuthToken = function (token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

userSchema.statics.generateVerificationCode = function (): number {
  return Math.floor(100000 + Math.random() * 900000);
};

// ─── Export ───────────────────────────────────────────────────────────────────

const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default UserModel;

