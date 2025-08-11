import { createClient } from 'redis';
import config from '../config/config.js';

const redis = createClient({
  password: config.REDIS_PASSWORD,
  socket: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  }
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

(async () => {
  try {
    await redis.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();


export default redis;
