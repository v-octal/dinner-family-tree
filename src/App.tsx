import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { dishes, foods, type Taxon } from "./data";
import { connect, describeMeeting, foodById } from "./lib/tree";
import { dishById, pickFromDish, tracedName, type Pick } from "./lib/dishes";
import { FoodCombobox } from "./components/FoodCombobox";
import { TreeDiagram } from "./components/TreeDiagram";
import { TaxonExplorer } from "./components/TaxonExplorer";
import "./App.css";

const DEFAULT_A = "apple";
const DEFAULT_B = "almond";

const sortedFoods = [...foods].sort((x, y) => x.name.localeCompare(y.name));
const sortedDishes = [...dishes].sort((x, y) => x.name.localeCompare(y.name));

function readPick(params: URLSearchParams, key: "a" | "b", fallback: string): Pick {
  const dish = dishById.get(params.get(`${key}d`) ?? "");
  const foodId = params.get(key) ?? "";
  if (dish) return pickFromDish(dish, foodId);
  return { food: foodById.get(foodId) ?? foodById.get(fallback)! };
}

function readSelection(): [Pick, Pick] {
  const params = new URLSearchParams(window.location.search);
  const a = readPick(params, "a", DEFAULT_A);
  let b = readPick(params, "b", DEFAULT_B);
  if (b.food.id === a.food.id && !a.dish && !b.dish) {
    b = { food: foodById.get(a.food.id === DEFAULT_B ? DEFAULT_A : DEFAULT_B)! };
  }
  return [a, b];
}

function randomPick(): Pick {
  if (Math.random() < 0.3) {
    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const item = dish.ingredients[Math.floor(Math.random() * dish.ingredients.length)];
    return pickFromDish(dish, item.food);
  }
  return { food: foods[Math.floor(Math.random() * foods.length)] };
}

function randomPair(current: [Pick, Pick]): [Pick, Pick] {
  let a = randomPick();
  let b = randomPick();
  let guard = 0;
  while ((a.food.id === b.food.id || (a.food.id === current[0].food.id && b.food.id === current[1].food.id)) && guard++ < 50) {
    a = randomPick();
    b = randomPick();
  }
  return [a, b];
}

export default function App() {
  const [[pickA, pickB], setPair] = useState<[Pick, Pick]>(readSelection);
  const a = pickA.food;
  const b = pickB.food;
  const [explorer, setExplorer] = useState<{ taxon: Taxon; trigger: HTMLElement } | null>(null);
  const explore = useCallback((taxon: Taxon, trigger: HTMLElement) => setExplorer({ taxon, trigger }), []);
  const navigate = useCallback((taxon: Taxon) => setExplorer((current) => current ? { ...current, taxon } : null), []);
  const dismiss = useCallback(() => setExplorer(null), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, pick] of [["a", pickA], ["b", pickB]] as const) {
      params.set(key, pick.food.id);
      if (pick.dish) params.set(`${key}d`, pick.dish.id);
      else params.delete(`${key}d`);
    }
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    document.title = `${tracedName(pickA)} × ${tracedName(pickB)} — The Family Tree of Your Dinner`;
  }, [pickA, pickB]);

  useEffect(() => {
    const onPop = () => setPair(readSelection());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setA = useCallback((pick: Pick) => setPair(([, prevB]) => [pick, prevB]), []);
  const setB = useCallback((pick: Pick) => setPair(([prevA]) => [prevA, pick]), []);
  const swap = useCallback(() => setPair(([x, y]) => [y, x]), []);
  const surprise = useCallback(() => setPair((cur) => randomPair(cur)), []);

  const connection = useMemo(() => connect(a, b), [a, b]);
  const copy = useMemo(() => describeMeeting(connection), [connection]);
  const same = a.id === b.id;
  const fromDish = Boolean(pickA.dish || pickB.dish);

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
          Pick any two foods or dishes. We climb their biological family trees, rank by rank, until the branches touch.
        </p>
      </header>

      <section className="pickers" aria-label="Choose two foods">
        <FoodCombobox label="First food or dish" side="a" foods={sortedFoods} dishes={sortedDishes} value={pickA} onChange={setA} />
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
        <FoodCombobox label="Second food or dish" side="b" foods={sortedFoods} dishes={sortedDishes} value={pickB} onChange={setB} />
      </section>

      <div className="discovery" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${pickA.dish?.id}-${a.id}-${pickB.dish?.id}-${b.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {same ? (
              fromDish ? (
                <>
                  <h2 className="discovery-title">Both sides trace {a.name}.</h2>
                  <p className="discovery-detail">Pick a different ingredient to see where the branches part.</p>
                </>
              ) : (
                <>
                  <h2 className="discovery-title">That is the same food twice.</h2>
                  <p className="discovery-detail">Pick a different second food to see where the branches part.</p>
                </>
              )
            ) : (
              <>
                <h2 className="discovery-title">{copy.title}</h2>
                <p className="discovery-detail">
                  {copy.detail}{" "}
                  <span className="discovery-steps">
                    {connection.pathA.length} step{connection.pathA.length === 1 ? "" : "s"} up from {tracedName(pickA)},{" "}
                    {connection.pathB.length} from {tracedName(pickB)}.
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
          <TreeDiagram connection={connection} dishes={[pickA.dish, pickB.dish]} onExplore={explore} />
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
        Text summary. {tracedName(pickA)} climbs through{" "}
        {connection.pathA.map((t) => `${t.name} (${t.rank.toLowerCase()})`).join(", ")} to reach {connection.meet.name}.{" "}
        {tracedName(pickB)} climbs through {connection.pathB.map((t) => `${t.name} (${t.rank.toLowerCase()})`).join(", ")} to reach{" "}
        {connection.meet.name}.
      </p>

      <footer className="footer">
        <p className="footer-note">
          Demo dataset of {foods.length} foods and {dishes.length} dishes. Photographs via Wikimedia Commons. Taxonomy simplified; clades follow APG IV
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
