import Redis from 'ioredis';
import dotenv from 'dotenv';
import { TokenStoreRecord } from './types';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl)
  throw new Error('REDIS_URL environment variable is not set!');
const redis = new Redis(redisUrl);
const TOKEN_PREFIX = 'erp-user-injector:';

export async function saveToken(token: string, record: TokenStoreRecord) {
  const key = `${TOKEN_PREFIX}${token}`;
  const value = JSON.stringify(record);
  await redis.set(key, value);
}

export async function getTokenRecord(token: string): Promise<TokenStoreRecord | undefined> {
  const key = `${TOKEN_PREFIX}${token}`;
  const value = await redis.get(key);
  return value ? JSON.parse(value) as TokenStoreRecord : undefined;
}