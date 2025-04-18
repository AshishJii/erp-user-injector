import { TokenStoreRecord } from './types';

const tokenStore: Record<string, TokenStoreRecord> = {};

export function saveToken(token: string, record: TokenStoreRecord) {
  tokenStore[token] = record;
}

export function getTokenRecord(token: string): TokenStoreRecord | undefined {
  return tokenStore[token];
}