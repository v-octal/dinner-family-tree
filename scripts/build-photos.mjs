import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { isImageUrl, readFoods } from "./fetch-photos.mjs";

const cacheFile = new URL("./photos.json", import.meta.url);
const outputFile = new URL("../src/data/photos.ts", import.meta.url);
const overrides = {
  peach: "9/9e/Autumn_Red_peaches.jpg",
  corn: "7/7d/Corncobs.jpg",
  "black-pepper": "3/31/Black_Pepper_(Piper_nigrum)_fruits.jpg",
  coconut: "a/a4/Coconut_art.jpg",
  peanut: "f/fb/Peanuts_(Arachis_hypogaea)_-_in_shell,_shell_cracked_open,_shelled,_peeled.jpg",
  sesame: "e/ef/Sesame-Seeds.jpg",
  ginger: "9/93/Ingwer_2_(fcm).jpg",
  garlic: "2/22/Garlic.jpg",
  squid: "2/23/Grilled_squid.jpg",
  salmon: "d/d6/Salmon_sashimi.jpg",
  tuna: "0/05/Thunnus_albacares.jpg",
  chicken: "7/72/Roast_Chicken.jpg",
  duck: "b/b5/Roast_duck.jpg",
  rice: "d/d3/Uncooked_rice.jpg",
  spinach: "f/fe/Spinach_leaves.jpg",
  quinoa: "4/43/Red_quinoa.png",
  vanilla: "3/30/Vanilla_6beans.JPG",
  shrimp: "a/ad/Cooked_shrimp.jpg",
  cod: "4/47/Cod_fillet.jpg",
  wheat: "b/b4/Wheat_close-up.JPG",
  "goat-cheese": "1/12/Chèvre.jpg",
  asparagus: "e/e8/Asparagus_bundle.jpg",
};
const enc = (s) => encodeURIComponent(s).replace(/%2F/g, "/");
const thumbFromPath = (p) => {
  const name = p.split("/").pop();
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${enc(p)}/500px-${enc(name)}`;
};
export function createPhotoMap(rest) {
  const map = {};
  const missing = [];
  for (const [id, info] of Object.entries(rest)) {
    if (!isImageUrl(info?.thumb)) {
      if (!Object.hasOwn(overrides, id)) missing.push(id);
      continue;
    }
    let url = info.thumb.split("?")[0];
    if (!info.summary && !info.source) {
      if (url.includes("/thumb/")) {
        url = url.replace(/^https:\/\/[^/]+/, "https://upload.wikimedia.org").replace(/\/(lossy-page1-)?330px-/, "/$1500px-");
      } else if (url.includes("/wikipedia/commons/")) {
        try {
          const p = decodeURIComponent(url.replace(/^https:\/\/[^/]+\/wikipedia\/commons\//, ""));
          url = thumbFromPath(p);
        } catch {
          if (!Object.hasOwn(overrides, id)) missing.push(id);
          continue;
        }
      }
    }
    map[id] = url;
  }
  for (const [id, p] of Object.entries(overrides)) map[id] = thumbFromPath(p);
  return { map, missing };
}

// verify all
export async function verifyPhotos(map, {
  request = fetch,
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  let bad = 0;
  let checked = 0;
  let failures = 0;
  const seen = new Set();
  for (const [id, url] of Object.entries(map)) {
    if (seen.has(url)) continue;
    seen.add(url);
    if (checked++) await wait(500);
    try {
      const response = await request(url, {
        method: "HEAD",
        headers: { "User-Agent": "dinner-family-tree-demo/0.1 (local dev)" },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok || !(response.headers.get("content-type") || "").startsWith("image/")) {
        bad++;
        console.warn("BAD", id, response.status, url);
      }
      if ([401, 403, 429].includes(response.status)) break;
      failures = response.status >= 500 ? failures + 1 : 0;
    } catch (error) {
      bad++;
      failures++;
      console.warn("BAD", id, error.message);
    }
    if (failures >= 3) break;
  }
  const total = new Set(Object.values(map)).size;
  console.log("verified", checked, "bad", bad, "unchecked", total - checked);
  return { checked, bad, unchecked: total - checked };
}

export async function buildPhotos({ skipVerify = false } = {}) {
  const rest = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  const { map, missing: skipped } = createPhotoMap(rest);
  const missing = [...new Set([...skipped, ...readFoods().filter(food => !map[food.id]).map(food => food.id)])];
  const lines = Object.entries(map).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([id, url]) => `  ${JSON.stringify(id)}: ${JSON.stringify(url)},`).join("\n");
  const comments = fs.existsSync(outputFile)
    ? fs.readFileSync(outputFile, "utf8").match(/^(?:\/\/[^\n]*\n)*/)[0]
    : "";
  fs.writeFileSync(outputFile, `${comments}export const photos: Record<string, string> = {\n${lines}\n};\n`);
  console.log("total", Object.keys(map).length, "skipped", missing.length);
  if (missing.length) console.log("missing:", missing.join(", "));
  if (skipVerify) {
    console.log("Verification skipped.");
  } else {
    const result = await verifyPhotos(map);
    if (result.bad || result.unchecked) process.exitCode = 1;
  }
  return { map, missing };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== "--skip-verify")) throw new Error("Usage: node scripts/build-photos.mjs [--skip-verify]");
  await buildPhotos({ skipVerify: args.includes("--skip-verify") });
}
