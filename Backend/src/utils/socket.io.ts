import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import UserModel from '../models/user.model';
import logger from './logger';

interface CustomSocket extends Socket {
  user?: any;
}

function initSocket(server: HTTPServer): Server {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── Auth middleware ────────────────────────────────────────────────────────
  io.use(async (socket: CustomSocket, next) => {
    try {
      const token =
        (socket.handshake.headers.token as string) ||
        socket.handshake.auth?.token;

      if (!token) return next(new Error('Token required.'));

      const decoded: any = UserModel.verifyAuthToken(token);
      const user = await UserModel.findById(decoded._id).select('-password').lean().exec();
      if (!user) return next(new Error('User not found.'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication failed.'));
    }
  });

  // ─── Connection ─────────────────────────────────────────────────────────────
  io.on('connection', (socket: CustomSocket) => {
    const userId = socket.user?._id?.toString();
    logger.info(`Socket connected: ${userId}`);

    // Join personal room for targeted events
    if (userId) socket.join(`user:${userId}`);

    // ── Streak check ─────────────────────────────────────────────────────────
    socket.on('streak:check', () => {
      socket.emit('streak:data', socket.user?.streak || { current: 0, longest: 0 });
    });

    // ── Quiz completed – broadcast for live leaderboard ───────────────────────
    socket.on('quiz:completed', (data: { score: number; topic: string }) => {
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
      logger.info(`Socket disconnected: ${userId}`);
    });
  });

  logger.info('Socket.IO initialized.');
  return io;
}

export default initSocket;