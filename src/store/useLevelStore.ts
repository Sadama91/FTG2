import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Quest } from '../types';
import { STARTER_QUESTS } from '../data/quests';

interface LevelStore {
  totalXp: number;
  xpBase: number;
  xpExponent: number;
  addXp: (amount: number) => void;
  setTotalXp: (amount: number) => void;
  setCurve: (base: number, exponent: number) => void;

  quests: Quest[];
  addQuest: (q: Omit<Quest, 'id' | 'createdAt' | 'done'>) => void;
  toggleQuest: (id: string) => void;
  removeQuest: (id: string) => void;
  resetQuests: () => void;
}

export const useLevelStore = create<LevelStore>()(
  persist(
    (set) => ({
      totalXp: 0,
      xpBase: 100,
      xpExponent: 1.5,
      addXp: (amount) => set((s) => ({ totalXp: Math.max(0, s.totalXp + amount) })),
      setTotalXp: (amount) => set({ totalXp: Math.max(0, amount) }),
      setCurve: (xpBase, xpExponent) => set({ xpBase, xpExponent }),

      quests: STARTER_QUESTS.map((q) => ({ ...q, id: uuid(), createdAt: Date.now() })),
      addQuest: (q) => set((s) => ({ quests: [...s.quests, { ...q, id: uuid(), done: false, createdAt: Date.now() }] })),
      toggleQuest: (id) =>
        set((s) => ({ quests: s.quests.map((q) => (q.id === id ? { ...q, done: !q.done } : q)) })),
      removeQuest: (id) => set((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),
      resetQuests: () => set({ quests: STARTER_QUESTS.map((q) => ({ ...q, id: uuid(), createdAt: Date.now() })) }),
    }),
    { name: 'ftg2-level' },
  ),
);
