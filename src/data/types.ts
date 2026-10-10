export type Rank =
  | "Domain"
  | "Kingdom"
  | "Clade"
  | "Phylum"
  | "Class"
  | "Order"
  | "Family"
  | "Genus"
  | "Species";

export interface Taxon {
  id: string;
  /** Scientific name, e.g. "Rosaceae". */
  name: string;
  rank: Rank;
  /** Parent taxon id, or null for the root. */
  parent: string | null;
  /** Friendly name, e.g. "Rose family". */
  common?: string;
  /** One-line note shown at the meeting point. */
  blurb?: string;
}

export interface Food {
  id: string;
  name: string;
  /** Id of the species-level taxon this food comes from. */
  taxon: string;
  photo: string;
  emoji: string;
  /** Short note about which part of the organism we eat. */
  note?: string;
}

export interface Ingredient {
  /** Id of the raw food in `foods.ts`. */
  food: string;
  /** Kitchen name when it differs from the raw food, e.g. "Parmesan" for cow's milk. */
  as?: string;
}

export interface Dish {
  id: string;
  name: string;
  /** Cuisine or a short description. */
  note: string;
  /** Raw ingredients, main ingredient first. */
  ingredients: Ingredient[];
}
