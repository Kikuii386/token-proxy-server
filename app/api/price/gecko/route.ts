// api/price/gecko/route.ts
// This file fetches the price of a cryptocurrency from CoinGecko using its ID.
import { NextRequest } from "next/server";
import { fetchGeckoPrice } from "@/lib/price/fetchGeckoPrice";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  try {
    const price = await fetchGeckoPrice(id);
    return new Response(JSON.stringify({ price }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch Gecko price" }), { status: 500 });
  }
}