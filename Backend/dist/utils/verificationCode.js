"use strict";
//backend/src/utils/verificationCode.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendVerificationCode = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const emailService_1 = require("./emailService");
const customError_1 = __importDefault(require("./customError"));
const logger_1 = __importDefault(require("./logger"));
const sendVerificationCode = async (code, email, method, res) => {
    try {
        if (method === 'email') {
            const html = (0, emailService_1.buildOTPEmail)(code);
            await (0, emailService_1.sendMail)(email, 'Your Verification Code – LearnAI', html);
            logger_1.default.info(`OTP sent to ${email}`);
            return res.status(200).json({
                success: true,
                message: 'Verification code sent to your email.',
            });
        }
        return res.status(400).json({ success: false, message: 'Unsupported verification method.' });
    }
    catch (error) {
        logger_1.default.error(`Failed to send OTP: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Failed to send verification code.' });
    }
};
exports.sendVerificationCode = sendVerificationCode;
const verifyOTP = async (email, otp) => {
    const user = await user_model_1.default.findOne({ email }).sort({ createdAt: -1 }).exec();
    if (!user)
        throw new customError_1.default('User not found.', 404);
    if (user.verificationCode !== Number(otp)) {
        throw new customError_1.default('Invalid OTP.', 400);
    }
    if (!user.verificationCodeExpire) {
        throw new customError_1.default('OTP has no expiry set.', 400);
    }
    if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
        throw new customError_1.default('OTP has expired. Please request a new one.', 400);
    }
    // Clear OTP after successful verification
    await user_model_1.default.findByIdAndUpdate(user._id, {
        $set: { verificationCode: null, verificationCodeExpire: null },
    });
    return true;
};
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=verificationCode.js.map