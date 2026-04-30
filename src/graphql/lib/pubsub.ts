import { redisOptions } from '../../app/lib/redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const publisher = new Redis(redisOptions);
const subscriber = new Redis(redisOptions);

publisher.on('connect', () => console.log('✅ Redis publisher connected'));
subscriber.on('connect', () => console.log('✅ Redis subscriber connected'));
publisher.on('error', (err) => console.error('❌ Redis publisher error', err));
subscriber.on('error', (err) => console.error('❌ Redis subscriber error', err));

export const pubsub = new RedisPubSub({ publisher, subscriber });