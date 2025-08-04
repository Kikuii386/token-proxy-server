// lib/price/fetchGeckoPrice.ts
// This file fetches the price of a cryptocurrency from CoinGecko using its ID.
export async function fetchGeckoPrice(gecko_id: string): Promise<number | null> {
  if (!gecko_id) return null;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${gecko_id}&vs_currencies=usd`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const price = json?.[gecko_id]?.usd;

    return typeof price === 'number' ? price : null;
  } catch (err) {
    return null;
  }
}