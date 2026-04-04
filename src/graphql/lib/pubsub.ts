// pubsub.ts
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  retryStrategy: (times: number) => Math.min(times * 50, 2000)
};

// export const pubsub = new RedisPubSub({
//   publisher: new Redis(options),
//   subscriber: new Redis(options),
// });


const publisher = new Redis(options);
const subscriber = new Redis(options);

publisher.on('connect', () => console.log('✅ Redis publisher connected'));
subscriber.on('connect', () => console.log('✅ Redis subscriber connected'));
publisher.on('error', (err) => console.error('❌ Redis publisher error', err));
subscriber.on('error', (err) => console.error('❌ Redis subscriber error', err));

export const pubsub = new RedisPubSub({ publisher, subscriber });