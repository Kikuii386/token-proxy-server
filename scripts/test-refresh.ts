

import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function testRefreshPrices() {
  try {
    const res = await fetch("http://localhost:3000/api/refresh-prices", {
      method: "POST",
    });

    const data = await res.json();

    console.log("✅ Response:", data);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testRefreshPrices();