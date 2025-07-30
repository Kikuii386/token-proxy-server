// /api/enrich-sheet.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { enrichTokens } from "core/enrichTokens";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ดึงข้อมูลจาก Google Apps Script URL
    const sheetUrl = process.env.SHEET_ENDPOINT!; // ใส่ใน .env
    const raw = await fetch(sheetUrl);
    const tokens = await raw.json();

    // enrich
    const enriched = await enrichTokens(tokens);

    res.status(200).json(enriched);
  } catch (err: any) {
    console.error("Enrich Error:", err);
    res.status(500).json({ error: "Failed to enrich tokens" });
  }
}