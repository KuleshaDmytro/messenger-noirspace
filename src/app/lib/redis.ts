import Redis from "ioredis";

export const redisOptions = {
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT ?? 6379),
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(redisOptions);

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;