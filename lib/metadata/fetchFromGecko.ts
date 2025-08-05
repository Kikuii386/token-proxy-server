// lib/metadata/fetchFromGecko.ts
import { NextRequest } from "next/server";

const GECKO_API_KEY = process.env.GECKO_API_KEY!;

const CHAIN_MAP: Record<string, string> = {
  ETH: "ethereum",
  BSC: "binance-smart-chain",
  POLYGON: "polygon-pos",
  AVAX: "avalanche",
  ARB: "arbitrum-one",
  OP: "optimistic-ethereum",
  BASE: "base",
  FANTOM: "fantom",
  ZK: "zksync",
  LINEA: "linea",
  BLAST: "blast",
  SOL: "solana",
};

export async function fetchGeckoMetadata(contract: string, chain: string) {
  const platform = CHAIN_MAP[chain.toUpperCase()];
  if (!platform) return null;

  try {
    const res = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/${platform}/contract/${contract}`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': GECKO_API_KEY
        }
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
      gecko_id: data.id,
      symbol: data.symbol?.toUpperCase() || "UNKNOWN",
      logo: data.image?.small || null,
    };
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");
  const chain = searchParams.get("chain");

  if (!contract || !chain) {
    return new Response(JSON.stringify({ error: "Missing contract or chain" }), { status: 400 });
  }

  try {
    const metadata = await fetchGeckoMetadata(contract, chain);
    if (!metadata) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from Gecko" }), { status: 500 });
  }
}