"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const customError_1 = __importDefault(require("../utils/customError"));
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`[${req.method}] ${req.path} → ${err.message}`);
    // Known custom error
    if (err instanceof customError_1.default) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        res.status(400).json({ success: false, message: messages.join(', ') });
        return;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        res.status(409).json({ success: false, message: `${field} already exists.` });
        return;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ success: false, message: 'Invalid token.' });
        return;
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
        return;
    }
    // Generic fallback
    res.status(500).json({ success: false, message: 'Internal server error.' });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found.`,
    });
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map