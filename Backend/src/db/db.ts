import mongoose from 'mongoose';
import config from '@config/config';
import logger from '@utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.DB_URL) {
        logger.error('DB_URL is not defined in environment variables');
      throw new Error('DB_URL is not defined in environment variables');
    }

    await mongoose.connect(config.DB_URL);
    logger.info('MongoDB connected successfully!');
  } catch (err: any) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};