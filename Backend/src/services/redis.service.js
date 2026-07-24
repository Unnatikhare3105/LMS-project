"use strict";
//backend/src/services/redis.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDel = exports.redisGet = exports.redisSet = exports.getRedis = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("@config/config"));
const logger_1 = __importDefault(require("@utils/logger"));
let redisClient;
const connectRedis = () => {
    redisClient = new ioredis_1.default({
        host: config_1.default.REDIS_HOST,
        port: Number(config_1.default.REDIS_PORT),
        password: config_1.default.REDIS_PASSWORD,
        retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    redisClient.on('connect', () => logger_1.default.info('Redis connected successfully'));
    redisClient.on('error', (err) => logger_1.default.error('Redis error:', err));
    return redisClient;
};
exports.connectRedis = connectRedis;
const getRedis = () => {
    if (!redisClient)
        return (0, exports.connectRedis)();
    return redisClient;
};
exports.getRedis = getRedis;
const redisSet = async (key, value, ttlSeconds) => {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
        await (0, exports.getRedis)().set(key, serialized, 'EX', ttlSeconds);
    }
    else {
        await (0, exports.getRedis)().set(key, serialized);
    }
};
exports.redisSet = redisSet;
const redisGet = async (key) => {
    const data = await (0, exports.getRedis)().get(key);
    if (!data)
        return null;
    try {
        return JSON.parse(data);
    }
    catch {
        return data;
    }
};
exports.redisGet = redisGet;
const redisDel = async (key) => {
    await (0, exports.getRedis)().del(key);
};
exports.redisDel = redisDel;
//# sourceMappingURL=redis.service.js.map