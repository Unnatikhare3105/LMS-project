import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import userModel from '@models/user.models';

// Extend Socket type to include user property
interface CustomSocket extends Socket {
  user?: any;
}

function initSocket(server: HTTPServer): Server {
  console.log('Socket IO initialized');

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    },
  });

  io.use(async (socket: CustomSocket, next) => {
    try {
      const token = socket.handshake.headers.token as string;
      
      if (!token) {
        return next(new Error('Token required'));
      }

      const decodedToken = await userModel.verifyAuthToken(token);

      if (!decodedToken) {
        return next(new Error('Invalid token'));
      }

      const user = await userModel.findById(decodedToken._id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error('Error in socket authentication:', error);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: CustomSocket) => {
    console.log(`User connected: ${socket.user?.username}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.username}`);
    });

    // Add more event listeners as needed
  });

  return io;
}

export default initSocket;