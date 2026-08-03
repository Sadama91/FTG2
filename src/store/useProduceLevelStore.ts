import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Produce } from '../types';

interface ProduceLevelStore {
  /** produceId -> total lifetime harvests logged for that produce type */
  harvestCounts: Record<string, number>;
  logHarvest: (produceId: string, count?: number) => void;
  setHarvestCount: (produceId: string, count: number) => void;
  resetProduce: (produceId: string) => void;
  resetAll: () => void;
}

export const useProduceLevelStore = create<ProduceLevelStore>()(
  persist(
    (set) => ({
      harvestCounts: {},
      logHarvest: (produceId, count = 1) =>
        set((s) => ({ harvestCounts: { ...s.harvestCounts, [produceId]: (s.harvestCounts[produceId] ?? 0) + count } })),
      setHarvestCount: (produceId, count) =>
        set((s) => ({ harvestCounts: { ...s.harvestCounts, [produceId]: Math.max(0, count) } })),
      resetProduce: (produceId) =>
        set((s) => {
          const next = { ...s.harvestCounts };
          delete next[produceId];
          return { harvestCounts: next };
        }),
      resetAll: () => set({ harvestCounts: {} }),
    }),
    { name: 'ftg2-produce-levels' },
  ),
);

/** Current item level (1..maxLevel) given total harvests logged so far. */
export function levelFromHarvests(p: Pick<Produce, 'harvestsPerLevel' | 'maxLevel'>, harvests: number): number {
  const level = Math.floor(harvests / Math.max(1, p.harvestsPerLevel)) + 1;
  return Math.min(p.maxLevel, level);
}

/** Harvests still needed within the current level before the next level-up. */
export function harvestsIntoLevel(p: Pick<Produce, 'harvestsPerLevel' | 'maxLevel'>, harvests: number): number {
  const level = levelFromHarvests(p, harvests);
  if (level >= p.maxLevel) return 0;
  return harvests % Math.max(1, p.harvestsPerLevel);
}
