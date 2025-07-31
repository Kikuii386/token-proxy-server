// /api/refresh-prices.ts
import type { Request, Response } from "express";
import { Redis } from '@upstash/redis'
import { fetchDexPrice } from "../lib/fetchDexPrice.js";
import { fetchCMCPrice } from "../lib/fetchCMCPrice.js";
import { fetchGeckoPrice } from "../lib/fetchGeckoPrice.js";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TTL_SECONDS = 60; // 1 minute

export default async function handler(req: Request, res: Response) {
  try {
    const { id, contract, chain, cmc_id: cmcIdStr, gecko_id } = req.query as {
      id: string;
      contract: string;
      chain: string;
      cmc_id?: string;
      gecko_id?: string;
    };
    const cmc_id = cmcIdStr ? Number(cmcIdStr) : null;

    if (!id || !contract || !chain) return res.status(400).json({ error: "Missing params" });

    // 1. Try Dexscreener (fastest)
    const dexPrice = await fetchDexPrice(contract, chain);
    if (dexPrice) {
      await redis.set(`price:${id}`, dexPrice, { ex: TTL_SECONDS });
      return res.status(200).json({ source: "dex", price: dexPrice });
    }

    // 2. Fallback: CMC
    const cmcPrice = cmc_id ? await fetchCMCPrice(cmc_id) : null;
    if (cmcPrice) {
      await redis.set(`price:${id}`, cmcPrice, { ex: TTL_SECONDS });
      return res.status(200).json({ source: "cmc", price: cmcPrice });
    }

    // 3. Fallback: Gecko
    const geckoPrice = gecko_id ? await fetchGeckoPrice(gecko_id) : null;
    if (geckoPrice) {
      await redis.set(`price:${id}`, geckoPrice, { ex: TTL_SECONDS });
      return res.status(200).json({ source: "gecko", price: geckoPrice });
    }

    res.status(404).json({ error: "Price not found" });
  } catch (err) {
    console.error("Price Error:", err);
    res.status(500).json({ error: "Failed to fetch price" });
  }
}