// lib/cache.ts
import { Redis } from "@upstash/redis";
import type { EnrichedToken } from "../types/Token";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TTL_SECONDS = 60 * 60 * 12; // 12 hours

export async function cacheEnrichedToken(id: string, token: EnrichedToken) {
  await redis.set(`enrich:${id}`, token, { ex: TTL_SECONDS });
}

export async function getCachedEnrichedToken(id: string): Promise<EnrichedToken | null> {
  const token = await redis.get<EnrichedToken>(`enrich:${id}`);
  return token || null;
}