# The Family Tree of Your Dinner

A visual explorer of edible kinship. Pick any two foods. The app climbs both biological trees, rank by rank, and stops where the branches touch.

Live site: <https://v-octal.github.io/dinner-family-tree/>

Built with [Agent Duel](https://github.com/bottomless/agent-duel).

Cabbage and broccoli meet at one species. Apple and almond meet at the rose family. A pine nut and an apple meet only in the plant kingdom.

## What it does

- Search 350 foods in a combobox. Match on the name, the note, the scientific name, or the common name of the group.
- Search 69 prepared dishes in the same combobox. A search for an ingredient, such as "garlic", also shows the dishes that contain it.
- Pick a dish, then use the ingredient chips to select the ingredient to trace. The main ingredient is the default.
- Read the result as a headline. The rank of the shared taxon decides the wording: siblings, cousins, or distant kin.
- See an animated diagram. Two branches show the foods, and one node marks the meeting point.
- Open any rank in a detail dialog. Read the rank description, the group note, the child groups, and the foods on that branch.
- Swap the two foods, or draw a random pair.
- Share a result. The URL holds both picks, for example `/?a=apple&b=almond`. For a dish, `ad` or `bd` holds the dish, for example `/?a=milk&ad=pesto&b=almond`.

## How the connection is found

`src/lib/tree.ts` holds all the logic.

1. `pathToRoot` walks from a species up to the root taxon.
2. `connect` compares the two paths and returns the first shared taxon. It also returns the two paths below that taxon, and the lineage above it.
3. `describeMeeting` turns the rank of the shared taxon into a headline and a detail line.

The taxonomy is one tree with a single root: `Eukaryota`.

## The dataset

The data is static TypeScript. No API calls happen at runtime, except for photo downloads.

| File | Content |
| --- | --- |
| `src/data/types.ts` | The `Taxon`, `Food`, `Dish`, `Ingredient`, and `Rank` types |
| `src/data/taxa.ts` | 719 taxa, from domain to species |
| `src/data/foods.ts` | 350 foods, each linked to one species |
| `src/data/dishes.ts` | 69 dishes. Each ingredient links to one food, with an optional kitchen name such as "Parmesan" |
| `src/data/photos.ts` | Wikimedia Commons image URLs for 340 foods |
| `src/data/taxonDetails.ts` | One description per rank, plus notes for selected taxa |

Ranks in `taxa.ts`:

| Rank | Count |
| --- | --- |
| Domain | 1 |
| Kingdom | 3 |
| Clade | 8 |
| Phylum | 6 |
| Class | 12 |
| Order | 66 |
| Family | 117 |
| Genus | 225 |
| Species | 281 |

Species count is lower than the food count. Several foods can come from one species. Beef and milk both come from *Bos taurus*. Button, cremini, and portobello mushrooms all come from *Agaricus bisporus*.

## Get started

Requirements: Node.js `^20.19.0` or `>=22.12.0`, and npm.

```bash
npm install
npm run dev
```

Vite reads `HOST` and `PORT` from the environment. The defaults are `127.0.0.1` and `5173`. The port is strict, so the server fails if the port is busy.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check, then write the production bundle to `dist/` |
| `npm run preview` | Serve the built bundle at the Pages sub-path |
| `npm run lint` | Run Oxlint |
| `npm run validate:data` | Check the dataset and the tree logic |

`validate:data` is the test suite for this project. It checks ID uniqueness, tree connectivity, species and genus agreement, photo URLs, dish ingredients, and every one of the 122,500 ordered food pairs. Run it after any change to `src/data/`.

### Photo scripts

`package.json` does not define these scripts. Run them with `node` from the project root.

```bash
node scripts/fetch-photos.mjs              # Query the Wikipedia API, cache results in scripts/photos.json
node scripts/build-photos.mjs              # Write src/data/photos.ts from the cache, then verify each URL
node scripts/build-photos.mjs --skip-verify
node scripts/verify-photos.mjs             # Check each URL in src/data/photos.ts again
```

Both scripts send requests slowly and respect `Retry-After`. Photos come from `upload.wikimedia.org` and `thumb.wikimedia.org` only.

## Deploy

GitHub Pages serves the site. `.github/workflows/deploy.yml` runs the deploy.

A push to `main` starts the workflow. You can also start it by hand from the Actions tab. The build job runs, in order: `npm ci`, `npm run lint`, `npm run validate:data`, and `npm run build`. It then uploads `dist/` as the Pages artifact. The deploy job publishes that artifact.

Set the Pages source to **GitHub Actions** in the repository settings. This repository already uses that source.

### The base path

Pages serves a project site from a sub-path. This project uses `/dinner-family-tree/`.

`vite.config.ts` sets `base` for production builds only. The dev server still serves from `/`. `npm run preview` serves the built bundle from the sub-path, so you can check the deployed layout on your machine.

The app reads `window.location.search` and `window.location.pathname`. It therefore works under any base path, and shared links keep their sub-path.

To build for a different path, set `VITE_BASE`:

```bash
VITE_BASE=/ npm run build              # Serve from a domain root
VITE_BASE=/foods/ npm run build        # Serve from another sub-path
```

## Project layout

```
src/
  App.tsx                     Page state, URL sync, layout
  main.tsx                    React entry point
  index.css                   Design tokens and base styles
  App.css                     Component styles
  lib/tree.ts                 Taxon lookup, paths, connection, copy
  lib/dishes.ts               Dish lookup and the Pick model
  data/                       Static dataset (see above)
  components/
    FoodCombobox.tsx          Accessible food and dish search, ingredient chips
    DishImage.tsx             Photo mosaic of the dish ingredients
    TreeDiagram.tsx           Branches and the SVG fork
    MeetingNode.tsx           The shared taxon card
    TaxonNode.tsx             One rank card, plus the food card
    TaxonExplorer.tsx         The detail dialog
    FoodImage.tsx             Photo with an emoji fallback
scripts/                      Dataset validation and photo pipeline
.github/workflows/deploy.yml  Build and publish to GitHub Pages
vite.config.ts                Dev server, and the Pages base path
```

## Design and accessibility

- Fonts: Fraunces for headings, DM Sans for body text. Both load from Google Fonts.
- Color tokens live in `src/index.css`. Each side of the tree has its own color, and gold marks the meeting point.
- Motion uses `motion/react`. A global `prefers-reduced-motion` rule shortens all CSS animation. The dialog also reads `useReducedMotion` and drops its own animation.
- The dialog is a native `<dialog>` with `showModal`. Focus returns to the element that opened it.
- A screen-reader summary states both full paths in text.
- If a photo fails to load, `FoodImage` shows the food emoji instead.

## Data notes

- The taxonomy is simplified. Plant clades follow APG IV.
- Unranked clades appear in the tree, so plant paths show their real intermediate steps.
- Broad food names use a representative species.
- Animal products follow their source organism. Honey belongs to *Apis mellifera*.
- Counts describe this dataset only. They do not describe all species in nature.

## Tech stack

React 19, TypeScript, Vite 8, Motion 14, Oxlint.

## Credit

- Built with [Agent Duel](https://github.com/bottomless/agent-duel).
- Photographs via Wikimedia Commons.
