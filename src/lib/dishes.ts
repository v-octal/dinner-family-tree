import { dishes, type Dish, type Food } from "../data";
import { foodById } from "./tree";

export const dishById = new Map<string, Dish>(dishes.map((dish) => [dish.id, dish]));

/** One side of the comparison: a raw food, optionally traced from inside a dish. */
export interface Pick {
  food: Food;
  dish?: Dish;
}

export interface DishIngredient {
  food: Food;
  /** Kitchen name, e.g. "Parmesan", or the food name. */
  label: string;
}

export function ingredientsOf(dish: Dish): DishIngredient[] {
  return dish.ingredients.map((item) => {
    const food = foodById.get(item.food)!;
    return { food, label: item.as ?? food.name };
  });
}

export function mainIngredient(dish: Dish): Food {
  return foodById.get(dish.ingredients[0].food)!;
}

export function dishContains(dish: Dish, foodId: string): boolean {
  return dish.ingredients.some((item) => item.food === foodId);
}

/** The kitchen name of a food inside a dish, if it has one. */
export function kitchenName(dish: Dish, foodId: string): string | undefined {
  return dish.ingredients.find((item) => item.food === foodId)?.as;
}

export function pickFromDish(dish: Dish, foodId?: string): Pick {
  const food = foodId && dishContains(dish, foodId) ? foodById.get(foodId)! : mainIngredient(dish);
  return { food, dish };
}

export function pickName(pick: Pick): string {
  return pick.dish ? pick.dish.name : pick.food.name;
}

/** "Basil", or "Basil in Pesto" when the food comes from a dish. */
export function tracedName(pick: Pick): string {
  return pick.dish ? `${pick.food.name} in ${pick.dish.name}` : pick.food.name;
}
