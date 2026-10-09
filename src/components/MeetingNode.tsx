import { motion } from "motion/react";
import type { Taxon } from "../data";
import { countUnder, examplesFor, isItalicRank } from "../lib/tree";
import { FoodImage } from "./FoodImage";

interface Props {
  taxon: Taxon;
  above: Taxon[];
  exclude: string[];
  onExplore: (taxon: Taxon, trigger: HTMLElement) => void;
}

export function MeetingNode({ taxon, above, exclude, onExplore }: Props) {
  const examples = examplesFor(taxon.id, exclude, 5);
  const total = countUnder(taxon.id);
  const extra = total - exclude.length - examples.length;
  const lineage = [...above].reverse();

  return (
    <motion.div
      key={taxon.id}
      className="meet"
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
    >
      <span className="meet-glow" aria-hidden="true" />
      <span className="meet-ring" aria-hidden="true" />
      {lineage.length > 0 && (
        <p className="lineage" aria-label="Lineage above the meeting point">
          {lineage.map((t, i) => (
            <span key={t.id}>
              {i > 0 && <span className="lineage-sep" aria-hidden="true">›</span>}
              <button
                type="button"
                className="lineage-item taxon-action"
                aria-label={`Explore ${t.name}, ${t.rank.toLowerCase()}`}
                aria-haspopup="dialog"
                onClick={(event) => onExplore(t, event.currentTarget)}
              >
                {t.name}
              </button>
            </span>
          ))}
          <span className="lineage-sep" aria-hidden="true">›</span>
        </p>
      )}
      <div className="meet-card">
        <span className="meet-eyebrow">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M7 1v12M1 7h12M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Where they meet
        </span>
        <span className="rank rank-meet">{taxon.rank}</span>
        <h2 className={`meet-name ${isItalicRank(taxon.rank) ? "is-sci" : ""}`}>{taxon.name}</h2>
        {taxon.common && <p className="meet-common">{taxon.common}</p>}
        {taxon.blurb && <p className="meet-blurb">{taxon.blurb}</p>}
        {examples.length > 0 && (
          <div className="meet-examples">
            <span className="examples-eyebrow">Also in this group</span>
            <ul className="meet-example-list">
              {examples.map((f) => (
                <li key={f.id} className="meet-example">
                  <FoodImage food={f} size={40} className="example-thumb" />
                  <span>{f.name}</span>
                </li>
              ))}
              {extra > 0 && <li className="meet-example meet-example-more">+{extra} more</li>}
            </ul>
          </div>
        )}
        <span className="meet-zoom-hint" aria-hidden="true">Explore this {taxon.rank.toLowerCase()} <span>↗</span></span>
        <button
          type="button"
          className="taxon-hit-area"
          aria-label={`Explore ${taxon.name}, ${taxon.rank.toLowerCase()}`}
          aria-haspopup="dialog"
          onClick={(event) => onExplore(taxon, event.currentTarget)}
        />
      </div>
    </motion.div>
  );
}
