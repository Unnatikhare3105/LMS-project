"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        if (!config_1.default.DB_URL) {
            throw new Error('DB_URL is not defined in environment variables.');
        }
        mongoose_1.default.connection.on('connected', () => logger_1.default.info('MongoDB connected.'));
        mongoose_1.default.connection.on('error', (err) => logger_1.default.error(`MongoDB error: ${err.message}`));
        mongoose_1.default.connection.on('disconnected', () => logger_1.default.warn('MongoDB disconnected. Retrying...'));
        await mongoose_1.default.connect(config_1.default.DB_URL, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 20, // handle up to ~1000 concurrent users
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            family: 4,
        });
    }
    catch (err) {
        logger_1.default.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map