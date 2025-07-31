// types/Token.ts

export interface TokenInput {
  name: string;
  chain: string;
  contract: string;
  highEntry: number;
  highQty: number;
  highInv: number;
  lowEntry: number;
  lowQty: number;
  lowInv: number;
  totalEntry: number;
  totalQty: number;
  totalInv: number;
}

export interface TokenMetadata {
  cmc_id?: string;
  gecko_id?: string;
  symbol?: string;
  logo?: string;
}

export interface TokenWithPrice extends TokenInput, TokenMetadata {
  currentPrice?: number;
}

export interface TokenMapEntry {
  contract: string;
  chain: string;
  cmc_id?: string;
  gecko_id?: string;
  symbol?: string;
  logo?: string;
}
export interface EnrichedToken extends TokenInput, TokenMetadata {}