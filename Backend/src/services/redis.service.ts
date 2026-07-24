//backend/src/services/redis.service.ts

import Redis from 'ioredis';
import config from '@config/config';
import logger from '@utils/logger';

let redisClient: Redis;

export const connectRedis = (): Redis => {
  redisClient = new Redis({
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  redisClient.on('connect', () => logger.info('Redis connected successfully'));
  redisClient.on('error', (err) => logger.error('Redis error:', err));

  return redisClient;
};

export const getRedis = (): Redis => {
  if (!redisClient) return connectRedis();
  return redisClient;
};

export const redisSet = async (
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> => {
  const serialized = JSON.stringify(value);
  if (ttlSeconds) {
    await getRedis().set(key, serialized, 'EX', ttlSeconds);
  } else {
    await getRedis().set(key, serialized);
  }
};

export const redisGet = async <T>(key: string): Promise<T | null> => {
  const data = await getRedis().get(key);
  if (!data) return null;
  try { return JSON.parse(data) as T; }
  catch { return data as unknown as T; }
};

export const redisDel = async (key: string): Promise<void> => {
  await getRedis().del(key);
};

