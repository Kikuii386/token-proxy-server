// lib/fetchCMCPrice.ts

const CMC_API_KEY = process.env.CMC_API_KEY!;

export async function fetchCMCPrice(cmc_id: number): Promise<number | null> {
  if (!cmc_id) return null;

  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${cmc_id}`;

    const res = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) return null;
    const json = await res.json();
    const price = json?.data?.[cmc_id]?.quote?.USD?.price;

    return typeof price === 'number' ? price : null;
  } catch (err) {
    return null;
  }
}