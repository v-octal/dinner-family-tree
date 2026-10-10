import type { Dish } from "../data";
import { ingredientsOf } from "../lib/dishes";
import { FoodImage } from "./FoodImage";

interface Props {
  dish: Dish;
  size?: number;
  className?: string;
}

/** A round mosaic of the first ingredients of a dish. */
export function DishImage({ dish, size, className = "" }: Props) {
  const tiles = ingredientsOf(dish).slice(0, 4);
  const style = size ? { width: size, height: size } : undefined;
  return (
    <span className={`dish-img dish-img-${tiles.length} ${className}`} style={style} aria-hidden="true">
      {tiles.map(({ food }) => (
        <FoodImage key={food.id} food={food} className="dish-img-tile" />
      ))}
    </span>
  );
}
