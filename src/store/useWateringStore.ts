import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WateringSettings } from '../types';

interface WateringStore extends WateringSettings {
  setWatering: (patch: Partial<WateringSettings>) => void;
}

export const useWateringStore = create<WateringStore>()(
  persist(
    (set) => ({
      enabled: false,
      coverage: 1,
      setWatering: (patch) => set((s) => ({ ...s, ...patch })),
    }),
    { name: 'ftg2-watering' },
  ),
);
