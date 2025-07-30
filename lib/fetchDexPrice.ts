// lib/fetchDexPrice.ts

export async function fetchDexPrice(contract: string, chain: string): Promise<number | null> {
  try {
    const query = encodeURIComponent(`${chain}:${contract}`);
    const url = `https://api.dexscreener.com/latest/dex/pairs/${query}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const priceStr = data?.pair?.priceUsd;

    return priceStr ? parseFloat(priceStr) : null;
  } catch (err) {
    return null;
  }
}
