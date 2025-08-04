// /api/enrich-sheet.ts (Next.js style)
import { NextRequest } from "next/server";
import { enrichTokens } from "@/core/enrichTokens";

export async function GET(req: NextRequest) {
  try {
    const sheetUrl = process.env.SHEET_ENDPOINT!;
    const raw = await fetch(sheetUrl);
    const tokens = await raw.json();

    const enriched = await enrichTokens(tokens);

    return new Response(JSON.stringify(enriched), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Enrich Error:", err);
    return new Response(JSON.stringify({ error: "Failed to enrich tokens" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}