// lib/fetchFromCMC.ts
import { getDexPlatformName } from "./utils";

const CMC_API = "https://pro-api.coinmarketcap.com/v1";
const CMC_KEY = process.env.CMC_API_KEY!;

function cmcHeaders() {
  return {
    "X-CMC_PRO_API_KEY": CMC_KEY,
    Accept: "application/json",
  };
}

export async function fetchCMCMetadata(contract: string, chain: string) {
  const platform = chain.toLowerCase();
  const query = new URLSearchParams({ address: contract, aux: "platform,logo" });

  // Step 1: Try cryptocurrency/map
  const res = await fetch(`${CMC_API}/cryptocurrency/map?${query}`, {
    headers: cmcHeaders(),
  });
  const data = await res.json();
  const matched = data?.data?.find((t: any) => t.platform?.slug === platform);

  if (matched) {
    return {
      cmc_id: matched.id,
      symbol: matched.symbol,
      logo: matched.logo || null,
    };
  }

  // Step 2: fallback to DEX map
  const dexPlatform = getDexPlatformName(chain);
  const dexRes = await fetch(`${CMC_API}/dex/map?address=${contract}&platform=${dexPlatform}`, {
    headers: cmcHeaders(),
  });
  const dexData = await dexRes.json();
  const dexMatched = dexData?.data?.[0];

  if (dexMatched) {
    return {
      cmc_id: dexMatched.id,
      symbol: dexMatched.symbol,
      logo: dexMatched.logo || null,
    };
  }

  return null;
}