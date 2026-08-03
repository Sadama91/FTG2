import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Produce } from '../types';
import { DEFAULT_PRODUCE } from '../data/produce';

interface CropStore {
  produce: Produce[];
  addProduce: (p: Omit<Produce, 'id'>) => void;
  updateProduce: (id: string, patch: Partial<Produce>) => void;
  removeProduce: (id: string) => void;
  resetToDefaults: () => void;
  importProduce: (list: Produce[]) => void;
}

export const useCropStore = create<CropStore>()(
  persist(
    (set) => ({
      produce: DEFAULT_PRODUCE,
      addProduce: (p) => set((s) => ({ produce: [...s.produce, { ...p, id: uuid() }] })),
      updateProduce: (id, patch) =>
        set((s) => ({ produce: s.produce.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removeProduce: (id) => set((s) => ({ produce: s.produce.filter((p) => p.id !== id) })),
      resetToDefaults: () => set({ produce: DEFAULT_PRODUCE }),
      importProduce: (list) => set({ produce: list }),
    }),
    { name: 'ftg2-produce' },
  ),
);
