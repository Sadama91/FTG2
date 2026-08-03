export type ProduceCategory = 'crop' | 'tree' | 'bush' | 'flower' | 'animal';

export interface Produce {
  id: string;
  name: string;
  category: ProduceCategory;
  emoji: string;
  /** Minutes until the first harvest is ready. Every crop/tree/bush/flower/animal occupies a single 1x1 plot. */
  growTimeMinutes: number;
  /** Minutes between harvests after the first one (trees/animals/bushes). Undefined = one-shot crop that must be replanted. */
  regrowTimeMinutes?: number;
  /** Coins to plant/buy */
  seedCost: number;
  /** Coins earned per harvest at item level 1 */
  sellPricePerHarvest: number;
  /** XP earned per harvest (constant regardless of item level) */
  xpPerHarvest: number;
  /** Player level required to unlock */
  unlockLevel: number;
  /**
   * Per-item leveling: harvesting a produce type repeatedly levels it up
   * (separate from farm/account level) — confirmed mechanic: 1 harvest =
   * 1 XP toward that specific item, banked against per-level thresholds,
   * and only the coin payout increases with level (XP/resources per
   * harvest stay flat). Confirmed max level is 500 (raised from 250 in
   * an earlier patch — may rise again). The exact per-level XP
   * thresholds and coin-growth curve aren't published; harvestsPerLevel
   * and coinGrowthPerLevel below are editable approximations — evidence
   * points to coin growth being roughly *linear* per level rather than
   * compounding, so that's the model used (see coinsAtLevel).
   */
  maxLevel: number;
  /** Harvests needed to advance one item level (assumed uniform per level — real thresholds are unconfirmed) */
  harvestsPerLevel: number;
  /** Fractional coin increase per level, applied linearly: level N = base * (1 + coinGrowthPerLevel * (N-1)) */
  coinGrowthPerLevel: number;
  /**
   * Whether watering affects this produce at all. Per the wiki: trees
   * need no care and are unaffected by watering; crops/bushes/flowers
   * do respond to it (crops/bushes get a grow-time bonus, flowers get a
   * coin bonus instead — see computeMetrics). Animals are assumed
   * unaffected unless you learn otherwise.
   */
  waterable: boolean;
  /** Real-world-style in-game seasons this can be planted in, if season-gated (e.g. ["Sp","Su"]) */
  seasons?: string[];
  /** Extra unlock gate beyond farm level, e.g. "Lettuce 15", "DLC - Gothic Pack", "Event - Spooky Harvest" */
  requirement?: string;
  notes?: string;
}

/** Coins earned per harvest once a produce type has reached `level` (linear growth per level). */
export function coinsAtLevel(p: Pick<Produce, 'sellPricePerHarvest' | 'coinGrowthPerLevel'>, level: number): number {
  return p.sellPricePerHarvest * (1 + p.coinGrowthPerLevel * Math.max(0, level - 1));
}

export type TileKind =
  | 'empty'
  | 'plot'
  | 'path'
  | 'water'
  | 'fence'
  | 'flowerbed'
  | 'decoration'
  | 'house'
  | 'barn'
  | 'silo'
  | 'coop'
  | 'storage'
  | 'pond'
  | 'workshop'
  | 'market'
  | 'machine';

export interface PaletteItem {
  kind: TileKind;
  label: string;
  emoji: string;
  color: string;
  w: number;
  h: number;
  /** Set when this palette entry represents a specific Machine from the Data Editor */
  machineId?: string;
}

export interface PlacedItem {
  kind: TileKind;
  label: string;
  emoji: string;
  color: string;
  machineId?: string;
}

export interface DesignLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  /** key: "x,y" -> groupId */
  cellGroups: Record<string, string>;
  /** groupId -> the specific item (terrain tile or named machine) occupying those cells */
  groups: Record<string, PlacedItem>;
  updatedAt: number;
}

export interface FarmPlanting {
  id: string;
  produceId: string;
  quantity: number;
  plantedAt: number;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: 'main' | 'daily' | 'order' | 'milestone' | 'custom';
  rewardCoins?: number;
  rewardXp?: number;
  done: boolean;
  createdAt: number;
}

export type MachineCategory = 'processing' | 'storage' | 'housing' | 'decoration' | 'utility';

/**
 * Buildings & processing machines — unlike produce these keep a real
 * footprint since they take up meaningful, fixed space on the farm.
 */
export interface Machine {
  id: string;
  name: string;
  emoji: string;
  category: MachineCategory;
  /** Tiles occupied, width x height */
  footprint: { w: number; h: number };
  cost: number;
  /** FT2 has multiple currencies — coins, Medals, Ribbons, Diamonds */
  costCurrency: 'coins' | 'medals' | 'ribbons' | 'diamonds';
  unlockLevel: number;
  /** What it does, e.g. "Converts Wheat into Flour" or "Stores up to 500 items" */
  effect?: string;
  /** If it processes produce: input produce id, output name/value, and processing time */
  inputProduceId?: string;
  outputName?: string;
  outputValue?: number;
  processingTimeMinutes?: number;
}

/**
 * Watering, per the wiki: crops/bushes get up to a -50% grow-time bonus
 * (scaled by how much of the cycle they spent watered); flowers instead
 * get up to a 2x coin bonus at full watering. Trees are unaffected.
 * `coverage` models "how much of the time is this watered" — 1 = a
 * Sprinkler (3x3 auto-water) or constant manual watering, 0 = never.
 */
export interface WateringSettings {
  enabled: boolean;
  /** 0..1 fraction of grow-cycle time spent watered */
  coverage: number;
}

const MAX_CROP_TIME_BONUS = 0.5;
const MAX_FLOWER_COIN_BONUS = 1; // +100% (i.e. 2x) at full coverage

export function wateredCycleMultiplier(p: Pick<Produce, 'category' | 'waterable'>, watering: WateringSettings): number {
  if (!watering.enabled || !p.waterable || p.category === 'flower') return 1;
  return 1 - MAX_CROP_TIME_BONUS * Math.min(1, Math.max(0, watering.coverage));
}

export function wateredCoinMultiplier(p: Pick<Produce, 'category' | 'waterable'>, watering: WateringSettings): number {
  if (!watering.enabled || !p.waterable || p.category !== 'flower') return 1;
  return 1 + MAX_FLOWER_COIN_BONUS * Math.min(1, Math.max(0, watering.coverage));
}
