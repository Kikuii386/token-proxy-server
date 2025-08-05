// app/api/meta/dex/route.ts
import { GET as originalGET } from "@/lib/metadata/fetchDexMetadata";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const res = await originalGET(req);
  return new Response(res.body, {
    ...res,
    headers: {
      ...(res.headers || {}),
      "Access-Control-Allow-Origin": "*",
    },
  });
};