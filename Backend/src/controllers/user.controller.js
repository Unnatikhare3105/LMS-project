"use strict";
//backend/src/controllers/user.controller.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.verifyForgotPasswordOTPController = exports.forgotPasswordController = exports.getActivityChartController = exports.getProfileController = exports.logoutController = exports.verifyOTPController = exports.sendOTPController = exports.loginByPasswordController = exports.registerController = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService = __importStar(require("../services/user.service"));
const userRepo = __importStar(require("../repositories/user.repository"));
const verificationCode_1 = require("../utils/verificationCode");
const logger_1 = __importDefault(require("../utils/logger"));
const redis_service_1 = require("@services/redis.service");
// ─── Register ──────────────────────────────────────────────────────────────────
const registerController = async (req, res, next) => {
    try {
        const { username, email, mobile, password } = req.body;
        if (!username || !email || !mobile || !password) {
            return next(new customError_1.default('All fields are required.', 400));
        }
        // if (!/^\\d{10}$/.test(mobile)) {
        //   return next(new CustomError('Invalid phone number. Format: XXXXXXXXXX', 400));
        // }
        const { user, token } = await userService.createUser({ username, email, mobile, password });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        });
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
    }
    catch (error) {
        logger_1.default.error("error during the register", error);
        next(error);
    }
};
exports.registerController = registerController;
// ─── Login by password ─────────────────────────────────────────────────────────
const loginByPasswordController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new customError_1.default('Email and password are required.', 400));
        }
        const { user, token } = await userService.loginUser({ email, password });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.loginByPasswordController = loginByPasswordController;
// ─── Send OTP (login / register flow) ─────────────────────────────────────────
const sendOTPController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return next(new customError_1.default('Email is required.', 400));
        const user = await userRepo.findUserByEmail(email);
        if (!user)
            return next(new customError_1.default('User not found.', 404));
        const code = user_model_1.default.generateVerificationCode();
        await userRepo.setVerificationCode(user._id, code, 10);
        await (0, verificationCode_1.sendVerificationCode)(code, email, 'email', res);
    }
    catch (error) {
        logger_1.default.error("error in login otp", error);
        next(error);
    }
};
exports.sendOTPController = sendOTPController;
// ─── Verify OTP ────────────────────────────────────────────────────────────────
const verifyOTPController = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return next(new customError_1.default('Email and OTP are required.', 400));
        }
        const valid = await (0, verificationCode_1.verifyOTP)(email, otp);
        if (!valid)
            return next(new customError_1.default('Invalid or expired OTP.', 400));
        const user = await user_model_1.default.findOne({ email }).exec();
        if (!user)
            return next(new customError_1.default('User not found.', 404));
        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOTPController = verifyOTPController;
// ─── Logout ────────────────────────────────────────────────────────────────────
const logoutController = async (req, res) => {
    try {
        const token = (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
        if (!token) {
            return res.status(400).json({ success: false, message: 'No token provided.' });
        }
        const blacklistKey = `blacklisted:${token}`;
        await (0, redis_service_1.redisSet)(blacklistKey, 'true', 7 * 24 * 60 * 60);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded?.exp) {
            return res.status(400).json({ success: false, message: 'Invalid token.' });
        }
        const ttl = Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
        if (ttl > 0)
            await (0, redis_service_1.redisSet)(blacklistKey, 'true', ttl);
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.logoutController = logoutController;
// ─── Get profile ───────────────────────────────────────────────────────────────
const getProfileController = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user._id.toString());
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfileController = getProfileController;
// ─── Activity chart (GitHub-style) ────────────────────────────────────────────
const getActivityChartController = async (req, res, next) => {
    try {
        const data = await userService.getActivityChart(req.user._id.toString());
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getActivityChartController = getActivityChartController;
// ─── Forgot password – send OTP ────────────────────────────────────────────────
const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return next(new customError_1.default('Email is required.', 400));
        const user = await userRepo.findUserByEmail(email);
        if (!user)
            return next(new customError_1.default('User not found.', 404));
        const code = user_model_1.default.generateVerificationCode();
        await userRepo.setVerificationCode(user._id, code, 10);
        await (0, verificationCode_1.sendVerificationCode)(code, email, 'email', res);
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPasswordController = forgotPasswordController;
// ─── Forgot password – verify OTP ─────────────────────────────────────────────
const verifyForgotPasswordOTPController = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            console.log("Email or OTP missing in request body");
            return next(new customError_1.default('Email and OTP are required.', 400));
        }
        const valid = await (0, verificationCode_1.verifyOTP)(email, otp);
        if (!valid) {
            console.log("OTP verification failed for email:", email);
            return next(new customError_1.default('Invalid or expired OTP.', 400));
        }
        // Allow password reset for 10 minutes
        // await redis.set(`reset-allowed:${email}`, 'true', { EX: 10 * 60 });
        await (0, redis_service_1.redisSet)(`reset-allowed:${email}`, 'true', 10 * 60);
        console.log("OTP verified successfully for email:", email);
        res.status(200).json({
            success: true,
            message: 'OTP verified. You may now reset your password.',
        });
    }
    catch (error) {
        console.log("Error during OTP verification:", error);
        res.status(500).json({ success: false, message: `Internal server error. ${error}` });
        next(error);
    }
};
exports.verifyForgotPasswordOTPController = verifyForgotPasswordOTPController;
// ─── Forgot password – reset password ─────────────────────────────────────────
const resetPasswordController = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return next(new customError_1.default('Email and new password are required.', 400));
        }
        // const allowed = await redis.get(`reset-allowed:${email}`);
        await (0, redis_service_1.redisDel)(`reset-allowed:${email}`);
        // if (!allowed) {
        //   return next(new CustomError('OTP verification required before resetting password.', 403));
        // }
        const hashed = await user_model_1.default.hashPassword(newPassword);
        const user = await userRepo.updatePassword(email, hashed);
        if (!user)
            return next(new customError_1.default('User not found.', 404));
        await (0, redis_service_1.redisDel)(`reset-allowed:${email}`);
        const fullUser = await user_model_1.default.findById(user._id).exec();
        if (!fullUser)
            return next(new customError_1.default('User not found.', 404));
        const token = fullUser.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({ success: true, message: 'Password reset successfully.', token });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPasswordController = resetPasswordController;
//# sourceMappingURL=user.controller.js.map