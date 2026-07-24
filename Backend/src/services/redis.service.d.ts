import Redis from 'ioredis';
export declare const connectRedis: () => Redis;
export declare const getRedis: () => Redis;
export declare const redisSet: (key: string, value: unknown, ttlSeconds?: number) => Promise<void>;
export declare const redisGet: <T>(key: string) => Promise<T | null>;
export declare const redisDel: (key: string) => Promise<void>;
//# sourceMappingURL=redis.service.d.ts.map