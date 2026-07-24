import mongoose from 'mongoose';
import config from '../config/config';
import logger from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.DB_URL) {
      throw new Error('DB_URL is not defined in environment variables.');
    }

    mongoose.connection.on('connected', () => logger.info('MongoDB connected.'));
    mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected. Retrying...'));

    await mongoose.connect(config.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 20,           // handle up to ~1000 concurrent users
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      family: 4,
    });
  } catch (err: any) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};