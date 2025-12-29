import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  accountVerified: boolean;
  verificationCode?: number;
  verificationCodeExpire?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
  hashPassword(password: string): Promise<string>;
  verifyAuthToken(token: string): any;
  generateVerificationCode(): number;
}


const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
      default: null,
    },
    verificationCodeExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Database Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ createdAt: -1 });

// Static method: Hash password
userSchema.statics.hashPassword = async function (password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Static method: Verify auth token
userSchema.statics.verifyAuthToken = function (token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

// Static method: Generate verification code
userSchema.statics.generateVerificationCode = function () {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit code
};

// Instance method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method: Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: '7d',
    }
  );
  return token;
};

// Pre-save hook: Hash password before saving (if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const UserModel: any = mongoose.model<IUser>('User', userSchema);

export default UserModel;