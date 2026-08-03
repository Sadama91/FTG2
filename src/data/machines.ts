import type { Machine } from '../types';

/**
 * Buildings & machines. Fields marked "unknown" in comments weren't
 * surfaced by research and are best-effort placeholders — correct them
 * in the Data Editor once you know the real values. A few facts here are
 * confirmed from the wiki: the Sprinkler auto-waters a 3x3 area (halves
 * crop grow time / doubles flower coin yield) and costs Medals, not
 * coins; the Well is unrelated to watering and just produces coins
 * passively; the Silo auto-produces Diamonds + Grains with no input.
 */
export const DEFAULT_MACHINES: Machine[] = [
  {
    id: 'sprinkler',
    name: 'Sprinkler',
    emoji: '💦',
    category: 'utility',
    footprint: { w: 1, h: 1 },
    cost: 2,
    costCurrency: 'medals',
    unlockLevel: 1, // unknown — placeholder
    effect: 'Auto-waters a 3×3 area: -50% grow time for crops/bushes in range, up to 2x coins for flowers in range',
  },
  {
    id: 'well',
    name: 'Well',
    emoji: '⛲',
    category: 'utility',
    footprint: { w: 1, h: 1 },
    cost: 500, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 1, // unknown — placeholder
    effect: 'Passively produces coins every 2 minutes (not water-related)',
  },
  {
    id: 'garage',
    name: 'Garage',
    emoji: '🚜',
    category: 'utility',
    footprint: { w: 2, h: 2 }, // unknown footprint — placeholder
    cost: 1,
    costCurrency: 'ribbons',
    unlockLevel: 2,
    effect: 'Unlocks the Tractor (3×3 action range); auto-mode can plow/plant/water/harvest',
  },
  {
    id: 'silo',
    name: 'Silo',
    emoji: '🛢️',
    category: 'storage',
    footprint: { w: 2, h: 2 }, // unknown footprint — placeholder
    cost: 900, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 1, // unknown — placeholder
    effect: 'Automatically produces Diamonds + Grains every 18 hours, no input needed',
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    emoji: '🏭',
    category: 'storage',
    footprint: { w: 4, h: 3 }, // unknown footprint — placeholder (town building)
    cost: 5,
    costCurrency: 'ribbons',
    unlockLevel: 12,
    effect: 'Increases global storage capacity across resource categories (town building)',
  },
  {
    id: 'cheese-factory',
    name: 'Cheese Factory',
    emoji: '🧀',
    category: 'processing',
    footprint: { w: 3, h: 2 }, // unknown footprint — placeholder
    cost: 3200, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 6, // unknown — placeholder
    effect: 'Converts Milk to Cheese (20 Milk = 1 Cheese); harvest gives 40 Diamonds + 50 XP; 4-slot queue that grows with level',
    inputProduceId: 'cow',
    outputName: 'Cheese',
  },
  {
    id: 'jam-factory',
    name: 'Jam Factory',
    emoji: '🍯',
    category: 'processing',
    footprint: { w: 3, h: 2 }, // unknown footprint — placeholder
    cost: 2800, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 6, // unknown — placeholder
    effect: 'Converts apples/fruit into Jam; queue capacity grows and processing time drops as the building levels up',
    outputName: 'Jam',
  },
  {
    id: 'beehive-processor',
    name: 'Beehive',
    emoji: '🐝',
    category: 'processing',
    footprint: { w: 2, h: 2 },
    cost: 2200, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 6, // unknown — placeholder
    effect: 'Converts flowers into Honey; queue capacity grows with use/level',
    outputName: 'Honey',
  },
  {
    id: 'terraforming-agency',
    name: 'Terraforming Agency',
    emoji: '⛰️',
    category: 'utility',
    footprint: { w: 3, h: 3 }, // unknown footprint — placeholder (town building)
    cost: 50, // unknown — placeholder
    costCurrency: 'diamonds',
    unlockLevel: 30,
    effect: 'Enables terrain tools: ramps, height-hills, height-slopes (each modification costs Diamonds)',
  },
  {
    id: 'underground-mine',
    name: 'Underground Mine',
    emoji: '⛏️',
    category: 'utility',
    footprint: { w: 3, h: 3 }, // unknown footprint — placeholder
    cost: 10000, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 80,
    effect: 'Unlocks mining: collect minerals/gems from veins and mushrooms from grass plots; expandable with more rooms',
  },
  {
    id: 'barn',
    name: 'Barn',
    emoji: '🏚️',
    category: 'decoration',
    footprint: { w: 3, h: 2 },
    cost: 1800, // unknown — placeholder
    costCurrency: 'coins',
    unlockLevel: 5, // unknown — placeholder
    effect: 'Decorative only in FT2 — does not add storage (unlike the original Farm Together)',
  },
];
