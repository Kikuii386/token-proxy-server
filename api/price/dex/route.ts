// api/price/dex/route.ts
// This file fetches the price of a cryptocurrency from a decentralized exchange (DEX) using its
import { NextRequest } from "next/server";
import { fetchDexPrice } from "@/lib/price/fetchDexPrice";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");
  const chain = searchParams.get("chain");

  if (!contract || !chain) {
    return new Response(JSON.stringify({ error: "Missing contract or chain" }), { status: 400 });
  }

  try {
    const price = await fetchDexPrice(contract, chain);
    return new Response(JSON.stringify({ price }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch Dex price" }), { status: 500 });
  }
}