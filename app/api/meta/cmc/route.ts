// /app/api/meta/cmc/route.ts
import { fetchCMCMetadata } from "@/lib/metadata/fetchFromCMC";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const contract = searchParams.get("contract");
  const chain = searchParams.get("chain");

  if (!contract || !chain) {
    return new Response(JSON.stringify({ error: "Missing contract or chain" }), { status: 400 });
  }

  try {
    const metadata = await fetchCMCMetadata(contract, chain);
    if (!metadata) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch from CMC" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { tokens } = await req.json();
    if (!tokens || !Array.isArray(tokens)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const results = await Promise.all(
      tokens.map(({ contract, chain }: { contract: string; chain: string }) =>
        fetchCMCMetadata(contract, chain)
      )
    );

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process POST" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
};