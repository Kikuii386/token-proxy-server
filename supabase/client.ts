// supabase/client.ts
import "dotenv/config"
import { createClient } from "@supabase/supabase-js";
import type { TokenMapEntry } from "../types/Token";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = "token_mappings";

export async function getMappedToken(contract: string, chain: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("symbol, logo, cmc_id, gecko_id")
    .eq("contract", contract)
    .eq("chain", chain)
    .single();

  if (error || !data) return null;
  return data;
}

export async function saveTokenMapping(token: TokenMapEntry) {
  const { error } = await supabase.from(TABLE).upsert({
    contract: token.contract,
    chain: token.chain,
    symbol: token.symbol,
    logo: token.logo,
    cmc_id: token.cmc_id,
    gecko_id: token.gecko_id,
    updated_at: new Date().toISOString(),
  });
  return !error;
}