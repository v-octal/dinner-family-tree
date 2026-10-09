import { useState } from "react";
import type { Food } from "../data";

interface Props {
  food: Food;
  size?: number;
  className?: string;
  /** When true, the image is decorative and the name is provided elsewhere. */
  decorative?: boolean;
}

/** Food photo with an emoji fallback if the network image fails. */
export function FoodImage({ food, size, className = "", decorative = true }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const style = size ? { width: size, height: size } : undefined;
  if (failedSource === food.photo || !food.photo) {
    return (
      <span
        className={`food-img food-img-fallback ${className}`}
        style={size ? { ...style, fontSize: Math.round(size * 0.45) } : style}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : food.name}
        aria-hidden={decorative || undefined}
      >
        {food.emoji}
      </span>
    );
  }
  return (
    <img
      className={`food-img ${className}`}
      style={style}
      src={food.photo}
      alt={decorative ? "" : food.name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailedSource(food.photo)}
    />
  );
}
