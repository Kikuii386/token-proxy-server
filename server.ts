// server.ts
import express from "express";
import{fetchCMCPrice} from "./lib/fetchCMCPrice";
import {fetchGeckoPrice} from "./lib/fetchGeckoPrice";
import {fetchDexPrice} from "./lib/fetchDexPrice";
import {fetchDexMetadata} from "./lib/fetchDexMetadata";
import {fetchFromCMC} from "./lib/fetchFromCMC";
import {fetchFromGecko} from "./lib/fetchFromGecko";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/price/cmc", async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing id" });
  }
  try {
    const price = await fetchCMCPrice(Number(id));
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CMC price" });
  }
});

app.get("/api/price/gecko", async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing id" });
  }
  try {
    const price = await fetchGeckoPrice(id);
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Gecko price" });
  }
});

app.get("/api/price/dex", async (req, res) => {
  const { contract, chain } = req.query;
  if (!contract || !chain || typeof contract !== "string" || typeof chain !== "string") {
    return res.status(400).json({ error: "Missing contract or chain" });
  }
  try {
    const price = await fetchDexPrice(contract, chain);
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Dex price" });
  }
});

app.get("/api/meta/dex", fetchDexMetadata);
app.get("/api/meta/cmc", fetchFromCMC);
app.get("/api/meta/gecko", fetchFromGecko);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});