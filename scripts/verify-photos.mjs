import fs from "node:fs";
const src = fs.readFileSync("src/data/photos.ts", "utf8");
const urls = [...src.matchAll(/"([a-z-]+)": "(https:[^"]+)"/g)];
let bad = 0;
for (const [, id, u] of urls) {
  let r;
  for (let a = 0; a < 3; a++) {
    r = await fetch(u, { method: "GET", headers: { "User-Agent": "dinner-family-tree-demo/0.1 (local dev)" } });
    if (r.status !== 429) break;
    await new Promise(res => setTimeout(res, 4000));
  }
  const ok = r.ok && (r.headers.get("content-type") || "").startsWith("image");
  if (!ok) { bad++; console.log("BAD", id, r.status, u); }
  await new Promise(res => setTimeout(res, 1200));
}
console.log("checked", urls.length, "bad", bad);
