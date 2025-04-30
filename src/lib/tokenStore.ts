import Redis from 'ioredis';
import { TokenStoreRecord } from './types';

const redis = new Redis();
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