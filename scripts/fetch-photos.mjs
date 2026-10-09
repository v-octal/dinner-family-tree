import fs from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const file = new URL("./photos.json", import.meta.url);
const titleOverrides = {
  corn: "Maize",
  asparagus: "Asparagus officinalis",
  orange: "Orange (fruit)",
  coffee: "Coffee bean",
  cacao: "Cocoa bean",
  mint: "Mentha",
  date: "Date palm",
  lamb: "Lamb and mutton",
  chicken: "Chicken as food",
  egg: "Egg as food",
  turkey: "Turkey as food",
  duck: "Duck as food",
  salmon: "Salmon as food",
  cod: "Cod as food",
  lobster: "American lobster",
  crab: "Crab meat",
  squid: "Squid as food",
  mussel: "Blue mussel",
  "button-mushroom": "Agaricus bisporus",
  truffle: "Tuber melanosporum",
  "oyster-mushroom": "Pleurotus ostreatus",
  mulberry: "Morus alba",
  mandarin: "Mandarin orange",
  honeydew: "Honeydew (melon)",
  plantain: "Cooking banana",
  romanesco: "Romanesco broccoli",
  "water-chestnut": "Eleocharis dulcis",
  "moringa-pods": "Moringa oleifera",
  "moringa-leaves": "Moringa oleifera",
  "amaranth-greens": "Amaranthus tricolor",
  "black-bean": "Black turtle bean",
  "cannellini-bean": "Cannellini",
  "green-pea": "Pea",
  "sugar-snap-pea": "Snap pea",
  sage: "Salvia officinalis",
  mace: "Mace (spice)",
  "nigella-seed": "Nigella sativa",
  "brown-mustard-seed": "Brassica juncea",
  "yellow-mustard-seed": "White mustard",
  hibiscus: "Roselle (plant)",
  sumac: "Rhus coriaria",
  milk: "Milk",
  "buffalo-milk": "Buffalo milk",
  bison: "American bison",
  rabbit: "European rabbit",
  quail: "Quail as food",
  "quail-egg": "Quail eggs",
  goose: "Goose as food",
  pheasant: "Common pheasant",
  ostrich: "Common ostrich",
  sardine: "Sardines as food",
  anchovy: "Anchovies as food",
  herring: "Herring as food",
  tilapia: "Nile tilapia",
  catfish: "Channel catfish",
  carp: "Common carp",
  halibut: "Atlantic halibut",
  sole: "Common sole",
  "sea-bass": "European seabass",
  "sea-bream": "Gilt-head bream",
  octopus: "Octopus as food",
  cuttlefish: "Common cuttlefish",
  scallop: "Pecten maximus",
  clam: "Manila clam",
  abalone: "Blacklip abalone",
  crayfish: "Procambarus clarkii",
  shimeji: "Hypsizygus marmoreus",
  "wood-ear": "Auricularia heimuer",
};

function readCalls(path, helper) {
  const source = ts.createSourceFile(path.href, fs.readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  const rows = [];
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === helper) {
      const args = node.arguments.slice(0, 3);
      if (args.length !== 3 || !args.every(ts.isStringLiteral)) {
        throw new Error(`Expected three string arguments in ${helper}() in ${path.pathname}`);
      }
      const note = node.arguments[4];
      rows.push([...args.map(arg => arg.text), note && ts.isStringLiteral(note) ? note.text : ""]);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!rows.length) throw new Error(`No ${helper}() entries in ${path.pathname}`);
  return rows;
}

export function readFoods() {
  const species = new Map(readCalls(new URL("../src/data/taxa.ts", import.meta.url), "t")
    .filter(([, , rank]) => rank === "Species")
    .map(([id, name]) => [id, name.replace(/ agg\.$/, "")]));
  const foods = readCalls(new URL("../src/data/foods.ts", import.meta.url), "f")
    .map(([id, name, taxon, note]) => {
      if (!species.has(taxon)) throw new Error(`Missing species for ${id}: ${taxon}`);
      return { id, name, species: species.get(taxon), note };
    });
  if (new Set(foods.map(food => food.id)).size !== foods.length) throw new Error("Duplicate food IDs");
  return foods;
}

const needsFoodPhoto = food => /milk|curd|\begg\b|starch|\boil\b|extract|milled|parboiled|sprouted|concentrated|dried (grape|plum)|ground pepper/i.test(food.note || "");

const foodTitleKey = title => title.toLowerCase().replace(/s$/, "");

export function titlesForFood(food) {
  return [...new Set([titleOverrides[food.id] || food.name, !needsFoodPhoto(food) && food.species].filter(Boolean))];
}

export const isImageUrl = value => typeof value === "string" &&
  /^https:\/\/(?:thumb|upload)\.wikimedia\.org\/wikipedia\/[^\s]+$/.test(value);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const photoFile = new URL("../src/data/photos.ts", import.meta.url);

function readExistingPhotos() {
  if (!fs.existsSync(photoFile)) return {};
  return Object.fromEntries([...fs.readFileSync(photoFile, "utf8").matchAll(/^\s+"([a-z-]+)": "(https:[^"]+)",?$/gm)]
    .map(([, id, url]) => [id, url]));
}

export function imageKey(url) {
  if (!isImageUrl(url)) return null;
  const parts = new URL(url).pathname.split("/");
  const thumb = parts.indexOf("thumb");
  try {
    return decodeURIComponent(thumb < 0 ? parts.at(-1) : parts[thumb + 3]);
  } catch {
    return url;
  }
}

export function retryDeadline(cache, modifiedAt = 0) {
  let deadline = 0;
  for (const info of Object.values(cache)) {
    for (const attempt of info?.attempts || []) {
      const legacyDelay = attempt.reason?.match(/HTTP 429; Retry-After: (\d+)$/)?.[1];
      deadline = Math.max(deadline, Date.parse(attempt.retryAt) || (legacyDelay ? modifiedAt + Number(legacyDelay) * 1000 : 0));
    }
  }
  return deadline;
}

export async function fetchPhotos({
  foods = readFoods(),
  cache = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {},
  existingPhotos = readExistingPhotos(),
  modifiedAt = fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0,
  request = fetch,
  wait = sleep,
  save = data => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`),
} = {}) {
  const results = new Map();
  const usedImages = new Set([
    ...Object.values(existingPhotos),
    ...Object.values(cache).flatMap(info => [info?.thumb, info?.src]),
  ].map(imageKey).filter(Boolean));
  const hasPhoto = food => isImageUrl(cache[food.id]?.thumb) || isImageUrl(existingPhotos[food.id]);
  const attempts = new Map();
  let added = 0;
  let requests = 0;
  let stopped = retryDeadline(cache, modifiedAt) > Date.now();
  if (stopped) console.warn("Retry-After interval remains active. No requests sent.");

  async function batch(titles) {
    if (requests++) await wait(4000);
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.search = new URLSearchParams({
      action: "query", format: "json", formatversion: "2", redirects: "1", maxlag: "5",
      prop: "pageimages|pageprops|info", ppprop: "disambiguation", inprop: "url",
      piprop: "thumbnail|original", pithumbsize: "500", titles: titles.join("|"),
    }).toString();
    const source = url.href;
    const checkedAt = new Date().toISOString();
    let failure;
    try {
      const response = await request(source, {
        headers: { "User-Agent": "dinner-family-tree-demo/0.1 (local dev)", "Accept": "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        const retryAfter = response.headers.get("retry-after");
        const deadline = retryAfter && (/^\d+$/.test(retryAfter) ? Date.now() + Number(retryAfter) * 1000 : Date.parse(retryAfter));
        failure = {
          reason: `HTTP ${response.status}${retryAfter ? `; Retry-After: ${retryAfter}` : ""}`,
          retryAfter: retryAfter || undefined,
          retryAt: deadline ? new Date(deadline).toISOString() : undefined,
        };
        await response.body?.cancel();
      } else {
        const data = await response.json();
        if (data.error) throw new Error(`API ${data.error.code}: ${data.error.info}`);
        if (!Array.isArray(data.query?.pages)) throw new Error("API response has no pages");
        const redirects = new Map([...(data.query.normalized || []), ...(data.query.redirects || [])]
          .map(({ from, to }) => [from, to]));
        const pages = new Map(data.query.pages.map(page => [page.title, page]));
        for (const title of titles) {
          let resolved = title;
          const seen = new Set();
          while (redirects.has(resolved) && !seen.has(resolved)) {
            seen.add(resolved);
            resolved = redirects.get(resolved);
          }
          const page = pages.get(resolved);
          let result;
          if (!page || page.missing || page.invalid) {
            result = { reason: "Missing page" };
          } else if (Object.hasOwn(page.pageprops || {}, "disambiguation")) {
            result = { reason: "Disambiguation page" };
          } else if (!isImageUrl(page.thumbnail?.source)) {
            result = { reason: "No thumbnail" };
          } else {
            result = {
              title, resolvedTitle: page.title, thumb: page.thumbnail.source,
              src: isImageUrl(page.original?.source) ? page.original.source : page.thumbnail.source,
              page: page.fullurl,
            };
          }
          results.set(title, { ...result, source, checkedAt });
        }
        console.log("batch", requests, "titles", titles.length);
      }
    } catch (error) {
      failure = { reason: error.message };
    }
    if (failure) {
      stopped = true;
      console.warn("API unavailable. Stop requests:", failure.reason);
      for (const title of titles) results.set(title, { ...failure, source, checkedAt });
    }
  }

  for (let round = 0; round < 2 && !stopped; round++) {
    const groups = new Map();
    for (const food of foods) {
      const title = titlesForFood(food)[round];
      if (hasPhoto(food) || !title) continue;
      if (!groups.has(title)) groups.set(title, []);
      groups.get(title).push(food);
    }
    const titles = [...groups.keys()];
    for (let offset = 0; offset < titles.length && !stopped; offset += 30) {
      const chunk = titles.slice(offset, offset + 30);
      const pending = chunk.filter(title => !results.has(title));
      if (pending.length) await batch(pending);
      for (const title of chunk) {
        const info = results.get(title);
        for (const food of groups.get(title)) {
          let reason = info.reason;
          if (isImageUrl(info.thumb)) {
            if (needsFoodPhoto(food) && foodTitleKey(info.resolvedTitle) !== foodTitleKey(title)) {
              reason = "Redirect is not food-specific";
            } else if ([info.thumb, info.src].some(url => usedImages.has(imageKey(url)))) {
              reason = "Image already used by another food";
            } else {
              cache[food.id] = { ...info, title };
              usedImages.add(imageKey(info.thumb));
              usedImages.add(imageKey(info.src));
              added++;
              continue;
            }
          }
          if (!attempts.has(food.id)) attempts.set(food.id, []);
          attempts.get(food.id).push({ title, reason, resolvedTitle: info.resolvedTitle,
            source: info.source, checkedAt: info.checkedAt, retryAfter: info.retryAfter, retryAt: info.retryAt });
          cache[food.id] = { title: titlesForFood(food)[0], attempts: attempts.get(food.id) };
        }
      }
      save(cache);
    }
  }
  const missing = foods.filter(food => !hasPhoto(food)).map(food => food.id);
  console.log("total", foods.length - missing.length, "added", added, "requests", requests);
  console.log(`missing (${missing.length}): ${missing.join(", ") || "none"}`);
  return { cache, added, missing, requests, stopped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await fetchPhotos();
}
