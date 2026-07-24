"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const redis_service_1 = require("@services/redis.service");
const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
        console.log('token found:', !!token); // should log true
        if (!token) {
            res.status(401).json({ success: false, message: 'User not found.' }); // token hi nahi to seedha reject
            return;
        }
        const isBlacklisted = await (0, redis_service_1.getRedis)().get(`blacklisted:${token}`);
        if (isBlacklisted) {
            res.clearCookie('token');
            res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
            return;
        }
        console.log('blacklist check passed'); // if redis was the issue, this won't log
        const decoded = user_model_1.default.verifyAuthToken(token);
        console.log('decoded:', decoded); // confirm JWT decodes correctly
        // try {
        //   const token =
        //     req.cookies?.token ||
        //     (req.headers.authorization?.startsWith('Bearer ')
        //       ? req.headers.authorization.split(' ')[1]
        //       : null);
        //   if (!token) {
        //     res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
        //     return;
        //   }
        //   // Check Redis blacklist (O(1) lookup – scales well)
        //   // const isBlacklisted = await redis.get(`blacklisted:${token}`);
        //   const isBlacklisted = await getRedis().get(`blacklisted:${token}`);
        //   if (isBlacklisted) {
        //     res.clearCookie('token');
        //     res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        //     return;
        //   }
        //   const decoded: any = UserModel.verifyAuthToken(token);
        const user = await user_model_1.default.findById(decoded._id).select('-password').lean().exec();
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
exports.authUser = authUser;
// ─── Role guard ────────────────────────────────────────────────────────────────
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map