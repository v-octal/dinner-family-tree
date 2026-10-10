import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const server = await createServer({
  root: fileURLToPath(new URL("../", import.meta.url)),
  configFile: false,
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});

try {
  const { foods, taxa } = await server.ssrLoadModule("/src/data/index.ts");
  const { photos } = await server.ssrLoadModule("/src/data/photos.ts");
  const { rankDetails, taxonNotes } = await server.ssrLoadModule("/src/data/taxonDetails.ts");
  const byId = new Map(taxa.map(taxon => [taxon.id, taxon]));
  const foodIds = new Set(foods.map(food => food.id));
  assert.equal(byId.size, taxa.length, "Taxon IDs must be unique");
  assert.equal(foodIds.size, foods.length, "Food IDs must be unique");
  assert.equal(new Set(foods.map(food => food.name.toLowerCase())).size, foods.length, "Food names must be unique");
  assert.deepEqual(taxa.filter(taxon => taxon.parent === null).map(taxon => taxon.id), ["eukaryota"]);

  const paths = new Map();
  for (const taxon of taxa) {
    assert.match(taxon.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(taxon.name.trim(), `Empty taxon name: ${taxon.id}`);
    assert.ok(rankDetails[taxon.rank], `Unknown rank: ${taxon.id}`);
    const path = [];
    let current = taxon;
    while (current) {
      assert.ok(!path.includes(current.id), `Cycle at ${current.id}`);
      path.push(current.id);
      if (current.parent === null) break;
      assert.ok(byId.has(current.parent), `Missing parent for ${current.id}`);
      current = byId.get(current.parent);
    }
    assert.equal(path.at(-1), "eukaryota", `Disconnected taxon: ${taxon.id}`);
    paths.set(taxon.id, path);
    if (taxon.rank === "Species") {
      assert.equal(byId.get(taxon.parent)?.rank, "Genus", `Missing genus: ${taxon.id}`);
      assert.equal(taxon.name.split(" ")[0], byId.get(taxon.parent).name, `Genus name mismatch: ${taxon.id}`);
    }
  }

  for (const food of foods) {
    assert.match(food.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.equal(byId.get(food.taxon)?.rank, "Species", `Invalid species: ${food.id}`);
    assert.ok(food.name.trim() && food.note?.trim() && food.emoji.trim(), `Incomplete food: ${food.id}`);
    assert.equal(typeof food.photo, "string", `Missing fallback photo value: ${food.id}`);
    if (food.photo) {
      const url = new URL(food.photo);
      assert.equal(url.protocol, "https:");
      assert.ok(["upload.wikimedia.org", "thumb.wikimedia.org"].includes(url.hostname), `Unexpected photo source: ${food.id}`);
    }
  }
  const { dishes } = await server.ssrLoadModule("/src/data/index.ts");
  const foodNames = new Set(foods.map(food => food.name.toLowerCase()));
  assert.equal(new Set(dishes.map(dish => dish.id)).size, dishes.length, "Dish IDs must be unique");
  assert.equal(new Set(dishes.map(dish => dish.name.toLowerCase())).size, dishes.length, "Dish names must be unique");
  for (const dish of dishes) {
    assert.match(dish.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(dish.name.trim() && dish.note.trim(), `Incomplete dish: ${dish.id}`);
    assert.ok(!foodNames.has(dish.name.toLowerCase()), `Dish name matches a food name: ${dish.id}`);
    assert.ok(dish.ingredients.length >= 2, `Dish needs two or more ingredients: ${dish.id}`);
    const used = dish.ingredients.map(item => item.food);
    assert.equal(new Set(used).size, used.length, `Repeated ingredient in dish: ${dish.id}`);
    for (const item of dish.ingredients) {
      assert.ok(foodIds.has(item.food), `Unknown ingredient ${item.food} in dish: ${dish.id}`);
      if (item.as !== undefined) assert.ok(item.as.trim(), `Empty kitchen name in dish: ${dish.id}`);
    }
  }

  for (const id of Object.keys(photos)) assert.ok(foodIds.has(id), `Photo without a food: ${id}`);
  for (const id of Object.keys(taxonNotes)) assert.ok(byId.has(id), `Note without a taxon: ${id}`);

  const { connect, pathToRoot, foodsUnder, childrenOf, countUnder, examplesFor } = await server.ssrLoadModule("/src/lib/tree.ts");
  for (const taxon of taxa) {
    const expected = foods.filter(food => paths.get(food.taxon).includes(taxon.id));
    assert.ok(expected.length > 0, `Unused taxon: ${taxon.id}`);
    assert.deepEqual(pathToRoot(taxon.id).map(item => item.id), paths.get(taxon.id));
    assert.deepEqual(foodsUnder(taxon.id).map(food => food.id).sort(), expected.map(food => food.id).sort());
    assert.equal(countUnder(taxon.id), expected.length);
    assert.deepEqual(childrenOf(taxon.id).map(child => child.id), taxa.filter(child => child.parent === taxon.id).map(child => child.id));
    const excluded = expected[0].id;
    assert.equal(countUnder(taxon.id, [excluded, excluded]), expected.length - 1);
    assert.ok(examplesFor(taxon.id, [excluded], 3).every(food => food.id !== excluded));
    const copy = foodsUnder(taxon.id);
    copy.length = 0;
    assert.equal(countUnder(taxon.id), expected.length, "Descendant arrays must be copies");
  }

  let pairs = 0;
  for (const a of foods) {
    for (const b of foods) {
      const pathA = paths.get(a.taxon);
      const pathB = paths.get(b.taxon);
      const expected = pathA.find(id => pathB.includes(id));
      const result = connect(a, b);
      assert.equal(result.meet.id, expected, `Wrong ancestor: ${a.id}/${b.id}`);
      assert.deepEqual(result.pathA.map(taxon => taxon.id), pathA.slice(0, pathA.indexOf(expected)));
      assert.deepEqual(result.pathB.map(taxon => taxon.id), pathB.slice(0, pathB.indexOf(expected)));
      assert.deepEqual(result.above.map(taxon => taxon.id), paths.get(expected).slice(1));
      pairs++;
    }
  }

  const examples = [
    ["cabbage", "broccoli", "brassica-oleracea"],
    ["nectarine", "peach", "prunus-persica"],
    ["milk", "beef", "bos-taurus"],
    ["tofu", "edamame", "glycine-max"],
    ["nutmeg", "mace", "myristica-fragrans"],
    ["cilantro", "coriander-seed", "coriandrum-sativum"],
    ["pine-nut", "apple", "plantae"],
    ["star-anise", "anise", "angiosperms"],
    ["porcini", "button-mushroom", "agaricomycetes"],
    ["rainbow-trout", "salmon", "salmonidae"],
  ];
  for (const [a, b, ancestor] of examples) {
    assert.equal(connect(foods.find(food => food.id === a), foods.find(food => food.id === b)).meet.id, ancestor);
  }

  const missingPhotos = foods.filter(food => !food.photo).map(food => food.id);
  console.log(`Validated ${foods.length} foods, ${dishes.length} dishes, ${taxa.length} taxa, and ${pairs} ordered food pairs.`);
  console.log(`Photos: ${foods.length - missingPhotos.length}; text fallbacks: ${missingPhotos.length}.`);
  if (missingPhotos.length) console.log(`Photo fallbacks: ${missingPhotos.join(", ")}`);
} finally {
  await server.close();
}
