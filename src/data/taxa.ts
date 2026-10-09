import type { Rank, Taxon } from "./types";

type Extra = Pick<Taxon, "common" | "blurb">;

const t = (
  id: string,
  name: string,
  rank: Rank,
  parent: string | null,
  extra: Extra = {},
): Taxon => ({ id, name, rank, parent, ...extra });

/**
 * Demo taxonomy. Ranks follow APG IV for plants and conventional Linnaean
 * ranks elsewhere. Unranked clades (Angiosperms, Rosids, ...) are included
 * so that plant paths show their real intermediate steps.
 */
export const taxa: Taxon[] = [
  t("eukaryota", "Eukaryota", "Domain", null, {
    common: "Life with a nucleus",
    blurb:
      "Every plant, animal and fungus on your plate descends from a single-celled ancestor that lived around two billion years ago.",
  }),

  // ───────────────────────── Plants ─────────────────────────
  t("plantae", "Plantae", "Kingdom", "eukaryota", {
    common: "Plants",
    blurb: "Everything green on the table shares one ancestor that learned to turn sunlight into sugar.",
  }),
  t("angiosperms", "Angiosperms", "Clade", "plantae", {
    common: "Flowering plants",
    blurb: "Almost every plant we eat makes flowers. Fruit is simply a flower that kept going.",
  }),
  t("eudicots", "Eudicots", "Clade", "angiosperms", {
    common: "True dicots",
    blurb: "Seeds with two leaves and pollen with three grooves: the biggest branch of the plant world.",
  }),
  t("rosids", "Rosids", "Clade", "eudicots", {
    common: "Rosid group",
    blurb: "About a quarter of all flowering plants, from apple orchards to cabbage patches.",
  }),
  t("asterids", "Asterids", "Clade", "eudicots", {
    common: "Asterid group",
    blurb: "Tomatoes, coffee, carrots and mint all sit on this branch. Their petals tend to fuse into tubes.",
  }),
  t("monocots", "Monocots", "Clade", "angiosperms", {
    common: "Monocots",
    blurb: "One seed leaf, parallel veins. The grasses, lilies and palms that feed most of humanity.",
  }),
  t("commelinids", "Commelinids", "Clade", "monocots", {
    common: "Commelinid group",
    blurb: "Grasses, gingers, bananas and palms share a quirk of their cell walls that glows under UV light.",
  }),
  t("magnoliids", "Magnoliids", "Clade", "angiosperms", {
    common: "Magnoliids",
    blurb: "An ancient branch of flowering plants that gave us avocado, cinnamon, nutmeg and pepper.",
  }),

  // Rosales
  t("rosales", "Rosales", "Order", "rosids", { common: "Rose order" }),
  t("rosaceae", "Rosaceae", "Family", "rosales", {
    common: "Rose family",
    blurb: "Apples, almonds, strawberries and cherries are all, botanically, roses.",
  }),
  t("malus", "Malus", "Genus", "rosaceae", { common: "Apples" }),
  t("malus-domestica", "Malus domestica", "Species", "malus", { common: "Orchard apple" }),
  t("fragaria", "Fragaria", "Genus", "rosaceae", { common: "Strawberries" }),
  t("fragaria-ananassa", "Fragaria × ananassa", "Species", "fragaria", { common: "Garden strawberry" }),
  t("prunus", "Prunus", "Genus", "rosaceae", {
    common: "Stone fruits",
    blurb: "An almond is the seed of a fruit very much like a peach. Same genus, different edible part.",
  }),
  t("prunus-dulcis", "Prunus dulcis", "Species", "prunus", { common: "Almond tree" }),
  t("prunus-avium", "Prunus avium", "Species", "prunus", { common: "Sweet cherry" }),
  t("prunus-persica", "Prunus persica", "Species", "prunus", { common: "Peach" }),

  // Brassicales
  t("brassicales", "Brassicales", "Order", "rosids", { common: "Mustard order" }),
  t("brassicaceae", "Brassicaceae", "Family", "brassicales", { common: "Mustard family" }),
  t("brassica", "Brassica", "Genus", "brassicaceae", { common: "Cabbages" }),
  t("brassica-oleracea", "Brassica oleracea", "Species", "brassica", {
    common: "Wild cabbage",
    blurb: "Broccoli, cauliflower, kale and cabbage are one species, bred into wildly different shapes.",
  }),

  // Fabales
  t("fabales", "Fabales", "Order", "rosids", { common: "Legume order" }),
  t("fabaceae", "Fabaceae", "Family", "fabales", {
    common: "Legume family",
    blurb: "Peanuts, lentils and soy fix their own nitrogen with the help of root bacteria.",
  }),
  t("arachis", "Arachis", "Genus", "fabaceae"),
  t("arachis-hypogaea", "Arachis hypogaea", "Species", "arachis", { common: "Peanut" }),
  t("glycine", "Glycine", "Genus", "fabaceae"),
  t("glycine-max", "Glycine max", "Species", "glycine", { common: "Soybean" }),
  t("cicer", "Cicer", "Genus", "fabaceae"),
  t("cicer-arietinum", "Cicer arietinum", "Species", "cicer", { common: "Chickpea" }),
  t("lens", "Lens", "Genus", "fabaceae"),
  t("lens-culinaris", "Lens culinaris", "Species", "lens", { common: "Lentil" }),

  // Sapindales
  t("sapindales", "Sapindales", "Order", "rosids", {
    common: "Soapberry order",
    blurb: "Citrus, mango, cashew and maple syrup all come from this one order.",
  }),
  t("rutaceae", "Rutaceae", "Family", "sapindales", { common: "Citrus family" }),
  t("citrus", "Citrus", "Genus", "rutaceae", {
    blurb: "Nearly every citrus you buy is a hybrid of just three wild ancestors.",
  }),
  t("citrus-sinensis", "Citrus × sinensis", "Species", "citrus", { common: "Sweet orange" }),
  t("citrus-limon", "Citrus × limon", "Species", "citrus", { common: "Lemon" }),
  t("anacardiaceae", "Anacardiaceae", "Family", "sapindales", {
    common: "Cashew family",
    blurb: "Mango, cashew and pistachio share a family with poison ivy. Their skins can irritate for the same reason.",
  }),
  t("mangifera", "Mangifera", "Genus", "anacardiaceae"),
  t("mangifera-indica", "Mangifera indica", "Species", "mangifera", { common: "Mango" }),
  t("anacardium", "Anacardium", "Genus", "anacardiaceae"),
  t("anacardium-occidentale", "Anacardium occidentale", "Species", "anacardium", { common: "Cashew" }),
  t("pistacia", "Pistacia", "Genus", "anacardiaceae"),
  t("pistacia-vera", "Pistacia vera", "Species", "pistacia", { common: "Pistachio" }),

  // Malvales, Vitales, Cucurbitales, Fagales
  t("malvales", "Malvales", "Order", "rosids", { common: "Mallow order" }),
  t("malvaceae", "Malvaceae", "Family", "malvales", {
    common: "Mallow family",
    blurb: "Chocolate, cotton, okra and hibiscus are all mallows.",
  }),
  t("theobroma", "Theobroma", "Genus", "malvaceae", { common: "Food of the gods" }),
  t("theobroma-cacao", "Theobroma cacao", "Species", "theobroma", { common: "Cacao tree" }),

  t("vitales", "Vitales", "Order", "rosids", { common: "Grape order" }),
  t("vitaceae", "Vitaceae", "Family", "vitales", { common: "Grape family" }),
  t("vitis", "Vitis", "Genus", "vitaceae"),
  t("vitis-vinifera", "Vitis vinifera", "Species", "vitis", { common: "Wine grape" }),

  t("cucurbitales", "Cucurbitales", "Order", "rosids", { common: "Gourd order" }),
  t("cucurbitaceae", "Cucurbitaceae", "Family", "cucurbitales", {
    common: "Gourd family",
    blurb: "Pumpkins, cucumbers and watermelons: botanically, all of them are berries.",
  }),
  t("cucurbita", "Cucurbita", "Genus", "cucurbitaceae", { common: "Squashes" }),
  t("cucurbita-pepo", "Cucurbita pepo", "Species", "cucurbita", { common: "Pumpkin & zucchini" }),
  t("cucumis", "Cucumis", "Genus", "cucurbitaceae"),
  t("cucumis-sativus", "Cucumis sativus", "Species", "cucumis", { common: "Cucumber" }),
  t("citrullus", "Citrullus", "Genus", "cucurbitaceae"),
  t("citrullus-lanatus", "Citrullus lanatus", "Species", "citrullus", { common: "Watermelon" }),

  t("fagales", "Fagales", "Order", "rosids", {
    common: "Beech order",
    blurb: "Walnuts, hazelnuts, oaks and birches: catkin-bearing trees of the temperate north.",
  }),
  t("juglandaceae", "Juglandaceae", "Family", "fagales", { common: "Walnut family" }),
  t("juglans", "Juglans", "Genus", "juglandaceae"),
  t("juglans-regia", "Juglans regia", "Species", "juglans", { common: "Persian walnut" }),
  t("betulaceae", "Betulaceae", "Family", "fagales", { common: "Birch family" }),
  t("corylus", "Corylus", "Genus", "betulaceae"),
  t("corylus-avellana", "Corylus avellana", "Species", "corylus", { common: "Hazel" }),

  // Asterids: Solanales, Apiales, Gentianales, Asterales, Lamiales
  t("solanales", "Solanales", "Order", "asterids", {
    common: "Nightshade order",
    blurb: "Potatoes and sweet potatoes are not close relatives, but they do share this order.",
  }),
  t("solanaceae", "Solanaceae", "Family", "solanales", {
    common: "Nightshade family",
    blurb: "Tomato, potato, chili and eggplant were all once feared as poisonous in Europe.",
  }),
  t("solanum", "Solanum", "Genus", "solanaceae", {
    blurb: "Tomato, potato and eggplant are in the same genus. A tomato is closer to a potato than to a chili.",
  }),
  t("solanum-lycopersicum", "Solanum lycopersicum", "Species", "solanum", { common: "Tomato" }),
  t("solanum-tuberosum", "Solanum tuberosum", "Species", "solanum", { common: "Potato" }),
  t("solanum-melongena", "Solanum melongena", "Species", "solanum", { common: "Eggplant" }),
  t("capsicum", "Capsicum", "Genus", "solanaceae", { common: "Peppers" }),
  t("capsicum-annuum", "Capsicum annuum", "Species", "capsicum", { common: "Chili & bell pepper" }),
  t("convolvulaceae", "Convolvulaceae", "Family", "solanales", { common: "Morning glory family" }),
  t("ipomoea", "Ipomoea", "Genus", "convolvulaceae"),
  t("ipomoea-batatas", "Ipomoea batatas", "Species", "ipomoea", { common: "Sweet potato" }),

  t("apiales", "Apiales", "Order", "asterids", { common: "Carrot order" }),
  t("apiaceae", "Apiaceae", "Family", "apiales", {
    common: "Carrot family",
    blurb: "Carrots, parsley, celery, cumin and coriander all carry the family's umbrella-shaped flowers.",
  }),
  t("daucus", "Daucus", "Genus", "apiaceae"),
  t("daucus-carota", "Daucus carota", "Species", "daucus", { common: "Carrot" }),

  t("gentianales", "Gentianales", "Order", "asterids", { common: "Gentian order" }),
  t("rubiaceae", "Rubiaceae", "Family", "gentianales", { common: "Coffee family" }),
  t("coffea", "Coffea", "Genus", "rubiaceae"),
  t("coffea-arabica", "Coffea arabica", "Species", "coffea", { common: "Arabica coffee" }),

  t("asterales", "Asterales", "Order", "asterids", { common: "Daisy order" }),
  t("asteraceae", "Asteraceae", "Family", "asterales", {
    common: "Daisy family",
    blurb: "Lettuce and sunflowers are daisies. A sunflower head is hundreds of tiny flowers packed together.",
  }),
  t("helianthus", "Helianthus", "Genus", "asteraceae"),
  t("helianthus-annuus", "Helianthus annuus", "Species", "helianthus", { common: "Sunflower" }),
  t("lactuca", "Lactuca", "Genus", "asteraceae"),
  t("lactuca-sativa", "Lactuca sativa", "Species", "lactuca", { common: "Lettuce" }),

  t("lamiales", "Lamiales", "Order", "asterids", {
    common: "Mint order",
    blurb: "Olives, basil, mint and sesame share an order full of fragrant oils.",
  }),
  t("lamiaceae", "Lamiaceae", "Family", "lamiales", {
    common: "Mint family",
    blurb: "Square stems and aromatic leaves: basil, mint, oregano, thyme and lavender.",
  }),
  t("ocimum", "Ocimum", "Genus", "lamiaceae"),
  t("ocimum-basilicum", "Ocimum basilicum", "Species", "ocimum", { common: "Sweet basil" }),
  t("mentha", "Mentha", "Genus", "lamiaceae"),
  t("mentha-spicata", "Mentha spicata", "Species", "mentha", { common: "Spearmint" }),
  t("oleaceae", "Oleaceae", "Family", "lamiales", { common: "Olive family" }),
  t("olea", "Olea", "Genus", "oleaceae"),
  t("olea-europaea", "Olea europaea", "Species", "olea", { common: "Olive tree" }),
  t("pedaliaceae", "Pedaliaceae", "Family", "lamiales", { common: "Sesame family" }),
  t("sesamum", "Sesamum", "Genus", "pedaliaceae"),
  t("sesamum-indicum", "Sesamum indicum", "Species", "sesamum", { common: "Sesame" }),

  // Caryophyllales (core eudicots)
  t("caryophyllales", "Caryophyllales", "Order", "eudicots", {
    common: "Pink order",
    blurb: "Beets, spinach, quinoa and cacti make their red pigments from betalains instead of the usual anthocyanins.",
  }),
  t("amaranthaceae", "Amaranthaceae", "Family", "caryophyllales", {
    common: "Amaranth family",
    blurb: "Spinach, beetroot and quinoa are close kin. Quinoa leaves taste a lot like spinach.",
  }),
  t("spinacia", "Spinacia", "Genus", "amaranthaceae"),
  t("spinacia-oleracea", "Spinacia oleracea", "Species", "spinacia", { common: "Spinach" }),
  t("beta", "Beta", "Genus", "amaranthaceae"),
  t("beta-vulgaris", "Beta vulgaris", "Species", "beta", { common: "Beet, chard & sugar beet" }),
  t("chenopodium", "Chenopodium", "Genus", "amaranthaceae"),
  t("chenopodium-quinoa", "Chenopodium quinoa", "Species", "chenopodium", { common: "Quinoa" }),

  // Monocots: Poales, Zingiberales, Arecales, Asparagales
  t("poales", "Poales", "Order", "commelinids", { common: "Grass order" }),
  t("poaceae", "Poaceae", "Family", "poales", {
    common: "Grass family",
    blurb: "Rice, wheat and corn are grasses. Three grass seeds supply half of all human calories.",
  }),
  t("oryza", "Oryza", "Genus", "poaceae"),
  t("oryza-sativa", "Oryza sativa", "Species", "oryza", { common: "Asian rice" }),
  t("triticum", "Triticum", "Genus", "poaceae"),
  t("triticum-aestivum", "Triticum aestivum", "Species", "triticum", { common: "Bread wheat" }),
  t("zea", "Zea", "Genus", "poaceae"),
  t("zea-mays", "Zea mays", "Species", "zea", { common: "Maize" }),

  t("zingiberales", "Zingiberales", "Order", "commelinids", {
    common: "Ginger order",
    blurb: "Bananas, ginger, turmeric and cardamom all grow from the same tropical branch.",
  }),
  t("musaceae", "Musaceae", "Family", "zingiberales", { common: "Banana family" }),
  t("musa", "Musa", "Genus", "musaceae"),
  t("musa-acuminata", "Musa acuminata", "Species", "musa", { common: "Dessert banana" }),
  t("zingiberaceae", "Zingiberaceae", "Family", "zingiberales", { common: "Ginger family" }),
  t("zingiber", "Zingiber", "Genus", "zingiberaceae"),
  t("zingiber-officinale", "Zingiber officinale", "Species", "zingiber", { common: "Ginger" }),

  t("arecales", "Arecales", "Order", "commelinids", { common: "Palm order" }),
  t("arecaceae", "Arecaceae", "Family", "arecales", {
    common: "Palm family",
    blurb: "Coconuts and dates both come from palms, the only family in their order.",
  }),
  t("cocos", "Cocos", "Genus", "arecaceae"),
  t("cocos-nucifera", "Cocos nucifera", "Species", "cocos", { common: "Coconut palm" }),
  t("phoenix", "Phoenix", "Genus", "arecaceae"),
  t("phoenix-dactylifera", "Phoenix dactylifera", "Species", "phoenix", { common: "Date palm" }),

  t("asparagales", "Asparagales", "Order", "monocots", {
    common: "Asparagus order",
    blurb: "Onions, asparagus and vanilla orchids: an unlikely trio from one order.",
  }),
  t("amaryllidaceae", "Amaryllidaceae", "Family", "asparagales", { common: "Amaryllis family" }),
  t("allium", "Allium", "Genus", "amaryllidaceae", {
    common: "Onions & garlic",
    blurb: "Onion, garlic, leek and chive are all alliums. Their bite is a sulfur defense against grazers.",
  }),
  t("allium-cepa", "Allium cepa", "Species", "allium", { common: "Onion" }),
  t("allium-sativum", "Allium sativum", "Species", "allium", { common: "Garlic" }),
  t("asparagaceae", "Asparagaceae", "Family", "asparagales", { common: "Asparagus family" }),
  t("asparagus", "Asparagus", "Genus", "asparagaceae"),
  t("asparagus-officinalis", "Asparagus officinalis", "Species", "asparagus", { common: "Garden asparagus" }),
  t("orchidaceae", "Orchidaceae", "Family", "asparagales", { common: "Orchid family" }),
  t("vanilla", "Vanilla", "Genus", "orchidaceae"),
  t("vanilla-planifolia", "Vanilla planifolia", "Species", "vanilla", { common: "Vanilla orchid" }),

  // Magnoliids
  t("laurales", "Laurales", "Order", "magnoliids", { common: "Laurel order" }),
  t("lauraceae", "Lauraceae", "Family", "laurales", {
    common: "Laurel family",
    blurb: "Avocado, cinnamon and bay leaf are all laurels.",
  }),
  t("persea", "Persea", "Genus", "lauraceae"),
  t("persea-americana", "Persea americana", "Species", "persea", { common: "Avocado" }),
  t("cinnamomum", "Cinnamomum", "Genus", "lauraceae"),
  t("cinnamomum-verum", "Cinnamomum verum", "Species", "cinnamomum", { common: "Ceylon cinnamon" }),
  t("piperales", "Piperales", "Order", "magnoliids", { common: "Pepper order" }),
  t("piperaceae", "Piperaceae", "Family", "piperales", { common: "Pepper family" }),
  t("piper", "Piper", "Genus", "piperaceae"),
  t("piper-nigrum", "Piper nigrum", "Species", "piper", { common: "Black pepper vine" }),

  // ───────────────────────── Animals ─────────────────────────
  t("animalia", "Animalia", "Kingdom", "eukaryota", {
    common: "Animals",
    blurb: "From oysters to oxen: every animal shares an ancestor that lived in the sea.",
  }),
  t("chordata", "Chordata", "Phylum", "animalia", {
    common: "Chordates",
    blurb: "Animals with a backbone, or at least a stiff rod along the back.",
  }),
  t("mammalia", "Mammalia", "Class", "chordata", {
    common: "Mammals",
    blurb: "Warm-blooded, furry, and raised on milk.",
  }),
  t("artiodactyla", "Artiodactyla", "Order", "mammalia", {
    common: "Even-toed hoofed mammals",
    blurb: "Cattle, sheep, pigs, camels and, surprisingly, whales.",
  }),
  t("bovidae", "Bovidae", "Family", "artiodactyla", {
    common: "Cattle, sheep & goats",
    blurb: "Hollow-horned grazers with four-chambered stomachs.",
  }),
  t("bos", "Bos", "Genus", "bovidae"),
  t("bos-taurus", "Bos taurus", "Species", "bos", { common: "Domestic cattle" }),
  t("ovis", "Ovis", "Genus", "bovidae"),
  t("ovis-aries", "Ovis aries", "Species", "ovis", { common: "Domestic sheep" }),
  t("capra", "Capra", "Genus", "bovidae"),
  t("capra-hircus", "Capra hircus", "Species", "capra", { common: "Domestic goat" }),
  t("suidae", "Suidae", "Family", "artiodactyla", { common: "Pigs" }),
  t("sus", "Sus", "Genus", "suidae"),
  t("sus-domesticus", "Sus domesticus", "Species", "sus", { common: "Domestic pig" }),

  t("aves", "Aves", "Class", "chordata", {
    common: "Birds",
    blurb: "Living dinosaurs. Chicken is the closest thing to T. rex on the menu.",
  }),
  t("galliformes", "Galliformes", "Order", "aves", { common: "Landfowl" }),
  t("phasianidae", "Phasianidae", "Family", "galliformes", {
    common: "Pheasant family",
    blurb: "Chickens, turkeys, pheasants, quail and peafowl.",
  }),
  t("gallus", "Gallus", "Genus", "phasianidae", { common: "Junglefowl" }),
  t("gallus-gallus", "Gallus gallus", "Species", "gallus", {
    common: "Red junglefowl / chicken",
    blurb: "Which came first? The egg: reptiles laid eggs long before there were chickens.",
  }),
  t("meleagris", "Meleagris", "Genus", "phasianidae"),
  t("meleagris-gallopavo", "Meleagris gallopavo", "Species", "meleagris", { common: "Wild turkey" }),
  t("anseriformes", "Anseriformes", "Order", "aves", { common: "Waterfowl" }),
  t("anatidae", "Anatidae", "Family", "anseriformes", { common: "Ducks, geese & swans" }),
  t("anas", "Anas", "Genus", "anatidae"),
  t("anas-platyrhynchos", "Anas platyrhynchos", "Species", "anas", { common: "Mallard / domestic duck" }),

  t("actinopterygii", "Actinopterygii", "Class", "chordata", {
    common: "Ray-finned fishes",
    blurb: "Half of all vertebrate species are ray-finned fish.",
  }),
  t("salmoniformes", "Salmoniformes", "Order", "actinopterygii", { common: "Salmon order" }),
  t("salmonidae", "Salmonidae", "Family", "salmoniformes", { common: "Salmon & trout" }),
  t("salmo", "Salmo", "Genus", "salmonidae"),
  t("salmo-salar", "Salmo salar", "Species", "salmo", { common: "Atlantic salmon" }),
  t("scombriformes", "Scombriformes", "Order", "actinopterygii", { common: "Mackerel order" }),
  t("scombridae", "Scombridae", "Family", "scombriformes", { common: "Mackerels & tunas" }),
  t("thunnus", "Thunnus", "Genus", "scombridae"),
  t("thunnus-albacares", "Thunnus albacares", "Species", "thunnus", { common: "Yellowfin tuna" }),
  t("gadiformes", "Gadiformes", "Order", "actinopterygii", { common: "Cod order" }),
  t("gadidae", "Gadidae", "Family", "gadiformes", { common: "Cods" }),
  t("gadus", "Gadus", "Genus", "gadidae"),
  t("gadus-morhua", "Gadus morhua", "Species", "gadus", { common: "Atlantic cod" }),

  t("arthropoda", "Arthropoda", "Phylum", "animalia", {
    common: "Arthropods",
    blurb: "Jointed legs and an outer skeleton. Shrimp and honeybees are closer kin than shrimp and salmon.",
  }),
  t("malacostraca", "Malacostraca", "Class", "arthropoda", { common: "Crabs, lobsters & shrimp" }),
  t("decapoda", "Decapoda", "Order", "malacostraca", {
    common: "Ten-legged crustaceans",
    blurb: "Shrimp, lobsters and crabs: ten legs, and a shell that turns red when cooked.",
  }),
  t("penaeidae", "Penaeidae", "Family", "decapoda", { common: "Prawn family" }),
  t("penaeus", "Penaeus", "Genus", "penaeidae"),
  t("penaeus-vannamei", "Penaeus vannamei", "Species", "penaeus", { common: "Whiteleg shrimp" }),
  t("nephropidae", "Nephropidae", "Family", "decapoda", { common: "Clawed lobsters" }),
  t("homarus", "Homarus", "Genus", "nephropidae"),
  t("homarus-americanus", "Homarus americanus", "Species", "homarus", { common: "American lobster" }),
  t("portunidae", "Portunidae", "Family", "decapoda", { common: "Swimming crabs" }),
  t("callinectes", "Callinectes", "Genus", "portunidae"),
  t("callinectes-sapidus", "Callinectes sapidus", "Species", "callinectes", { common: "Blue crab" }),
  t("insecta", "Insecta", "Class", "arthropoda", { common: "Insects" }),
  t("hymenoptera", "Hymenoptera", "Order", "insecta", { common: "Bees, wasps & ants" }),
  t("apidae", "Apidae", "Family", "hymenoptera", { common: "Bee family" }),
  t("apis", "Apis", "Genus", "apidae", { common: "Honey bees" }),
  t("apis-mellifera", "Apis mellifera", "Species", "apis", { common: "Western honey bee" }),

  t("mollusca", "Mollusca", "Phylum", "animalia", {
    common: "Molluscs",
    blurb: "Soft bodies, often a shell. Squid and oysters are more alike than they look.",
  }),
  t("cephalopoda", "Cephalopoda", "Class", "mollusca", { common: "Squid, octopus & cuttlefish" }),
  t("myopsida", "Myopsida", "Order", "cephalopoda", { common: "Inshore squids" }),
  t("loliginidae", "Loliginidae", "Family", "myopsida", { common: "Pencil squids" }),
  t("loligo", "Loligo", "Genus", "loliginidae"),
  t("loligo-vulgaris", "Loligo vulgaris", "Species", "loligo", { common: "European squid" }),
  t("bivalvia", "Bivalvia", "Class", "mollusca", {
    common: "Bivalves",
    blurb: "Two hinged shells and no head at all.",
  }),
  t("ostreida", "Ostreida", "Order", "bivalvia", { common: "Oyster order" }),
  t("ostreidae", "Ostreidae", "Family", "ostreida", { common: "True oysters" }),
  t("magallana", "Magallana", "Genus", "ostreidae"),
  t("magallana-gigas", "Magallana gigas", "Species", "magallana", { common: "Pacific oyster" }),
  t("mytilida", "Mytilida", "Order", "bivalvia", { common: "Mussel order" }),
  t("mytilidae", "Mytilidae", "Family", "mytilida", { common: "Sea mussels" }),
  t("mytilus", "Mytilus", "Genus", "mytilidae"),
  t("mytilus-edulis", "Mytilus edulis", "Species", "mytilus", { common: "Blue mussel" }),

  // ───────────────────────── Fungi ─────────────────────────
  t("fungi", "Fungi", "Kingdom", "eukaryota", {
    common: "Fungi",
    blurb: "Closer to animals than to plants. Mushrooms digest their food outside their bodies, like we do inside.",
  }),
  t("basidiomycota", "Basidiomycota", "Phylum", "fungi", { common: "Club fungi" }),
  t("agaricomycetes", "Agaricomycetes", "Class", "basidiomycota", { common: "Mushroom-forming fungi" }),
  t("agaricales", "Agaricales", "Order", "agaricomycetes", {
    common: "Gilled mushrooms",
    blurb: "Button mushrooms, shiitake and oyster mushrooms all drop their spores from gills.",
  }),
  t("agaricaceae", "Agaricaceae", "Family", "agaricales"),
  t("agaricus", "Agaricus", "Genus", "agaricaceae"),
  t("agaricus-bisporus", "Agaricus bisporus", "Species", "agaricus", {
    common: "Button, cremini & portobello",
    blurb: "White button, cremini and portobello are the same mushroom at different ages.",
  }),
  t("omphalotaceae", "Omphalotaceae", "Family", "agaricales"),
  t("lentinula", "Lentinula", "Genus", "omphalotaceae"),
  t("lentinula-edodes", "Lentinula edodes", "Species", "lentinula", { common: "Shiitake" }),
  t("pleurotaceae", "Pleurotaceae", "Family", "agaricales"),
  t("pleurotus", "Pleurotus", "Genus", "pleurotaceae"),
  t("pleurotus-ostreatus", "Pleurotus ostreatus", "Species", "pleurotus", { common: "Oyster mushroom" }),
  t("ascomycota", "Ascomycota", "Phylum", "fungi", {
    common: "Sac fungi",
    blurb: "Truffles, morels, baker's yeast and the mould that makes penicillin.",
  }),
  t("pezizomycetes", "Pezizomycetes", "Class", "ascomycota", { common: "Cup fungi" }),
  t("pezizales", "Pezizales", "Order", "pezizomycetes"),
  t("tuberaceae", "Tuberaceae", "Family", "pezizales", { common: "Truffle family" }),
  t("tuber", "Tuber", "Genus", "tuberaceae"),
  t("tuber-melanosporum", "Tuber melanosporum", "Species", "tuber", { common: "Black truffle" }),
];
