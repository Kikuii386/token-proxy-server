// app/api/price/dex/route.ts
import { NextRequest } from "next/server";
import { fetchDexPrice } from "@/lib/price/fetchDexPrice";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");
  const chain = searchParams.get("chain");

  if (!contract || !chain) {
    return new Response(JSON.stringify({ error: "Missing contract or chain" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const price = await fetchDexPrice(contract, chain);
    return new Response(JSON.stringify({ price }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch Dex price" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}