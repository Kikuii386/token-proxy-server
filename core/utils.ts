// core/utils.ts

export function getDexPlatformName(chain: string): string {
  const map: Record<string, string> = {
    ETH: "ethereum",
    BSC: "binance-smart-chain",
    POLYGON: "polygon-pos",
    AVAX: "avalanche",
    ARB: "arbitrum",
    OP: "optimism",
    BASE: "base",
    FANTOM: "fantom",
    ZK: "zksync",
    LINEA: "linea",
    BLAST: "blast",
    SOL: "solana",
  };

  return map[chain.toUpperCase()] || chain.toLowerCase();
}