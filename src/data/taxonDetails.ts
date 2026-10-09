import type { Rank } from "./types";

export const rankDetails: Record<Rank, { description: string; hint: string }> = {
  Domain: {
    description:
      "A domain is the broadest standard taxonomic rank. It separates life by fundamental cell features.",
    hint: "This tree starts with Eukaryota, the domain that includes plants, animals, and fungi.",
  },
  Kingdom: {
    description:
      "A kingdom groups major branches of life within a domain. Plants, animals, and fungi belong to separate kingdoms.",
    hint: "A kingdom contains many smaller groups with distinct features.",
  },
  Clade: {
    description:
      "A clade contains a common ancestor and all its descendants. It has no fixed level in the rank system.",
    hint: "Clades show branches of shared ancestry between named ranks in this tree.",
  },
  Phylum: {
    description:
      "A phylum groups related classes within a kingdom. Its members share major features of their body structure or development.",
    hint: "In plant classification, division is another name for this rank.",
  },
  Class: {
    description:
      "A class groups related orders within a phylum. Its members share more specific features than the phylum as a whole.",
    hint: "Mammals and birds are separate classes within the chordate phylum.",
  },
  Order: {
    description:
      "An order groups related families within a class or a broader branch. It connects families through shared ancestry.",
    hint: "The rose order includes the rose family and other related families.",
  },
  Family: {
    description:
      "A family groups related genera. Its members share ancestry and often have similar flowers, fruits, or body structures.",
    hint: "Plant family names often end in -aceae. Animal family names often end in -idae.",
  },
  Genus: {
    description:
      "A genus groups closely related species. It sits below family and above species in the rank system.",
    hint: "The genus supplies the first word in a scientific species name.",
  },
  Species: {
    description:
      "A species is a group of organisms that scientists distinguish from other groups by shared traits and ancestry.",
    hint: "Different crops or breeds sometimes belong to the same species. Species boundaries depend on the organisms and the evidence.",
  },
};

export const taxonNotes: Record<string, { title: string; body: string }> = {
  eukaryota: {
    title: "Cells with a nucleus",
    body: "Eukaryotes have cells with a nucleus that contains DNA. Plants, animals, and fungi share this cell structure.",
  },
  plantae: {
    title: "Plants and food",
    body: "Most plants use sunlight to make sugars from water and carbon dioxide. Plant foods come from roots, stems, leaves, flowers, fruits, or seeds.",
  },
  angiosperms: {
    title: "Flowers and fruits",
    body: "Flowering plants produce seeds inside an ovary. The ovary develops into a fruit, sometimes with other flower parts.",
  },
  eudicots: {
    title: "A major plant branch",
    body: "Eudicots typically have two seed leaves. Their pollen usually has three openings or forms that derive from this pattern.",
  },
  monocots: {
    title: "One seed leaf",
    body: "Monocots have one seed leaf. Their leaves often have parallel veins. Grasses, palms, and orchids belong to this branch.",
  },
  magnoliids: {
    title: "Avocado and spices",
    body: "Magnoliids form a branch of flowering plants distinct from monocots and eudicots. Avocado, cinnamon, and black pepper belong to this branch.",
  },
  animalia: {
    title: "Animals and their products",
    body: "Animals consume organic material for energy. Meat comes from animal tissues. Milk and honey are products of animals, not separate organisms.",
  },
  fungi: {
    title: "Fungi are not plants",
    body: "Fungi absorb nutrients from their surroundings. They share a more recent common ancestor with animals than with plants. Edible mushrooms are reproductive structures of fungi.",
  },
  mammalia: {
    title: "Milk for young mammals",
    body: "Female mammals produce milk from mammary glands to feed their young. Milk is a food from a mammal, not a species.",
  },
  arthropoda: {
    title: "Jointed legs and an outer skeleton",
    body: "Arthropods have jointed limbs and an outer skeleton. Their outer skeleton contains chitin. Shrimp, crabs, and honey bees belong to this group.",
  },
  mollusca: {
    title: "Soft bodies and varied shells",
    body: "Molluscs have soft bodies, and many have shells. Oysters and mussels have two shell halves. Squid belong to the same phylum.",
  },
  rosaceae: {
    title: "The rose family",
    body: "Apples, pears, strawberries, cherries, and almonds belong to the rose family. They share a family with roses, but they occupy different genera.",
  },
  brassicaceae: {
    title: "The mustard family",
    body: "Cabbage, radish, and mustard belong to this family. Their flowers typically have four petals in a cross shape.",
  },
  fabaceae: {
    title: "Legumes and root bacteria",
    body: "Peas, beans, lentils, and peanuts are legumes. Many legumes host root bacteria that convert nitrogen gas into compounds the plant uses.",
  },
  rutaceae: {
    title: "The citrus family",
    body: "Oranges, lemons, and limes belong to this family. Citrus peel contains oil glands that supply its characteristic scent.",
  },
  cucurbitaceae: {
    title: "The gourd family",
    body: "Pumpkins, cucumbers, and watermelons belong to the gourd family. Their fruits are pepos, a type of berry with a firm outer rind.",
  },
  solanaceae: {
    title: "The nightshade family",
    body: "Tomatoes, potatoes, eggplants, and chili peppers belong to this family. A potato tuber is an underground stem. Tomatoes and peppers supply fruits.",
  },
  apiaceae: {
    title: "The carrot family",
    body: "Carrot, celery, parsley, and coriander belong to this family. Their small flowers typically form umbrella-shaped clusters called umbels.",
  },
  asteraceae: {
    title: "The daisy family",
    body: "Lettuce, sunflower, and artichoke belong to this family. Each flower head contains many small flowers rather than one large flower.",
  },
  lamiaceae: {
    title: "The mint family",
    body: "Mint, basil, rosemary, and thyme belong to this family. Many members have square stems and opposite leaves. Leaf oils give these herbs their scents.",
  },
  amaranthaceae: {
    title: "Beets, spinach, and quinoa",
    body: "Beets, spinach, and quinoa belong to this family. Quinoa supplies seeds, but it is not a cereal grass.",
  },
  poaceae: {
    title: "The grass family",
    body: "Rice, wheat, maize, and barley are grasses. Their grains are fruits in which the fruit wall joins tightly to the seed coat.",
  },
  lauraceae: {
    title: "The laurel family",
    body: "Avocado, cinnamon, and bay laurel belong to this family. Avocado supplies fruit flesh, cinnamon supplies bark, and bay laurel supplies leaves.",
  },
  prunus: {
    title: "Stone fruits and almonds",
    body: "Peaches, plums, cherries, apricots, and almonds belong to Prunus. Their fruits have a hard stone around the seed. The almond kernel is that seed.",
  },
  malus: {
    title: "Apples and crabapples",
    body: "Malus includes orchard apples and crabapples. Their fruits are pomes. Much of the edible flesh develops from flower tissue around the ovary.",
  },
  "prunus-dulcis": {
    title: "The edible almond seed",
    body: "The almond tree produces a fruit with an outer hull and a hard shell. People eat the seed inside the shell, not the hull.",
  },
  "malus-domestica": {
    title: "Many apple varieties",
    body: "Orchard apple varieties belong to the same species. Growers graft shoots onto rootstocks to preserve a variety. Seeds do not reliably produce the same variety.",
  },
  "brassica-oleracea": {
    title: "One species, many vegetables",
    body: "Cabbage, kale, broccoli, cauliflower, and Brussels sprouts are cultivated forms of one species. Broccoli supplies flower buds and stems. Brussels sprouts are buds along the stem.",
  },
  "gallus-gallus": {
    title: "Chicken meat and eggs",
    body: "Domestic chickens belong to this species. They supply both meat and eggs. Hens lay unfertilized eggs without a rooster.",
  },
  "agaricus-bisporus": {
    title: "Button, cremini, and portobello",
    body: "White button and cremini mushrooms are different cultivated forms of the same species. Portobello mushrooms are mature brown mushrooms. The mushroom is not the entire fungus.",
  },
  "bos-taurus": {
    title: "Beef and milk",
    body: "Domestic cattle supply beef and milk. Cows produce milk to feed their calves. Milk is an animal product, not an organism.",
  },
  "capsicum-annuum": {
    title: "Sweet and hot peppers",
    body: "Bell peppers, jalapeños, and cayenne peppers belong to this species. Capsaicin gives hot peppers their heat. Sweet bell peppers lack this heat.",
  },
  "beta-vulgaris": {
    title: "Beetroot, chard, and sugar beet",
    body: "Beetroot, Swiss chard, and sugar beet belong to the same species. Beetroot supplies an enlarged root and stem base. Chard supplies leaves; sugar beet supplies sugar.",
  },
  "apis-mellifera": {
    title: "The bee that produces honey",
    body: "Western honey bees convert nectar into honey and store it as food. Honey is a product of bees, not an organism. Bees also pollinate many crops.",
  },
};
