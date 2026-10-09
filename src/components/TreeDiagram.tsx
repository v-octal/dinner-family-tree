import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Taxon } from "../data";
import type { Connection } from "../lib/tree";
import { taxonById } from "../lib/tree";
import { MeetingNode } from "./MeetingNode";
import { FoodCard, TaxonNode } from "./TaxonNode";

interface Props {
  connection: Connection;
  onExplore: (taxon: Taxon, trigger: HTMLElement) => void;
}

interface ForkSize {
  w: number;
  h: number;
  gap: number;
}

function Fork({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ForkSize | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const branches = el.nextElementSibling;
      const gap = branches ? parseFloat(getComputedStyle(branches).columnGap) || 0 : 0;
      setSize({ w: el.clientWidth, h: el.clientHeight, gap });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let paths: { a: string; b: string } | null = null;
  if (size && size.w > 0 && size.h > 0) {
    const { w, h, gap } = size;
    const colW = (w - gap) / 2;
    const cx = w / 2;
    const cxA = colW / 2;
    const cxB = w - colW / 2;
    const mid = h / 2;
    paths = {
      a: `M${cx} 0 C${cx} ${mid} ${cxA} ${mid} ${cxA} ${h}`,
      b: `M${cx} 0 C${cx} ${mid} ${cxB} ${mid} ${cxB} ${h}`,
    };
  }

  return (
    <div className="fork" aria-hidden="true" ref={ref}>
      {paths && size && (
        <svg viewBox={`0 0 ${size.w} ${size.h}`} width={size.w} height={size.h}>
          <defs>
            <linearGradient id="fork-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--gold)" />
              <stop offset="1" stopColor="var(--side-a)" />
            </linearGradient>
            <linearGradient id="fork-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--gold)" />
              <stop offset="1" stopColor="var(--side-b)" />
            </linearGradient>
          </defs>
          <motion.path
            key={`${id}-a`}
            d={paths.a}
            fill="none"
            stroke="url(#fork-a)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <motion.path
            key={`${id}-b`}
            d={paths.b}
            fill="none"
            stroke="url(#fork-b)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </svg>
      )}
      <span className="fork-knot" />
    </div>
  );
}

export function TreeDiagram({ connection, onExplore }: Props) {
  const { a, b, meet, pathA, pathB, above } = connection;
  const exclude = [a.id, b.id];
  const topDownA = [...pathA].reverse();
  const topDownB = [...pathB].reverse();

  return (
    <LayoutGroup>
      <section className="tree" aria-label="How the two foods connect">
        <AnimatePresence mode="popLayout" initial={false}>
          <MeetingNode key={meet.id} taxon={meet} above={above} exclude={exclude} onExplore={onExplore} />
        </AnimatePresence>

        <Fork id={`${a.id}-${b.id}`} />

        <div className="branches">
          <ol className="branch branch-a" aria-label={`Path from ${a.name} up to ${meet.name}`}>
            <li className="stem-fill" aria-hidden="true" />
            <AnimatePresence mode="popLayout" initial={false}>
              {topDownA.map((t, i) => (
                <TaxonNode key={t.id} taxon={t} side="a" exclude={exclude} index={i} total={topDownA.length} onExplore={onExplore} />
              ))}
              <FoodCard key={`food-${a.id}`} food={a} side="a" taxon={taxonById.get(a.taxon)} onExplore={onExplore} />
            </AnimatePresence>
          </ol>
          <ol className="branch branch-b" aria-label={`Path from ${b.name} up to ${meet.name}`}>
            <li className="stem-fill" aria-hidden="true" />
            <AnimatePresence mode="popLayout" initial={false}>
              {topDownB.map((t, i) => (
                <TaxonNode key={t.id} taxon={t} side="b" exclude={exclude} index={i} total={topDownB.length} onExplore={onExplore} />
              ))}
              <FoodCard key={`food-${b.id}`} food={b} side="b" taxon={taxonById.get(b.taxon)} onExplore={onExplore} />
            </AnimatePresence>
          </ol>
        </div>
      </section>
    </LayoutGroup>
  );
}
