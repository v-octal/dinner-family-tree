import { foods, taxa, type Food, type Rank, type Taxon } from "../data";

export const taxonById = new Map<string, Taxon>(taxa.map((t) => [t.id, t]));
export const foodById = new Map<string, Food>(foods.map((f) => [f.id, f]));

/** Foods that descend from each taxon (including the taxon itself). */
const descendants = new Map<string, Food[]>();
for (const food of foods) {
  let cursor: Taxon | undefined = taxonById.get(food.taxon);
  while (cursor) {
    const list = descendants.get(cursor.id) ?? [];
    list.push(food);
    descendants.set(cursor.id, list);
    cursor = cursor.parent ? taxonById.get(cursor.parent) : undefined;
  }
}

/** Path from a taxon up to the root, starting with the taxon itself. */
export function pathToRoot(taxonId: string): Taxon[] {
  const path: Taxon[] = [];
  let cursor: Taxon | undefined = taxonById.get(taxonId);
  while (cursor) {
    path.push(cursor);
    cursor = cursor.parent ? taxonById.get(cursor.parent) : undefined;
  }
  return path;
}

export function examplesFor(taxonId: string, exclude: string[] = [], limit = 3): Food[] {
  const all = descendants.get(taxonId) ?? [];
  const seen = new Set<string>();
  const out: Food[] = [];
  for (const food of all) {
    if (exclude.includes(food.id) || seen.has(food.id)) continue;
    seen.add(food.id);
    out.push(food);
    if (out.length >= limit) break;
  }
  return out;
}

export function countUnder(taxonId: string, exclude: string[] = []): number {
  const ids = new Set((descendants.get(taxonId) ?? []).map((f) => f.id));
  for (const id of exclude) ids.delete(id);
  return ids.size;
}

export function foodsUnder(taxonId: string): Food[] {
  return [...(descendants.get(taxonId) ?? [])];
}

export function childrenOf(taxonId: string): Taxon[] {
  return taxa.filter((taxon) => taxon.parent === taxonId);
}

export interface Connection {
  a: Food;
  b: Food;
  /** Nearest shared taxon. */
  meet: Taxon;
  /** Taxa from A's species up to (not including) the meeting point. */
  pathA: Taxon[];
  /** Taxa from B's species up to (not including) the meeting point. */
  pathB: Taxon[];
  /** Taxa above the meeting point, nearest first. */
  above: Taxon[];
}

export function connect(a: Food, b: Food): Connection {
  const fullA = pathToRoot(a.taxon);
  const fullB = pathToRoot(b.taxon);
  const inB = new Set(fullB.map((t) => t.id));
  const meetIndexA = fullA.findIndex((t) => inB.has(t.id));
  const meet = fullA[meetIndexA];
  const meetIndexB = fullB.findIndex((t) => t.id === meet.id);
  return {
    a,
    b,
    meet,
    pathA: fullA.slice(0, meetIndexA),
    pathB: fullB.slice(0, meetIndexB),
    above: fullA.slice(meetIndexA + 1),
  };
}

const RANK_ORDER: Rank[] = [
  "Species",
  "Genus",
  "Family",
  "Order",
  "Class",
  "Phylum",
  "Clade",
  "Kingdom",
  "Domain",
];

export function rankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

/** Headline copy for the moment the two branches meet. */
export function describeMeeting(c: Connection): { title: string; detail: string } {
  const A = c.a.name;
  const B = c.b.name;
  const label = c.meet.common ? `${c.meet.common}` : c.meet.name;
  switch (c.meet.rank) {
    case "Species":
      return {
        title: `${A} and ${B} are the very same species.`,
        detail: `Both come from ${c.meet.name}. Different parts, different names, one organism.`,
      };
    case "Genus":
      return {
        title: `${A} and ${B} are siblings.`,
        detail: `They share the genus ${c.meet.name}: as close as two different species can be.`,
      };
    case "Family":
      return {
        title: `${A} and ${B} are cousins.`,
        detail: `Both belong to ${c.meet.name}, the ${label.toLowerCase()}.`,
      };
    case "Order":
      return {
        title: `${A} and ${B} share an order.`,
        detail: `Their families split within ${c.meet.name}, the ${label.toLowerCase()}.`,
      };
    case "Class":
      return {
        title: `${A} and ${B} are distant relatives.`,
        detail: `They part ways below the class ${c.meet.name} (${label.toLowerCase()}).`,
      };
    case "Phylum":
    case "Clade":
      return {
        title: `${A} and ${B} are far-flung kin.`,
        detail: `Their last shared branch is ${c.meet.name}, the ${label.toLowerCase()}.`,
      };
    case "Kingdom":
      return {
        title: `${A} and ${B} are in the same kingdom, and little else.`,
        detail: `They meet only at ${c.meet.name}. Everything below that is separate history.`,
      };
    default:
      return {
        title: `Only life itself connects ${A} and ${B}.`,
        detail: `Different kingdoms, one ancient ancestor: ${c.meet.name}.`,
      };
  }
}

/** Genus and species names are conventionally set in italics. */
export const isItalicRank = (rank: Rank) => rank === "Genus" || rank === "Species";
