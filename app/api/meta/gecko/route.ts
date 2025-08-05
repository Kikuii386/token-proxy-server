import { GET as originalGET } from "@/lib/metadata/fetchFromGecko";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const res = await originalGET(request);
  return new Response(res.body, {
    ...res,
    headers: {
      ...(res.headers || {}),
      "Access-Control-Allow-Origin": "*",
    },
  });
}