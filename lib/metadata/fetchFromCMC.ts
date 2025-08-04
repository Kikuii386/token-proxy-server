// lib/metadata/fetchFromCMC.ts
// This file fetches metadata for a token from CoinMarketCap using its contract address and chain
import { getDexPlatformName } from "@/core/utils";

const CMC_KEY = process.env.CMC_API_KEY!;

function cmcHeaders() {
  return {
    "X-CMC_PRO_API_KEY": CMC_KEY,
    Accept: "application/json",
  };
}

export async function fetchCMCMetadata(contract: string, chain: string) {
  const platform = chain.toLowerCase();
  const query = new URLSearchParams({ address: contract, aux: "platform,logo" });

  // Step 1: Try cryptocurrency/map
  const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?${query}`, {
    headers: cmcHeaders(),
  });
  const data = await res.json();
  const matched = data?.data?.find((t: any) => t.platform?.slug === platform);

  if (matched) {
    return {
      cmc_id: matched.id,
      symbol: matched.symbol,
      logo: matched.logo || null,
    };
  }

  // Step 2: fallback to DEX map
  const dexPlatform = getDexPlatformName(chain);
  const dexRes = await fetch(`https://pro-api.coinmarketcap.com/v1/dex/map?address=${contract}&platform=${dexPlatform}`, {
    headers: cmcHeaders(),
  });
  const dexData = await dexRes.json();
  const dexMatched = dexData?.data?.[0];

  if (dexMatched) {
    return {
      cmc_id: dexMatched.id,
      symbol: dexMatched.symbol,
      logo: dexMatched.logo || null,
    };
  }

  return null;
}

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");
  const chain = searchParams.get("chain");

  if (!contract || !chain) {
    return new Response(JSON.stringify({ error: "Missing contract or chain" }), { status: 400 });
  }

  try {
    const metadata = await fetchCMCMetadata(contract, chain);
    if (!metadata) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from CMC" }), { status: 500 });
  }
}