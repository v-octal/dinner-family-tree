import { motion } from "motion/react";
import type { Food, Taxon } from "../data";
import { countUnder, examplesFor, isItalicRank } from "../lib/tree";
import { FoodImage } from "./FoodImage";

interface Props {
  taxon: Taxon;
  side: "a" | "b";
  exclude: string[];
  /** 0 = nearest the meeting point. */
  index: number;
  total: number;
  onExplore: (taxon: Taxon, trigger: HTMLElement) => void;
}

export function TaxonNode({ taxon, side, exclude, index, total, onExplore }: Props) {
  const examples = examplesFor(taxon.id, exclude, 3);
  const extra = countUnder(taxon.id, exclude) - examples.length;
  const delay = (total - 1 - index) * 0.055;

  return (
    <motion.li
      layout="position"
      className={`node node-${side}`}
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
    >
      <span className="stem" aria-hidden="true" />
      <button
        type="button"
        className="node-card taxon-action"
        aria-label={`Explore ${taxon.name}, ${taxon.rank.toLowerCase()}`}
        aria-haspopup="dialog"
        onClick={(event) => onExplore(taxon, event.currentTarget)}
      >
        <span className="node-text">
          <span className="rank">{taxon.rank}</span>
          <span className={`node-name ${isItalicRank(taxon.rank) ? "is-sci" : ""}`}>{taxon.name}</span>
          {taxon.common && <span className="node-common">{taxon.common}</span>}
        </span>
        <span className="node-zoom" aria-hidden="true">↗</span>
        {examples.length > 0 && (
          <span className="examples">
            <span className="examples-thumbs" aria-hidden="true">
              {examples.map((f) => (
                <FoodImage key={f.id} food={f} size={30} className="example-thumb" />
              ))}
            </span>
            <span className="examples-names">
              <span className="examples-eyebrow">also here</span>
              {examples.map((f) => f.name).join(", ")}
              {extra > 0 && <span className="examples-more"> +{extra}</span>}
            </span>
          </span>
        )}
      </button>
    </motion.li>
  );
}

export function FoodCard({ food, side, taxon, onExplore }: {
  food: Food;
  side: "a" | "b";
  taxon?: Taxon;
  onExplore: (taxon: Taxon, trigger: HTMLElement) => void;
}) {
  return (
    <motion.li
      layout="position"
      className={`node node-${side} node-food`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
    >
      <span className="stem" aria-hidden="true" />
      <div className="food-card">
        <div className="food-photo">
          <FoodImage food={food} decorative={false} />
          <span className="food-badge">
            <span className="food-badge-dot" aria-hidden="true" />
            Your pick
          </span>
        </div>
        <div className="food-caption">
          <span className="food-name">{food.name}</span>
          <span className="food-meta">
            {taxon && (
              <button
                type="button"
                className="food-taxon-link taxon-action"
                aria-label={`Explore ${taxon.name}, species`}
                aria-haspopup="dialog"
                onClick={(event) => onExplore(taxon, event.currentTarget)}
              >
                <em>{taxon.name}</em>
              </button>
            )}
            {food.note && <span className="food-note">{food.note}</span>}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
