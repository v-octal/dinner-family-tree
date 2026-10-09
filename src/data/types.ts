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
