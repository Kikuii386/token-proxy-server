// lib/metadata/fetchDexMetadata.ts
// This file fetches metadata for a token from DexScreener using its contract address.

export async function fetchDexMetadata(contract: string): Promise<{
  symbol: string | null;
  logo: string | null;
} | null> {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${contract}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const first = data.pairs?.[0];

    return {
      symbol: first?.baseToken?.symbol ?? null,
      logo: first?.info?.imageUrl ?? null,
    };
  } catch {
    return null;
  }
}
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");

  if (!contract) {
    return new Response("Missing contract parameter", { status: 400 });
  }

  const result = await fetchDexMetadata(contract);
  return Response.json(result);
}