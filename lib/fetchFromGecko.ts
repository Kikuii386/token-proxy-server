import type { Request, Response } from "express";
// lib/fetchFromGecko.ts
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

export async function fetchFromGecko(req: Request, res: Response) {
  const { contract, chain } = req.query;

  if (!contract || !chain || typeof contract !== "string" || typeof chain !== "string") {
    return res.status(400).json({ error: "Missing contract or chain" });
  }

  try {
    const metadata = await fetchGeckoMetadata(contract, chain);
    if (!metadata) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Gecko" });
  }
}