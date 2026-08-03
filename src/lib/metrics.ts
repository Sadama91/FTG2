import type { Produce, WateringSettings } from '../types';
import { coinsAtLevel, wateredCoinMultiplier, wateredCycleMultiplier } from '../types';

export interface ProduceMetrics {
  cycleMinutes: number;
  coinsPerHarvest: number;
  coinsPerHour: number;
  xpPerHour: number;
  paybackHarvests: number;
}

const NO_WATERING: WateringSettings = { enabled: false, coverage: 0 };

/**
 * Steady-state economics once a plant/animal is already established.
 * `level` is the produce type's own item level (1..maxLevel), which
 * scales the coin payout. `watering` optionally applies the watering
 * bonus: crops/bushes get a shorter cycle, flowers get more coins.
 */
export function computeMetrics(p: Produce, level = 1, watering: WateringSettings = NO_WATERING): ProduceMetrics {
  const baseCycleMinutes = p.regrowTimeMinutes ?? p.growTimeMinutes;
  const cycleMinutes = baseCycleMinutes * wateredCycleMultiplier(p, watering);
  const cycleHours = Math.max(cycleMinutes, 0.0001) / 60;

  const coinsPerHarvest = coinsAtLevel(p, level) * wateredCoinMultiplier(p, watering);

  const coinsPerHour = coinsPerHarvest / cycleHours;
  const xpPerHour = p.xpPerHarvest / cycleHours;
  const paybackHarvests = p.seedCost > 0 ? Math.ceil(p.seedCost / coinsPerHarvest) : 0;
  return { cycleMinutes, coinsPerHarvest, coinsPerHour, xpPerHour, paybackHarvests };
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h < 24) return m ? `${h}h ${m}m` : `${h}h`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh ? `${d}d ${rh}h` : `${d}d`;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return 'Ready';
  return formatMinutes(ms / 60000);
}

export function formatCoins(n: number): string {
  return Math.round(n).toLocaleString();
}
