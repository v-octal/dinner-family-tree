import type { Dish } from "./types";

/**
 * Write each ingredient as a food id from `foods.ts`.
 * Add a kitchen name after a colon when it differs, e.g. "milk:Parmesan".
 */
const d = (id: string, name: string, note: string, ingredients: string[]): Dish => ({
  id,
  name,
  note,
  ingredients: ingredients.map((entry) => {
    const [food, as] = entry.split(":");
    return as ? { food, as } : { food };
  }),
});

/** Prepared dishes. Each one lists its raw ingredients, main ingredient first. */
export const dishes: Dish[] = [
  // Italian
  d("pesto", "Pesto", "Italian sauce", ["basil", "pine-nut", "olive-oil", "garlic", "milk:Parmesan", "sheep-milk:Pecorino"]),
  d("margherita-pizza", "Margherita pizza", "Italian", ["wheat:Flour", "tomato", "buffalo-mozzarella", "basil", "olive-oil"]),
  d("caprese-salad", "Caprese salad", "Italian", ["tomato", "buffalo-mozzarella", "basil", "olive-oil"]),
  d("spaghetti-carbonara", "Spaghetti carbonara", "Italian pasta", ["durum-wheat:Spaghetti", "egg", "pork:Guanciale", "sheep-milk:Pecorino", "black-pepper"]),
  d("aglio-e-olio", "Spaghetti aglio e olio", "Italian pasta", ["durum-wheat:Spaghetti", "garlic", "olive-oil", "chili:Chili flakes", "parsley"]),
  d("mushroom-risotto", "Mushroom risotto", "Italian", ["rice:Arborio rice", "porcini", "onion", "butter", "grape:White wine", "milk:Parmesan"]),
  d("tiramisu", "Tiramisu", "Italian dessert", ["coffee:Espresso", "cream:Mascarpone", "egg", "wheat:Ladyfingers", "cacao:Cocoa", "sugarcane:Sugar"]),

  // French and Mediterranean
  d("ratatouille", "Ratatouille", "French stew", ["eggplant", "zucchini", "bell-pepper", "tomato", "onion", "garlic", "thyme", "olive-oil"]),
  d("beef-bourguignon", "Beef bourguignon", "French stew", ["beef", "grape:Red wine", "carrot", "onion", "button-mushroom", "pork:Bacon", "garlic", "thyme", "bay-leaf"]),
  d("french-onion-soup", "French onion soup", "French", ["onion", "beef:Beef broth", "wheat:Bread", "milk:Gruyère", "butter", "thyme"]),
  d("salade-nicoise", "Salade niçoise", "French salad", ["tuna", "egg", "green-bean", "potato", "tomato", "olive", "anchovy", "lettuce", "olive-oil"]),
  d("paella", "Paella", "Spanish", ["rice", "saffron", "shrimp", "mussel", "chicken", "tomato", "paprika", "olive-oil", "lemon"]),
  d("gazpacho", "Gazpacho", "Spanish cold soup", ["tomato", "cucumber", "bell-pepper", "onion", "garlic", "olive-oil", "wheat:Bread"]),
  d("greek-salad", "Greek salad", "Greek", ["tomato", "cucumber", "onion", "olive", "sheep-milk:Feta", "bell-pepper", "oregano", "olive-oil"]),
  d("moussaka", "Moussaka", "Greek", ["eggplant", "lamb", "potato", "tomato", "onion", "milk:Béchamel", "butter", "wheat:Flour", "cinnamon"]),
  d("tzatziki", "Tzatziki", "Greek dip", ["yogurt", "cucumber", "garlic", "dill", "olive-oil", "lemon"]),
  d("baklava", "Baklava", "Turkish dessert", ["wheat:Phyllo", "walnut", "pistachio", "butter", "honey", "cinnamon"]),

  // Middle East and North Africa
  d("hummus", "Hummus", "Levantine dip", ["chickpea", "sesame:Tahini", "lemon", "garlic", "olive-oil", "cumin"]),
  d("falafel", "Falafel", "Levantine", ["chickpea", "fava-bean", "parsley", "cilantro", "onion", "garlic", "cumin", "coriander-seed"]),
  d("tabbouleh", "Tabbouleh", "Levantine salad", ["bulgur", "parsley", "mint", "tomato", "onion", "lemon", "olive-oil"]),
  d("baba-ganoush", "Baba ganoush", "Levantine dip", ["eggplant", "sesame:Tahini", "lemon", "garlic", "olive-oil", "parsley"]),
  d("shakshuka", "Shakshuka", "North African", ["egg", "tomato", "bell-pepper", "onion", "garlic", "cumin", "paprika", "olive-oil", "cilantro"]),
  d("couscous", "Seven-vegetable couscous", "Moroccan", ["semolina:Couscous", "lamb", "chickpea", "carrot", "zucchini", "turnip", "pumpkin", "cumin", "cinnamon"]),

  // South Asia
  d("chana-masala", "Chana masala", "Indian curry", ["chickpea", "onion", "tomato", "ginger", "garlic", "chili", "cumin", "coriander-seed", "turmeric", "cilantro"]),
  d("dal-tadka", "Dal tadka", "Indian lentils", ["pigeon-pea:Toor dal", "turmeric", "cumin", "garlic", "chili", "tomato", "butter:Ghee", "cilantro"]),
  d("palak-paneer", "Palak paneer", "Indian curry", ["spinach", "paneer", "onion", "garlic", "ginger", "cream", "cumin", "chili"]),
  d("butter-chicken", "Butter chicken", "Indian curry", ["chicken", "butter", "cream", "tomato", "garlic", "ginger", "fenugreek-leaves:Kasuri methi", "chili"]),
  d("chicken-biryani", "Chicken biryani", "Indian rice", ["rice:Basmati rice", "chicken", "yogurt", "onion", "saffron", "cardamom", "cinnamon", "clove", "mint", "bay-leaf"]),
  d("aloo-gobi", "Aloo gobi", "Indian", ["potato", "cauliflower", "onion", "tomato", "turmeric", "cumin", "ginger", "cilantro"]),
  d("masala-dosa", "Masala dosa", "South Indian", ["rice", "black-gram:Urad dal", "potato", "onion", "brown-mustard-seed", "curry-leaf", "turmeric", "chili"]),
  d("gajar-halwa", "Gajar halwa", "Indian dessert", ["carrot", "milk", "butter:Ghee", "sugarcane:Sugar", "cardamom", "cashew", "raisin"]),
  d("masala-chai", "Masala chai", "Indian tea", ["black-tea", "milk", "ginger", "cardamom", "cinnamon", "clove", "sugarcane:Sugar"]),

  // East and Southeast Asia
  d("pad-thai", "Pad thai", "Thai noodles", ["rice:Rice noodles", "shrimp", "egg", "tofu", "peanut", "mung-bean-sprouts", "tamarind", "scallion", "lime"]),
  d("green-curry", "Thai green curry", "Thai curry", ["chicken", "coconut-milk", "chili", "lemongrass", "galangal", "eggplant", "basil:Thai basil"]),
  d("tom-yum", "Tom yum", "Thai soup", ["shrimp", "lemongrass", "galangal", "lime", "chili", "straw-mushroom", "cilantro"]),
  d("mango-sticky-rice", "Mango sticky rice", "Thai dessert", ["mango", "rice:Sticky rice", "coconut-milk", "sugarcane:Sugar", "sesame"]),
  d("pho", "Pho", "Vietnamese soup", ["rice:Rice noodles", "beef", "star-anise", "cinnamon", "ginger", "onion", "cilantro", "mung-bean-sprouts", "basil:Thai basil", "lime"]),
  d("spring-rolls", "Fresh spring rolls", "Vietnamese", ["rice:Rice paper", "shrimp", "lettuce", "mint", "cilantro", "carrot", "peanut:Peanut sauce"]),
  d("sushi", "Sushi", "Japanese", ["rice:Sushi rice", "salmon", "tuna", "wasabi", "ginger:Pickled ginger", "soybean:Soy sauce"]),
  d("miso-soup", "Miso soup", "Japanese soup", ["soybean:Miso", "tofu", "scallion", "rice:Koji"]),
  d("tonkotsu-ramen", "Tonkotsu ramen", "Japanese noodles", ["wheat:Ramen noodles", "pork", "egg", "scallion", "soybean:Soy sauce", "bamboo-shoots", "wood-ear", "garlic", "ginger"]),
  d("bibimbap", "Bibimbap", "Korean rice", ["rice", "beef", "spinach", "carrot", "mung-bean-sprouts", "egg", "shiitake", "sesame", "chili:Gochujang"]),
  d("kimchi", "Kimchi", "Korean ferment", ["napa-cabbage", "daikon", "chili:Gochugaru", "garlic", "ginger", "scallion", "shrimp:Salted shrimp"]),
  d("mapo-tofu", "Mapo tofu", "Sichuan", ["tofu", "pork", "fava-bean:Doubanjiang", "chili", "garlic", "ginger", "scallion"]),
  d("poke-bowl", "Poke bowl", "Hawaiian", ["tuna", "rice", "soybean:Soy sauce", "avocado", "cucumber", "edamame", "sesame", "scallion"]),

  // The Americas
  d("guacamole", "Guacamole", "Mexican dip", ["avocado", "lime", "onion", "cilantro", "jalapeno", "tomato"]),
  d("tacos-al-pastor", "Tacos al pastor", "Mexican", ["corn:Tortilla", "pork", "pineapple", "onion", "cilantro", "chili", "lime"]),
  d("burrito", "Burrito", "Mexican-American", ["wheat:Tortilla", "black-bean", "rice", "beef", "cheddar", "tomato", "onion", "avocado"]),
  d("mole-poblano", "Mole poblano", "Mexican", ["turkey", "chili", "cacao:Chocolate", "tomato", "sesame", "almond", "raisin", "cinnamon", "clove", "garlic"]),
  d("ceviche", "Ceviche", "Peruvian", ["sea-bass", "lime", "onion", "chili", "cilantro", "sweet-potato", "corn"]),
  d("feijoada", "Feijoada", "Brazilian stew", ["black-bean", "pork", "beef", "onion", "garlic", "bay-leaf", "rice", "orange"]),
  d("jollof-rice", "Jollof rice", "West African", ["rice", "tomato", "bell-pepper", "onion", "habanero:Scotch bonnet", "thyme", "bay-leaf", "ginger"]),
  d("gumbo", "Gumbo", "Louisiana stew", ["okra", "shrimp", "crab", "chicken", "pork:Andouille", "bell-pepper", "celery", "onion", "wheat:Roux", "bay-leaf"]),
  d("clam-chowder", "Clam chowder", "New England soup", ["clam", "potato", "onion", "cream", "celery", "pork:Bacon", "butter", "thyme"]),
  d("poutine", "Poutine", "Canadian", ["potato:Fries", "milk:Cheese curds", "beef:Gravy"]),

  // British and European comfort food
  d("fish-and-chips", "Fish and chips", "British", ["cod", "potato:Chips", "wheat:Batter", "green-pea:Mushy peas", "lemon"]),
  d("shepherds-pie", "Shepherd's pie", "British", ["lamb", "potato", "carrot", "green-pea", "onion", "butter"]),
  d("borscht", "Borscht", "Eastern European soup", ["beet", "cabbage", "potato", "carrot", "onion", "dill", "cream:Sour cream"]),
  d("waldorf-salad", "Waldorf salad", "American salad", ["apple", "celery", "walnut", "grape", "egg:Mayonnaise", "lettuce"]),
  d("coleslaw", "Coleslaw", "Salad", ["cabbage", "carrot", "egg:Mayonnaise", "yellow-mustard-seed:Mustard", "lemon"]),

  // Breakfast, baking, and drinks
  d("pancakes", "Pancakes", "Breakfast", ["wheat:Flour", "milk", "egg", "butter", "maple-syrup"]),
  d("apple-pie", "Apple pie", "Dessert", ["apple", "wheat:Flour", "butter", "sugarcane:Sugar", "cinnamon", "nutmeg"]),
  d("pumpkin-pie", "Pumpkin pie", "Dessert", ["pumpkin", "cream", "egg", "wheat:Flour", "butter", "cinnamon", "ginger", "nutmeg", "clove"]),
  d("banana-bread", "Banana bread", "Baking", ["banana", "wheat:Flour", "butter", "egg", "sugarcane:Sugar", "walnut"]),
  d("chocolate-chip-cookie", "Chocolate chip cookie", "Baking", ["wheat:Flour", "butter", "cacao:Chocolate chips", "sugarcane:Sugar", "egg", "vanilla"]),
  d("pbj-sandwich", "Peanut butter and jelly sandwich", "Lunch", ["wheat:Bread", "peanut:Peanut butter", "grape:Grape jelly"]),
  d("hot-chocolate", "Hot chocolate", "Drink", ["cacao:Cocoa", "milk", "sugarcane:Sugar", "vanilla"]),
  d("cappuccino", "Cappuccino", "Coffee drink", ["coffee:Espresso", "milk"]),
  d("matcha-latte", "Matcha latte", "Tea drink", ["green-tea:Matcha", "milk"]),
];
