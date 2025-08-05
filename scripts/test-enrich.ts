// scripts/test-enrich.ts
import "dotenv/config";

(async () => {
  const url = new URL("http://localhost:3000/api/enrich-sheet");

  // เพิ่ม query params ตามที่ endpoint ของคุณต้องการ (ถ้ามี)
  url.searchParams.set("test", "true");

  try {
const res = await fetch(url.toString(), {
  method: "GET",
});

console.log("✅ Fetched, waiting for body...");
const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

    console.log("✅ Status:", res.status);
    console.log("✅ Headers:", Object.fromEntries(res.headers.entries()));
    console.log("✅ Response:", text);
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();