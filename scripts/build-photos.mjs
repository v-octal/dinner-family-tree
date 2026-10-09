import fs from "node:fs";
const rest = JSON.parse(fs.readFileSync("scripts/photos.json", "utf8"));
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
const map = {};
for (const [id, info] of Object.entries(rest)) {
  let url = info.thumb.split("?")[0];
  if (url.includes("/thumb/")) {
    url = url.replace(/^https:\/\/[^/]+/, "https://upload.wikimedia.org").replace(/\/(lossy-page1-)?330px-/, "/$1500px-");
  } else {
    const p = decodeURIComponent(url.replace(/^https:\/\/[^/]+\/wikipedia\/commons\//, ""));
    url = thumbFromPath(p);
  }
  map[id] = url;
}
for (const [id, p] of Object.entries(overrides)) map[id] = thumbFromPath(p);
const lines = Object.entries(map).sort().map(([id, u]) => `  "${id}": "${u}",`).join("\n");
fs.writeFileSync("src/data/photos.ts",
`// Photo URLs for the demo dataset. Images are served from Wikimedia Commons.
// Regenerate with: node scripts/build-photos.mjs
export const photos: Record<string, string> = {
${lines}
};
`);
// verify all
let bad = 0;
for (const [id, u] of Object.entries(map)) {
  const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": "dinner-family-tree-demo/0.1" } });
  if (!r.ok || !(r.headers.get("content-type") || "").startsWith("image")) { bad++; console.log("BAD", id, r.status, u); }
  await new Promise(r => setTimeout(r, 80));
}
console.log("total", Object.keys(map).length, "bad", bad);
