import type { Produce } from '../types';

export interface ProduceMetrics {
  tiles: number;
  cycleMinutes: number;
  coinsPerCycle: number;
  coinsPerHour: number;
  coinsPerHourPerTile: number;
  xpPerHour: number;
  xpPerHourPerTile: number;
  paybackCycles: number;
}

/** Steady-state economics once a plant/animal is already established (post first grow). */
export function computeMetrics(p: Produce): ProduceMetrics {
  const tiles = p.plotSize.w * p.plotSize.h;
  const cycleMinutes = p.regrowTimeMinutes ?? p.growTimeMinutes;
  const cycleHours = cycleMinutes / 60;
  const coinsPerCycle = p.sellPricePerHarvest;
  const coinsPerHour = coinsPerCycle / cycleHours;
  const coinsPerHourPerTile = coinsPerHour / tiles;
  const xpPerHour = p.xpPerHarvest / cycleHours;
  const xpPerHourPerTile = xpPerHour / tiles;
  const paybackCycles = p.seedCost > 0 ? Math.ceil(p.seedCost / coinsPerCycle) : 0;
  return { tiles, cycleMinutes, coinsPerCycle, coinsPerHour, coinsPerHourPerTile, xpPerHour, xpPerHourPerTile, paybackCycles };
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
