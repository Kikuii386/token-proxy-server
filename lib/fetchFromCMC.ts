// lib/fetchFromCMC.ts
import { getDexPlatformName } from "../core/utils";

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

import type { Request, Response } from "express";

export async function fetchFromCMC(req: Request, res: Response) {
  const { contract, chain } = req.query;

  if (!contract || !chain || typeof contract !== "string" || typeof chain !== "string") {
    return res.status(400).json({ error: "Missing contract or chain" });
  }

  try {
    const metadata = await fetchCMCMetadata(contract, chain);
    if (!metadata) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from CMC" });
  }
}