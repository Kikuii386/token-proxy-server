// /app/api/refresh-prices/route.ts
import { NextRequest, NextResponse } from "next/server";
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
      return new Response(JSON.stringify({ source: null, price: null, error: "Missing params" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    if (cmcIdStr === null || isNaN(Number(cmcIdStr))) {
      return new Response(JSON.stringify({ source: null, price: null, error: "Invalid cmc_id" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
    const cmc_id = Number(cmcIdStr);

    const dexPrice = await fetchDexPrice(contract, chain);
    if (dexPrice != null) {
      await redis.set(`price:${id}`, dexPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "dex", price: dexPrice, error: null }), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const cmcPrice = await fetchCMCPrice(cmc_id);
    if (cmcPrice != null) {
      await redis.set(`price:${id}`, cmcPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "cmc", price: cmcPrice, error: null }), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const geckoPrice = gecko_id ? await fetchGeckoPrice(gecko_id) : null;
    if (geckoPrice != null) {
      await redis.set(`price:${id}`, geckoPrice, { ex: TTL_SECONDS });
      return new Response(JSON.stringify({ source: "gecko", price: geckoPrice, error: null }), {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ source: null, price: null, error: "Price not found" }), {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Price Error:", err);
    return new Response(JSON.stringify({ source: null, price: null, error: "Failed to fetch price" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}