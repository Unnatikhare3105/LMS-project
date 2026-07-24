"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = __importDefault(require("./logger"));
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        },
        // Scalability: enable adapter here for multi-server with Redis
        // adapter: createAdapter(pubClient, subClient)
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    // ─── Auth middleware ────────────────────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.headers.token ||
                socket.handshake.auth?.token;
            if (!token)
                return next(new Error('Token required.'));
            const decoded = user_model_1.default.verifyAuthToken(token);
            const user = await user_model_1.default.findById(decoded._id).select('-password').lean().exec();
            if (!user)
                return next(new Error('User not found.'));
            socket.user = user;
            next();
        }
        catch {
            next(new Error('Authentication failed.'));
        }
    });
    // ─── Connection ─────────────────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const userId = socket.user?._id?.toString();
        logger_1.default.info(`Socket connected: ${userId}`);
        // Join personal room for targeted events
        if (userId)
            socket.join(`user:${userId}`);
        // ── Streak check ─────────────────────────────────────────────────────────
        socket.on('streak:check', () => {
            socket.emit('streak:data', socket.user?.streak || { current: 0, longest: 0 });
        });
        // ── Quiz completed – broadcast for live leaderboard ───────────────────────
        socket.on('quiz:completed', (data) => {
            io.emit('leaderboard:update', {
                userId,
                name: socket.user?.name,
                score: data.score,
                topic: data.topic,
            });
        });
        // ── Daily challenge notification ──────────────────────────────────────────
        socket.on('challenge:join', () => {
            socket.join('daily-challenge');
        });
        socket.on('disconnect', () => {
            logger_1.default.info(`Socket disconnected: ${userId}`);
        });
    });
    logger_1.default.info('Socket.IO initialized.');
    return io;
}
exports.default = initSocket;
//# sourceMappingURL=socket.io.js.map