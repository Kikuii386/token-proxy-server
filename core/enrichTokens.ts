// core/enrichTokens.ts
import { getMappedToken, saveTokenMapping } from "../supabase/client";
import { fetchCMCMetadata } from "../lib/fetchFromCMC";
import { fetchGeckoMetadata } from "../lib/fetchFromGecko";
import { fetchDexMetadata } from "../lib/fetchDexMetadata";
import { cacheEnrichedToken } from "../lib/cache";
import type { TokenInput, TokenWithPrice as EnrichedToken } from "../types/Token";

export async function enrichTokens(tokens: TokenInput[]): Promise<EnrichedToken[]> {
  const results: EnrichedToken[] = [];

  for (const token of tokens) {
    const id = `${token.contract}-${token.chain}`;

    // Step 1: Check mapping in Supabase
    const existing = await getMappedToken(token.contract, token.chain);
    if (existing) {
      results.push({ ...token, ...existing });
      continue;
    }

    // Step 2: Try CoinMarketCap mapping
    const cmcMeta = await fetchCMCMetadata(token.contract, token.chain);
    
    // Step 3: Try CoinGecko mapping
    const geckoMeta = await fetchGeckoMetadata(token.contract, token.chain);

    const dexMeta = await fetchDexMetadata(token.contract);

    if (!cmcMeta && !geckoMeta && !dexMeta) continue; // skip if not found

    const enriched: EnrichedToken = {
      ...token,
      symbol: cmcMeta?.symbol || geckoMeta?.symbol || dexMeta?.symbol || "UNKNOWN",
      logo: cmcMeta?.logo || geckoMeta?.logo || dexMeta?.logo || "",
      cmc_id: cmcMeta?.cmc_id || null,
      gecko_id: geckoMeta?.gecko_id || null,
    };

    await saveTokenMapping(enriched); // save to Supabase
    await cacheEnrichedToken(id, enriched); // cache in Upstash
    results.push(enriched);
  }

  return results;
}