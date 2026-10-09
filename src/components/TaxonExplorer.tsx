import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Food, Taxon } from "../data";
import { rankDetails, taxonNotes } from "../data/taxonDetails";
import { childrenOf, countUnder, foodsUnder, isItalicRank, pathToRoot, taxonById } from "../lib/tree";
import { FoodImage } from "./FoodImage";

interface Props {
  taxon: Taxon;
  trigger: HTMLElement;
  picks: [Food, Food];
  onNavigate: (taxon: Taxon) => void;
  onDismiss: () => void;
}

export function TaxonExplorer({ taxon, trigger, picks, onNavigate, onDismiss }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const backdropPress = useRef(false);
  const [expandedTaxon, setExpandedTaxon] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const lineage = pathToRoot(taxon.id).reverse();
  const parent = taxon.parent ? taxonById.get(taxon.parent) : undefined;
  const children = childrenOf(taxon.id);
  const members = foodsUnder(taxon.id).sort((a, b) => a.name.localeCompare(b.name));
  const foodCount = countUnder(taxon.id);
  const memberIds = new Set(members.map((food) => food.id));
  const displayedFoods = expandedTaxon === taxon.id ? members : members.slice(0, 8);
  const rank = rankDetails[taxon.rank];
  const note = taxonNotes[taxon.id];

  useEffect(() => {
    const dialog = dialogRef.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const origin = trigger.getBoundingClientRect();
    dialog.style.transformOrigin = `${origin.left + origin.width / 2 - dialog.offsetLeft}px ${origin.top + origin.height / 2 - dialog.offsetTop}px`;
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  useEffect(() => {
    dialogRef.current!.scrollTop = 0;
    titleRef.current?.focus({ preventScroll: true });
  }, [taxon.id]);

  return (
    <motion.dialog
      ref={dialogRef}
      className="taxon-explorer"
      aria-labelledby="explorer-title"
      aria-describedby="explorer-description"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.94 }}
      transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget) onDismiss();
        backdropPress.current = false;
      }}
    >
      <div className="explorer-toolbar">
        <button type="button" className="explorer-return" onClick={onDismiss}>
          <span aria-hidden="true">←</span> Back to tree
        </button>
        <span className="explorer-toolbar-label">The dinner field guide</span>
        <button type="button" className="icon-btn explorer-close" onClick={onDismiss} aria-label="Close taxon guide">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <motion.div
        key={taxon.id}
        className="explorer-content"
        initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.22 }}
      >
        <nav className="explorer-lineage" aria-label="Taxon ancestry">
          <ol>
            {lineage.map((ancestor) => (
              <li key={ancestor.id}>
                {ancestor.id === taxon.id ? (
                  <span className="explorer-ancestor is-current" aria-current="location">
                    <span className="rank">{ancestor.rank}</span>
                    <span className={isItalicRank(ancestor.rank) ? "is-sci" : ""}>{ancestor.name}</span>
                  </span>
                ) : (
                  <button type="button" className="explorer-ancestor" onClick={() => onNavigate(ancestor)} aria-label={`Explore ${ancestor.name}, ${ancestor.rank.toLowerCase()}`}>
                    <span className="rank">{ancestor.rank}</span>
                    <span className={isItalicRank(ancestor.rank) ? "is-sci" : ""}>{ancestor.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="explorer-header">
          <div>
            <p className="explorer-eyebrow">A closer look · {taxon.rank}</p>
            <h2 id="explorer-title" ref={titleRef} tabIndex={-1} className={`explorer-title ${isItalicRank(taxon.rank) ? "is-sci" : ""}`}>
              {taxon.name}
            </h2>
            {taxon.common && <p className="explorer-common">{taxon.common}</p>}
            <p id="explorer-description" className="explorer-description">
              {taxon.blurb ?? `This ${taxon.rank.toLowerCase()} contains ${foodCount} food${foodCount === 1 ? "" : "s"} in our dataset.`}
            </p>
          </div>
          <div className="explorer-count">
            <strong>{foodCount}</strong>
            <span>food{foodCount === 1 ? "" : "s"} in this dataset</span>
          </div>
        </header>

        <div className="explorer-picks" aria-label="Your food comparison">
          {picks.map((food, index) => (
            <span key={`${index}-${food.id}`} className={`explorer-pick explorer-pick-${index === 0 ? "a" : "b"} ${memberIds.has(food.id) ? "is-member" : ""}`}>
              <FoodImage key={food.id} food={food} size={28} />
              <span>{food.name}</span>
              <span className="explorer-pick-status">{memberIds.has(food.id) ? "In this group" : "Outside this group"}</span>
            </span>
          ))}
        </div>

        <div className="explorer-notes">
          <section className="explorer-rank-note" aria-labelledby="explorer-rank-title">
            <h3 id="explorer-rank-title">What is {taxon.rank === "Order" ? "an" : "a"} {taxon.rank.toLowerCase()}?</h3>
            <p>{rank.description}</p>
            <p className="explorer-rank-hint">{rank.hint}</p>
          </section>
          {note && (
            <section className="explorer-fact" aria-labelledby="explorer-fact-title">
              <span className="explorer-eyebrow">From biology to your plate</span>
              <h3 id="explorer-fact-title">{note.title}</h3>
              <p>{note.body}</p>
            </section>
          )}
        </div>

        <section className="explorer-section" aria-labelledby="explorer-branches-title">
          <div className="explorer-section-heading">
            <h3 id="explorer-branches-title">{children.length > 0 ? "Explore the branches" : "The species level"}</h3>
            {children.length > 0 && <span>{children.length} group{children.length === 1 ? "" : "s"} in this dataset</span>}
          </div>
          {children.length > 0 ? (
            <ul className="explorer-children">
              {children.map((child) => (
                <li key={child.id}>
                  <button type="button" className="explorer-child" onClick={() => onNavigate(child)} aria-label={`Explore ${child.name}, ${child.rank.toLowerCase()}`}>
                    <span className="explorer-child-text">
                      <span className="rank">{child.rank}</span>
                      <span className={`explorer-child-name ${isItalicRank(child.rank) ? "is-sci" : ""}`}>{child.name}</span>
                      {child.common && <span className="explorer-child-common">{child.common}</span>}
                    </span>
                    <span className="explorer-child-count">{countUnder(child.id)} food{countUnder(child.id) === 1 ? "" : "s"}</span>
                    <span className="explorer-child-arrow" aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="explorer-leaf-note">This is the most specific taxonomic level in this tree. Different foods sometimes come from the same species.</p>
          )}
        </section>

        <section className="explorer-section" aria-labelledby="explorer-foods-title">
          <div className="explorer-section-heading">
            <h3 id="explorer-foods-title">Foods on this branch</h3>
            <span>{displayedFoods.length} of {foodCount} foods</span>
          </div>
          <ul id="explorer-food-list" className="explorer-foods">
            {displayedFoods.map((food) => {
              const species = taxonById.get(food.taxon)!;
              return (
                <li key={food.id}>
                  <button type="button" className={`explorer-food ${food.taxon === taxon.id ? "is-current" : ""}`} disabled={food.taxon === taxon.id} onClick={() => onNavigate(species)} aria-label={`${food.name}: explore ${species.name}, species`}>
                    <span className="explorer-food-photo">
                      <FoodImage food={food} />
                      {memberIds.has(food.id) && picks.some((pick) => pick.id === food.id) && <span className="explorer-food-badge">Your pick</span>}
                    </span>
                    <span className="explorer-food-caption">
                      <span className="explorer-food-name">{food.name}</span>
                      <span className="explorer-food-species">{species.name}</span>
                      {food.note && <span className="explorer-food-note">{food.note}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {members.length > 8 && (
            <button type="button" className="text-btn explorer-show-all" aria-controls="explorer-food-list" aria-expanded={expandedTaxon === taxon.id} onClick={() => setExpandedTaxon(expandedTaxon === taxon.id ? null : taxon.id)}>
              {expandedTaxon === taxon.id ? "Show fewer foods" : `Show all ${foodCount} foods`}
            </button>
          )}
        </section>

        <div className="explorer-bottom">
          {parent ? (
            <button type="button" className="explorer-zoom-out" onClick={() => onNavigate(parent)}>
              <span aria-hidden="true">↑</span>
              <span>Zoom out to <strong className={isItalicRank(parent.rank) ? "is-sci" : ""}>{parent.name}</strong><span className="rank">{parent.rank}</span></span>
            </button>
          ) : <p className="explorer-root-note">This domain is the root of our food tree.</p>}
          <button type="button" className="text-btn" onClick={onDismiss}>Back to tree</button>
        </div>
        <p className="explorer-dataset-note">This guide shows only the foods and branches in our demo dataset. Counts do not represent all species in nature.</p>
      </motion.div>
    </motion.dialog>
  );
}
