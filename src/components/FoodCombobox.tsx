import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Food } from "../data";
import { taxonById } from "../lib/tree";
import { FoodImage } from "./FoodImage";

interface Props {
  label: string;
  side: "a" | "b";
  foods: Food[];
  value: Food;
  onChange: (food: Food) => void;
}

function matches(food: Food, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const sci = taxonById.get(food.taxon)?.name.toLowerCase() ?? "";
  const common = taxonById.get(food.taxon)?.common?.toLowerCase() ?? "";
  return (
    food.name.toLowerCase().includes(query) ||
    sci.includes(query) ||
    common.includes(query)
  );
}

export function FoodCombobox({ label, side, foods, value, onChange }: Props) {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-listbox`;
  const [query, setQuery] = useState(value.name);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value.name);
  }, [value]);

  const filtered = useMemo(() => foods.filter((f) => matches(f, query)), [foods, query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        close(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function openList(startQuery?: string) {
    setOpen(true);
    const q = startQuery ?? query;
    const list = foods.filter((f) => matches(f, q));
    const idx = list.findIndex((f) => f.id === value.id);
    setActive(idx >= 0 ? idx : 0);
  }

  function close(commit: boolean) {
    setOpen(false);
    if (!commit) setQuery(value.name);
  }

  function select(food: Food) {
    onChange(food);
    setQuery(food.name);
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(filtered.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(filtered.length - 1);
        }
        break;
      case "Enter":
        if (open && filtered[active]) {
          e.preventDefault();
          select(filtered[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close(false);
        }
        break;
      case "Tab":
        if (open && filtered[active] && query !== value.name) {
          select(filtered[active]);
        } else {
          close(false);
        }
        break;
    }
  }

  const activeId = open && filtered[active] ? `${id}-opt-${filtered[active].id}` : undefined;

  return (
    <div className={`combo combo-${side}`} ref={rootRef}>
      <label className="combo-label" htmlFor={inputId}>
        {label}
      </label>
      <div className={`combo-field ${open ? "is-open" : ""}`}>
        <span className="combo-thumb" aria-hidden="true">
          <FoodImage food={value} size={44} />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          className="combo-input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeId}
          value={query}
          placeholder="Search a food…"
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
            setActive(0);
          }}
          onFocus={() => {
            inputRef.current?.select();
          }}
          onClick={() => {
            if (!open) openList();
          }}
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            if (rootRef.current?.contains(e.relatedTarget as Node)) return;
            close(false);
          }}
        />
        <button
          type="button"
          className="combo-toggle"
          tabIndex={-1}
          aria-label={open ? "Close list" : "Open list"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (open) close(false);
            else {
              openList("");
              setQuery("");
              inputRef.current?.focus();
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2.5 5l4.5 4.5L11.5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={`${label} options`}
        className="combo-list"
        hidden={!open}
      >
        {filtered.length === 0 && (
          <li className="combo-empty" role="presentation">
            Nothing on the menu matches “{query}”.
          </li>
        )}
        {filtered.map((food, i) => {
          const taxon = taxonById.get(food.taxon);
          const selected = food.id === value.id;
          return (
            <li
              key={food.id}
              id={`${id}-opt-${food.id}`}
              role="option"
              aria-selected={selected}
              data-index={i}
              className={`combo-option ${i === active ? "is-active" : ""} ${selected ? "is-selected" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(food)}
            >
              <FoodImage food={food} size={36} />
              <span className="combo-option-text">
                <span className="combo-option-name">{food.name}</span>
                <span className="combo-option-sci">{taxon?.name}</span>
              </span>
              {selected && (
                <span className="combo-option-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
