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
}


export function TaxonNode({ taxon, side, exclude, index, total }: Props) {
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
      <div className="node-card">
        <div className="node-text">
          <span className="rank">{taxon.rank}</span>
          <span className={`node-name ${isItalicRank(taxon.rank) ? "is-sci" : ""}`}>{taxon.name}</span>
          {taxon.common && <span className="node-common">{taxon.common}</span>}
        </div>
        {examples.length > 0 && (
          <div className="examples" aria-label={`Other foods in ${taxon.name}`}>
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
          </div>
        )}
      </div>
    </motion.li>
  );
}

export function FoodCard({ food, side, taxon }: { food: Food; side: "a" | "b"; taxon?: Taxon }) {
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
            {taxon && <em>{taxon.name}</em>}
            {food.note && <span className="food-note">{food.note}</span>}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
