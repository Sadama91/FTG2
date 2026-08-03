import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { FarmPlanting } from '../types';

interface FarmStore {
  plantings: FarmPlanting[];
  plant: (produceId: string, quantity: number) => void;
  removePlanting: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  restartCycle: (id: string) => void;
  clearAll: () => void;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set) => ({
      plantings: [],
      plant: (produceId, quantity) =>
        set((s) => ({
          plantings: [...s.plantings, { id: uuid(), produceId, quantity, plantedAt: Date.now() }],
        })),
      removePlanting: (id) => set((s) => ({ plantings: s.plantings.filter((p) => p.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({ plantings: s.plantings.map((p) => (p.id === id ? { ...p, quantity } : p)) })),
      restartCycle: (id) =>
        set((s) => ({ plantings: s.plantings.map((p) => (p.id === id ? { ...p, plantedAt: Date.now() } : p)) })),
      clearAll: () => set({ plantings: [] }),
    }),
    { name: 'ftg2-farm' },
  ),
);
