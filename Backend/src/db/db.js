import mongoose from 'mongoose';
import config from '../config/config.js';

export const connectDB = function connectDB() {
    mongoose.connect(config.DB_URL)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}

// export default connectDB;