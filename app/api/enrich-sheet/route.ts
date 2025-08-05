// /app/api/enrich-sheet/route.ts
import { NextRequest } from "next/server";
import { enrichTokens } from "@/core/enrichTokens";

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const sheetUrl = process.env.SHEET_ENDPOINT;
    if (!sheetUrl) {
      return new Response(JSON.stringify({ error: "SHEET_ENDPOINT not set" }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    const raw = await fetch(sheetUrl);
    const tokens = await raw.json();

    const enriched = await enrichTokens(tokens);

    return new Response(JSON.stringify(enriched), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err: any) {
    console.error("Enrich Error:", err);
    return new Response(JSON.stringify({ error: "Failed to enrich tokens" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}