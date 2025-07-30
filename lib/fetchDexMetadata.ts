// lib/fetchDexMetadata.ts

export async function fetchDexMetadata(contract: string): Promise<{
  symbol: string | null;
  logo: string | null;
} | null> {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${contract}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const first = data.pairs?.[0];

    return {
      symbol: first?.baseToken?.symbol ?? null,
      logo: first?.info?.imageUrl ?? null,
    };
  } catch {
    return null;
  }
}
