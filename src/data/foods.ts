import type { Food } from "./types";
import { photos } from "./photos";

const f = (
  id: string,
  name: string,
  taxon: string,
  emoji: string,
  note?: string,
): Food => ({ id, name, taxon, emoji, note, photo: photos[id] });

/** Demo foods. Each points at a species-level taxon in `taxa.ts`. */
export const foods: Food[] = [
  // Fruits
  f("apple", "Apple", "malus-domestica", "🍎", "Fruit"),
  f("strawberry", "Strawberry", "fragaria-ananassa", "🍓", "Fruit"),
  f("cherry", "Cherry", "prunus-avium", "🍒", "Fruit"),
  f("peach", "Peach", "prunus-persica", "🍑", "Fruit"),
  f("almond", "Almond", "prunus-dulcis", "🌰", "Seed"),
  f("orange", "Orange", "citrus-sinensis", "🍊", "Fruit"),
  f("lemon", "Lemon", "citrus-limon", "🍋", "Fruit"),
  f("mango", "Mango", "mangifera-indica", "🥭", "Fruit"),
  f("cashew", "Cashew", "anacardium-occidentale", "🥜", "Seed"),
  f("pistachio", "Pistachio", "pistacia-vera", "🌰", "Seed"),
  f("grape", "Grape", "vitis-vinifera", "🍇", "Fruit"),
  f("banana", "Banana", "musa-acuminata", "🍌", "Fruit"),
  f("watermelon", "Watermelon", "citrullus-lanatus", "🍉", "Fruit"),
  f("avocado", "Avocado", "persea-americana", "🥑", "Fruit"),
  f("coconut", "Coconut", "cocos-nucifera", "🥥", "Fruit"),
  f("date", "Date", "phoenix-dactylifera", "🌴", "Fruit"),
  f("olive", "Olive", "olea-europaea", "🫒", "Fruit"),

  // Vegetables
  f("tomato", "Tomato", "solanum-lycopersicum", "🍅", "Fruit"),
  f("potato", "Potato", "solanum-tuberosum", "🥔", "Tuber"),
  f("eggplant", "Eggplant", "solanum-melongena", "🍆", "Fruit"),
  f("chili", "Chili pepper", "capsicum-annuum", "🌶️", "Fruit"),
  f("sweet-potato", "Sweet potato", "ipomoea-batatas", "🍠", "Root"),
  f("carrot", "Carrot", "daucus-carota", "🥕", "Root"),
  f("broccoli", "Broccoli", "brassica-oleracea", "🥦", "Flower buds"),
  f("cauliflower", "Cauliflower", "brassica-oleracea", "🥬", "Flower buds"),
  f("kale", "Kale", "brassica-oleracea", "🥬", "Leaves"),
  f("pumpkin", "Pumpkin", "cucurbita-pepo", "🎃", "Fruit"),
  f("cucumber", "Cucumber", "cucumis-sativus", "🥒", "Fruit"),
  f("lettuce", "Lettuce", "lactuca-sativa", "🥬", "Leaves"),
  f("spinach", "Spinach", "spinacia-oleracea", "🥬", "Leaves"),
  f("beet", "Beetroot", "beta-vulgaris", "🫜", "Root"),
  f("onion", "Onion", "allium-cepa", "🧅", "Bulb"),
  f("garlic", "Garlic", "allium-sativum", "🧄", "Bulb"),
  f("asparagus", "Asparagus", "asparagus-officinalis", "🌱", "Shoots"),

  // Grains, legumes, nuts & seeds
  f("rice", "Rice", "oryza-sativa", "🍚", "Grain"),
  f("wheat", "Wheat", "triticum-aestivum", "🌾", "Grain"),
  f("corn", "Corn", "zea-mays", "🌽", "Grain"),
  f("quinoa", "Quinoa", "chenopodium-quinoa", "🌾", "Seed"),
  f("peanut", "Peanut", "arachis-hypogaea", "🥜", "Seed"),
  f("soybean", "Soybean", "glycine-max", "🫘", "Seed"),
  f("chickpea", "Chickpea", "cicer-arietinum", "🫘", "Seed"),
  f("lentil", "Lentil", "lens-culinaris", "🫘", "Seed"),
  f("walnut", "Walnut", "juglans-regia", "🌰", "Seed"),
  f("hazelnut", "Hazelnut", "corylus-avellana", "🌰", "Seed"),
  f("sunflower-seed", "Sunflower seed", "helianthus-annuus", "🌻", "Seed"),
  f("sesame", "Sesame", "sesamum-indicum", "🫘", "Seed"),

  // Herbs, spices & treats
  f("basil", "Basil", "ocimum-basilicum", "🌿", "Leaves"),
  f("mint", "Mint", "mentha-spicata", "🌿", "Leaves"),
  f("ginger", "Ginger", "zingiber-officinale", "🫚", "Rhizome"),
  f("cinnamon", "Cinnamon", "cinnamomum-verum", "🪵", "Bark"),
  f("black-pepper", "Black pepper", "piper-nigrum", "🫘", "Dried fruit"),
  f("vanilla", "Vanilla", "vanilla-planifolia", "🌼", "Seed pod"),
  f("coffee", "Coffee", "coffea-arabica", "☕", "Roasted seed"),
  f("cacao", "Cacao", "theobroma-cacao", "🍫", "Fermented seed"),

  // Meat, poultry & eggs
  f("beef", "Beef", "bos-taurus", "🥩", "Meat"),
  f("lamb", "Lamb", "ovis-aries", "🍖", "Meat"),
  f("pork", "Pork", "sus-domesticus", "🥓", "Meat"),
  f("goat-cheese", "Goat cheese", "capra-hircus", "🧀", "Milk"),
  f("chicken", "Chicken", "gallus-gallus", "🍗", "Meat"),
  f("egg", "Egg", "gallus-gallus", "🥚", "Egg"),
  f("turkey", "Turkey", "meleagris-gallopavo", "🦃", "Meat"),
  f("duck", "Duck", "anas-platyrhynchos", "🦆", "Meat"),

  // Seafood
  f("salmon", "Salmon", "salmo-salar", "🐟", "Fish"),
  f("tuna", "Tuna", "thunnus-albacares", "🐟", "Fish"),
  f("cod", "Cod", "gadus-morhua", "🐟", "Fish"),
  f("shrimp", "Shrimp", "penaeus-vannamei", "🦐", "Shellfish"),
  f("lobster", "Lobster", "homarus-americanus", "🦞", "Shellfish"),
  f("crab", "Crab", "callinectes-sapidus", "🦀", "Shellfish"),
  f("squid", "Squid", "loligo-vulgaris", "🦑", "Shellfish"),
  f("oyster", "Oyster", "magallana-gigas", "🦪", "Shellfish"),
  f("mussel", "Mussel", "mytilus-edulis", "🦪", "Shellfish"),
  f("honey", "Honey", "apis-mellifera", "🍯", "Made by bees"),

  // Fungi
  f("button-mushroom", "Button mushroom", "agaricus-bisporus", "🍄", "Fruiting body"),
  f("shiitake", "Shiitake", "lentinula-edodes", "🍄", "Fruiting body"),
  f("oyster-mushroom", "Oyster mushroom", "pleurotus-ostreatus", "🍄", "Fruiting body"),
  f("truffle", "Black truffle", "tuber-melanosporum", "🍄‍🟫", "Fruiting body"),
];
