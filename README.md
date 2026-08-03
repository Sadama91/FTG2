# Farmhand — Farm Together 2 Companion

An unofficial, fan-made web app to help plan and optimize your farm in
**Farm Together 2**. Everything runs client-side and saves to your
browser's local storage — no account or server required.

## Features

- **Crop Planner** — every crop, tree, bush, flower and animal compared by
  coins/hr and XP/hr (per tile and total), sortable and filterable by
  category or unlock level, with a "best pick right now" callout.
- **Farm Design** — a grid-based layout tool (inspired by community map
  planners) for sketching your plot: paint crop plots, paths, water and
  fences, stamp down buildings (farmhouse, barn, silo, coop, etc.), resize
  the grid, keep multiple named layouts, and export/import them as JSON.
- **Production Overview** — tracks everything you've "planted" in the app
  with live countdowns to harvest, ready-to-collect alerts, and
  projected coins/hr and XP/hr for your current setup.
- **Leveling & Quests** — an XP/level tracker with a tunable level curve,
  plus a quest/order checklist with rewards so you can see what's left to
  do and what you've earned.
- **Data Editor** — all crop/animal stats (grow time, price, XP, unlock
  level, plot size) are editable in-app and exported/imported as JSON,
  since Farm Together 2 rebalances these values over time and the exact
  current numbers aren't published anywhere authoritative.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
`dist/` bundle that can be hosted anywhere (Netlify, GitHub Pages, etc.) —
the app uses hash-based routing so it works from any subpath with no
server configuration.

## Notes on data accuracy

The starter crop/animal dataset (prices, grow times, XP, unlock levels)
and the XP-per-level curve are reasonable placeholders, not verified
in-game values — the game changes these in updates. Use the **Data
Editor** and the curve tuner on the **Leveling** page to correct them
against what you observe in-game; everything else in the app (planner
rankings, dashboard, recommendations) recalculates from those values
automatically.

## Tech stack

React + TypeScript + Vite, Tailwind CSS v4, Zustand (with localStorage
persistence), React Router.
