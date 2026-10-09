import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { foods, type Food, type Taxon } from "./data";
import { connect, describeMeeting, foodById } from "./lib/tree";
import { FoodCombobox } from "./components/FoodCombobox";
import { TreeDiagram } from "./components/TreeDiagram";
import { TaxonExplorer } from "./components/TaxonExplorer";
import "./App.css";

const DEFAULT_A = "apple";
const DEFAULT_B = "almond";

const sortedFoods = [...foods].sort((x, y) => x.name.localeCompare(y.name));

function readSelection(): [Food, Food] {
  const params = new URLSearchParams(window.location.search);
  const a = foodById.get(params.get("a") ?? "") ?? foodById.get(DEFAULT_A)!;
  let b = foodById.get(params.get("b") ?? "") ?? foodById.get(DEFAULT_B)!;
  if (b.id === a.id) b = foodById.get(a.id === DEFAULT_B ? DEFAULT_A : DEFAULT_B)!;
  return [a, b];
}

function randomPair(current: [Food, Food]): [Food, Food] {
  const pick = () => foods[Math.floor(Math.random() * foods.length)];
  let a = pick();
  let b = pick();
  let guard = 0;
  while ((a.id === b.id || (a.id === current[0].id && b.id === current[1].id)) && guard++ < 50) {
    a = pick();
    b = pick();
  }
  return [a, b];
}

export default function App() {
  const [[a, b], setPair] = useState<[Food, Food]>(readSelection);
  const [explorer, setExplorer] = useState<{ taxon: Taxon; trigger: HTMLElement } | null>(null);
  const explore = useCallback((taxon: Taxon, trigger: HTMLElement) => setExplorer({ taxon, trigger }), []);
  const navigate = useCallback((taxon: Taxon) => setExplorer((current) => current ? { ...current, taxon } : null), []);
  const dismiss = useCallback(() => setExplorer(null), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("a", a.id);
    params.set("b", b.id);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    document.title = `${a.name} × ${b.name} — The Family Tree of Your Dinner`;
  }, [a, b]);

  useEffect(() => {
    const onPop = () => setPair(readSelection());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setA = useCallback((food: Food) => setPair(([, prevB]) => [food, prevB]), []);
  const setB = useCallback((food: Food) => setPair(([prevA]) => [prevA, food]), []);
  const swap = useCallback(() => setPair(([x, y]) => [y, x]), []);
  const surprise = useCallback(() => setPair((cur) => randomPair(cur)), []);

  const connection = useMemo(() => connect(a, b), [a, b]);
  const copy = useMemo(() => describeMeeting(connection), [connection]);
  const same = a.id === b.id;

  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead-eyebrow">A visual explorer of edible kinship</p>
        <h1 className="masthead-title">
          The Family Tree
          <br />
          <span className="masthead-title-em">of Your Dinner</span>
        </h1>
        <p className="masthead-lede">
          Pick any two foods. We climb their biological family trees, rank by rank, until the branches touch.
        </p>
      </header>

      <section className="pickers" aria-label="Choose two foods">
        <FoodCombobox label="First food" side="a" foods={sortedFoods} value={a} onChange={setA} />
        <div className="picker-actions">
          <button type="button" className="icon-btn" onClick={swap} aria-label="Swap the two foods" title="Swap">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M3 6h10.5M11 3l3 3-3 3M15 12H4.5M7 9l-3 3 3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="text-btn" onClick={surprise}>
            Surprise me
          </button>
        </div>
        <FoodCombobox label="Second food" side="b" foods={sortedFoods} value={b} onChange={setB} />
      </section>

      <div className="discovery" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${a.id}-${b.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {same ? (
              <>
                <h2 className="discovery-title">That is the same food twice.</h2>
                <p className="discovery-detail">Pick a different second food to see where the branches part.</p>
              </>
            ) : (
              <>
                <h2 className="discovery-title">{copy.title}</h2>
                <p className="discovery-detail">
                  {copy.detail}{" "}
                  <span className="discovery-steps">
                    {connection.pathA.length} step{connection.pathA.length === 1 ? "" : "s"} up from {a.name},{" "}
                    {connection.pathB.length} from {b.name}.
                  </span>
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!same && (
        <>
          <p className="tree-guide">Select any rank to explore its branch <span aria-hidden="true">↗</span></p>
          <TreeDiagram connection={connection} onExplore={explore} />
        </>
      )}

      <AnimatePresence>
        {explorer && (
          <TaxonExplorer
            taxon={explorer.taxon}
            trigger={explorer.trigger}
            picks={[a, b]}
            onNavigate={navigate}
            onDismiss={dismiss}
          />
        )}
      </AnimatePresence>

      <p className="sr-only">
        Text summary. {a.name} climbs through{" "}
        {connection.pathA.map((t) => `${t.name} (${t.rank.toLowerCase()})`).join(", ")} to reach {connection.meet.name}.{" "}
        {b.name} climbs through {connection.pathB.map((t) => `${t.name} (${t.rank.toLowerCase()})`).join(", ")} to reach{" "}
        {connection.meet.name}.
      </p>

      <footer className="footer">
        <p className="footer-note">
          Demo dataset of {foods.length} foods. Photographs via Wikimedia Commons. Taxonomy simplified; clades follow APG IV
          for plants. Broad food names use representative species. Products follow their source organism.
        </p>
        <p className="credit">
          Built with{" "}
          <a className="credit-brand" href="https://github.com/bottomless/agent-duel" target="_blank" rel="noopener noreferrer">
            Agent Duel
          </a>
        </p>
      </footer>
    </div>
  );
}
