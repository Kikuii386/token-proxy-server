// /api/refresh-prices/route.ts
import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { fetchDexPrice } from "@/lib/price/fetchDexPrice";
import { fetchCMCPrice } from "@/lib/price/fetchCMCPrice";
import { fetchGeckoPrice } from "@/lib/price/fetchGeckoPrice";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TTL_SECONDS = 60; // 1 minute

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const contract = searchParams.get("contract");
    const chain = searchParams.get("chain");
    const cmcIdStr = searchParams.get("cmc_id");
    const gecko_id = searchParams.get("gecko_id");

    if (!id || !contract || !chain) {
      return new Response(JSON.stringify({ source: null, price: null, error: "Missing params" }), { status: 400 });
    }

    if (cmcIdStr === null || isNaN(Number(cmcIdStr))) {
      return new Response(JSON.stringify({ source: null, price: null, error: "Invalid cmc_id" }), { status: 400 });
    }
    const cmc_id = Number(cmcIdStr);

    const dexPrice = await fetchDexPrice(contract, chain);
    if (dexPrice != null) {
      await redis.set(`price:${id}`, dexPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "dex", price: dexPrice, error: null }));
    }

    const cmcPrice = await fetchCMCPrice(cmc_id);
    if (cmcPrice != null) {
      await redis.set(`price:${id}`, cmcPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "cmc", price: cmcPrice, error: null }));
    }

    const geckoPrice = gecko_id ? await fetchGeckoPrice(gecko_id) : null;
    if (geckoPrice != null) {
      await redis.set(`price:${id}`, geckoPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "gecko", price: geckoPrice, error: null }));
    }

    return new Response(JSON.stringify({ source: null, price: null, error: "Price not found" }), { status: 404 });
  } catch (err) {
    console.error("Price Error:", err);
    return new Response(JSON.stringify({ source: null, price: null, error: "Failed to fetch price" }), { status: 500 });
  }
}