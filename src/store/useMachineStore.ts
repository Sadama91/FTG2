import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Machine } from '../types';
import { DEFAULT_MACHINES } from '../data/machines';

interface MachineStore {
  machines: Machine[];
  addMachine: (m: Omit<Machine, 'id'>) => void;
  updateMachine: (id: string, patch: Partial<Machine>) => void;
  removeMachine: (id: string) => void;
  resetToDefaults: () => void;
  importMachines: (list: Machine[]) => void;
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set) => ({
      machines: DEFAULT_MACHINES,
      addMachine: (m) => set((s) => ({ machines: [...s.machines, { ...m, id: uuid() }] })),
      updateMachine: (id, patch) =>
        set((s) => ({ machines: s.machines.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      removeMachine: (id) => set((s) => ({ machines: s.machines.filter((m) => m.id !== id) })),
      resetToDefaults: () => set({ machines: DEFAULT_MACHINES }),
      importMachines: (list) => set({ machines: list }),
    }),
    { name: 'ftg2-machines' },
  ),
);
