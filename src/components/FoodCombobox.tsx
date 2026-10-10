import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Dish, Food } from "../data";
import { ingredientsOf, kitchenName, pickFromDish, pickName, type Pick } from "../lib/dishes";
import { foodById, taxonById } from "../lib/tree";
import { DishImage } from "./DishImage";
import { FoodImage } from "./FoodImage";

interface Props {
  label: string;
  side: "a" | "b";
  foods: Food[];
  dishes: Dish[];
  value: Pick;
  onChange: (pick: Pick) => void;
}

type Option =
  | { key: string; kind: "food"; food: Food }
  | { key: string; kind: "dish"; dish: Dish; trace?: string };

interface Group {
  id: string;
  label: string;
  options: Option[];
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/-/g, " ");
}

function matches(food: Food, query: string): boolean {
  if (!query) return true;
  const taxon = taxonById.get(food.taxon);
  return [food.name, food.id, food.note, taxon?.name, taxon?.common]
    .some((text) => text !== undefined && normalize(text).includes(query));
}

function dishMatches(dish: Dish, query: string): boolean {
  if (!query) return true;
  return [dish.name, dish.id, dish.note].some((text) => normalize(text).includes(query));
}

/** The first ingredient whose food name or kitchen name contains the query. */
function ingredientHit(dish: Dish, query: string): string | undefined {
  return dish.ingredients.find((item) => {
    const food = foodById.get(item.food)!;
    return [food.name, item.as].some((text) => text !== undefined && normalize(text).includes(query));
  })?.food;
}

/** 0 for an exact name match, 1 for a prefix match, 2 otherwise. */
function score(names: string[], query: string): number {
  let best = 2;
  for (const name of names) {
    const text = normalize(name);
    if (text === query) return 0;
    if (text.startsWith(query)) best = 1;
  }
  return best;
}

function buildGroups(foods: Food[], dishes: Dish[], rawQuery: string): Group[] {
  const query = normalize(rawQuery.trim());
  const named = dishes.filter((dish) => dishMatches(dish, query));
  const dishGroup: Group = {
    id: "dishes",
    label: "Dishes",
    options: named.map((dish) => ({ key: `dish-${dish.id}`, kind: "dish", dish })),
  };
  const foodGroup: Group = {
    id: "foods",
    label: "Ingredients",
    options: foods.filter((food) => matches(food, query)).map((food) => ({ key: `food-${food.id}`, kind: "food", food })),
  };

  let ordered: Group[];
  if (!query) {
    ordered = [dishGroup, foodGroup];
  } else {
    const dishScore = score(named.map((dish) => dish.name), query);
    const foodScore = score(foodGroup.options.map((option) => (option.kind === "food" ? option.food.name : "")), query);
    ordered = dishScore < foodScore ? [dishGroup, foodGroup] : [foodGroup, dishGroup];
  }

  if (query) {
    const namedIds = new Set(named.map((dish) => dish.id));
    const withOptions: Option[] = [];
    for (const dish of dishes) {
      if (namedIds.has(dish.id)) continue;
      const trace = ingredientHit(dish, query);
      if (trace) withOptions.push({ key: `with-${dish.id}`, kind: "dish", dish, trace });
    }
    ordered.push({ id: "with", label: `Dishes with “${rawQuery.trim()}”`, options: withOptions });
  }

  return ordered.filter((group) => group.options.length > 0);
}

function isSelected(option: Option, value: Pick): boolean {
  if (option.kind === "food") return !value.dish && option.food.id === value.food.id;
  return value.dish?.id === option.dish.id && (!option.trace || option.trace === value.food.id);
}

export function FoodCombobox({ label, side, foods, dishes, value, onChange }: Props) {
  const id = useId();
  const inputId = `${id}-input`;
  const listId = `${id}-listbox`;
  const traceId = `${id}-trace`;
  const valueName = pickName(value);
  const [query, setQuery] = useState(valueName);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(valueName);
  }, [valueName]);

  const groups = useMemo(() => buildGroups(foods, dishes, query), [foods, dishes, query]);
  const flat = useMemo(() => groups.flatMap((group) => group.options), [groups]);

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
    const list = buildGroups(foods, dishes, startQuery ?? query).flatMap((group) => group.options);
    const idx = list.findIndex((option) => isSelected(option, value));
    setActive(idx >= 0 ? idx : 0);
  }

  function close(commit: boolean) {
    setOpen(false);
    if (!commit) setQuery(valueName);
  }

  function select(option: Option) {
    const pick = option.kind === "food" ? { food: option.food } : pickFromDish(option.dish, option.trace);
    onChange(pick);
    setQuery(pickName(pick));
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(flat.length - 1, i + 1));
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
          setActive(flat.length - 1);
        }
        break;
      case "Enter":
        if (open && flat[active]) {
          e.preventDefault();
          select(flat[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close(false);
        }
        break;
      case "Tab":
        if (open && flat[active] && query !== valueName) {
          select(flat[active]);
        } else {
          close(false);
        }
        break;
    }
  }

  const activeId = open && flat[active] ? `${id}-opt-${flat[active].key}` : undefined;
  const trimmed = query.trim();
  let index = 0;

  return (
    <div className={`combo combo-${side}`} ref={rootRef}>
      <label className="combo-label" htmlFor={inputId}>
        {label}
      </label>
      <div className={`combo-field ${open ? "is-open" : ""}`}>
        <span className="combo-thumb" aria-hidden="true">
          {value.dish ? <DishImage dish={value.dish} size={44} /> : <FoodImage food={value.food} size={44} />}
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
          aria-describedby={value.dish ? traceId : undefined}
          value={query}
          placeholder="Search a food or a dish…"
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
        {flat.length === 0 && (
          <li className="combo-empty" role="presentation">
            Nothing on the menu matches “{trimmed}”.
          </li>
        )}
        {groups.map((group) => (
          <li key={group.id} role="group" aria-labelledby={`${id}-group-${group.id}`} className="combo-group">
            <span id={`${id}-group-${group.id}`} className="combo-group-label" role="presentation">
              {group.label}
              <span className="combo-group-count">{group.options.length}</span>
            </span>
            <ul role="none" className="combo-group-list">
              {group.options.map((option) => {
                const i = index++;
                const selected = isSelected(option, value);
                return (
                  <li
                    key={option.key}
                    id={`${id}-opt-${option.key}`}
                    role="option"
                    aria-selected={selected}
                    data-index={i}
                    className={`combo-option ${option.kind === "dish" ? "is-dish" : ""} ${i === active ? "is-active" : ""} ${selected ? "is-selected" : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => select(option)}
                  >
                    {option.kind === "food" ? <FoodOption food={option.food} /> : <DishOption dish={option.dish} trace={option.trace} />}
                    {selected && (
                      <span className="combo-option-check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
      {value.dish && <TracePicker id={traceId} dish={value.dish} food={value.food} onChange={onChange} />}
    </div>
  );
}

function FoodOption({ food }: { food: Food }) {
  return (
    <>
      <FoodImage food={food} size={36} />
      <span className="combo-option-text">
        <span className="combo-option-name">{food.name}</span>
        <span className="combo-option-sci">{taxonById.get(food.taxon)?.name}</span>
      </span>
    </>
  );
}

function DishOption({ dish, trace }: { dish: Dish; trace?: string }) {
  const items = ingredientsOf(dish);
  const traced = trace ? items.find((item) => item.food.id === trace) : undefined;
  return (
    <>
      <DishImage dish={dish} size={36} />
      <span className="combo-option-text">
        <span className="combo-option-name">
          {dish.name}
          <span className="combo-option-tag">{dish.note}</span>
        </span>
        <span className="combo-option-ingredients">
          {traced ? (
            <>
              Traces <strong>{traced.label}</strong> · {items.length} ingredients
            </>
          ) : (
            items.map((item) => item.label).join(" · ")
          )}
        </span>
      </span>
    </>
  );
}

function TracePicker({ id, dish, food, onChange }: {
  id: string;
  dish: Dish;
  food: Food;
  onChange: (pick: Pick) => void;
}) {
  const items = ingredientsOf(dish);
  const as = kitchenName(dish, food.id);
  return (
    <div className="trace">
      <p id={id} className="trace-label">
        Tracing <strong>{as ?? food.name}</strong>
        {as && <> ({food.name})</>}. Pick an ingredient of {dish.name}:
      </p>
      <ul className="trace-chips" aria-label={`Ingredients of ${dish.name}`}>
        {items.map((item) => {
          const current = item.food.id === food.id;
          return (
            <li key={item.food.id}>
              <button
                type="button"
                className={`trace-chip ${current ? "is-current" : ""}`}
                aria-pressed={current}
                title={item.label === item.food.name ? undefined : `${item.label} comes from ${item.food.name}`}
                onClick={() => onChange({ food: item.food, dish })}
              >
                <FoodImage food={item.food} size={22} />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
