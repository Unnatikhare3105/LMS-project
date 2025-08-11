
import { Server } from 'socket.io';

function initSocket(server) {
    
  console.log("Socket IO initialized");

  const io = new Server(server);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.token;
      if (!token) {
        return next(new Error("token required"));
      }

      const decodedToken = await userModel.verifyAuthToken(token);

      if (!decodedToken) {
        return next(new Error("Invalid token"));
      }

      const user = await userModel.findById(decodedToken._id);
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.error("Error in socket authentication:", error);
      return next(new Error("Authentication error"));
    }
  });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`);
    
        socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.username}`);
        });
    
        // Add more event listeners as needed
    }); 
    return io;
}

export default initSocket;