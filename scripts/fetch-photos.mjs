import fs from "node:fs";
const foods = [
  ["apple", "Apple"], ["strawberry", "Strawberry"], ["almond", "Almond"], ["cherry", "Cherry"], ["peach", "Peach"],
  ["tomato", "Tomato"], ["potato", "Potato"], ["chili", "Chili pepper"], ["eggplant", "Eggplant"], ["sweet-potato", "Sweet potato"],
  ["carrot", "Carrot"], ["broccoli", "Broccoli"], ["cauliflower", "Cauliflower"], ["kale", "Kale"],
  ["rice", "Rice"], ["wheat", "Wheat"], ["corn", "Maize"], ["banana", "Banana"], ["ginger", "Ginger"],
  ["onion", "Onion"], ["garlic", "Garlic"], ["asparagus", "Asparagus officinalis"], ["vanilla", "Vanilla"],
  ["peanut", "Peanut"], ["soybean", "Soybean"], ["chickpea", "Chickpea"], ["lentil", "Lentil"],
  ["orange", "Orange (fruit)"], ["lemon", "Lemon"], ["mango", "Mango"], ["cashew", "Cashew"], ["pistachio", "Pistachio"],
  ["coffee", "Coffee bean"], ["cacao", "Cocoa bean"], ["grape", "Grape"], ["avocado", "Avocado"], ["cinnamon", "Cinnamon"],
  ["black-pepper", "Black pepper"], ["pumpkin", "Pumpkin"], ["cucumber", "Cucumber"], ["watermelon", "Watermelon"],
  ["sunflower-seed", "Sunflower seed"], ["lettuce", "Lettuce"], ["spinach", "Spinach"], ["beet", "Beetroot"], ["quinoa", "Quinoa"],
  ["walnut", "Walnut"], ["hazelnut", "Hazelnut"], ["basil", "Basil"], ["mint", "Mentha"], ["olive", "Olive"], ["sesame", "Sesame"],
  ["coconut", "Coconut"], ["date", "Date palm"],
  ["beef", "Beef"], ["lamb", "Lamb and mutton"], ["goat-cheese", "Goat cheese"], ["pork", "Pork"],
  ["chicken", "Chicken as food"], ["egg", "Egg as food"], ["turkey", "Turkey as food"], ["duck", "Duck as food"],
  ["salmon", "Salmon as food"], ["tuna", "Tuna"], ["cod", "Cod as food"],
  ["shrimp", "Shrimp"], ["lobster", "American lobster"], ["crab", "Crab meat"], ["squid", "Squid as food"],
  ["oyster", "Oyster"], ["mussel", "Blue mussel"], ["honey", "Honey"],
  ["button-mushroom", "Agaricus bisporus"], ["shiitake", "Shiitake"], ["truffle", "Tuber melanosporum"], ["oyster-mushroom", "Pleurotus ostreatus"],
];
const file = "scripts/photos.json";
const out = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
for (const [id, title] of foods) {
  if (out[id]?.thumb) continue;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "dinner-family-tree-demo/0.1 (local dev; contact: none)", "Accept": "application/json" } });
      if (r.status === 429) { await sleep(1500 * (attempt + 1)); continue; }
      const j = await r.json();
      out[id] = { title, thumb: j.thumbnail?.source, src: j.originalimage?.source || j.thumbnail?.source };
      console.log(id, "->", j.thumbnail ? "ok" : "MISSING", j.title);
      break;
    } catch { await sleep(1500 * (attempt + 1)); }
  }
  await sleep(350);
}
fs.writeFileSync(file, JSON.stringify(out, null, 2));
console.log("missing:", foods.filter(([id]) => !out[id]?.thumb).map(([id]) => id));
