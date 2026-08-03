import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { DesignLayout, TileKind } from '../types';

function emptyLayout(name: string, width = 24, height = 20): DesignLayout {
  return { id: uuid(), name, width, height, cellGroups: {}, groups: {}, updatedAt: Date.now() };
}

interface DesignStore {
  layouts: DesignLayout[];
  activeLayoutId: string;
  createLayout: (name: string, width?: number, height?: number) => void;
  duplicateLayout: (id: string) => void;
  renameLayout: (id: string, name: string) => void;
  deleteLayout: (id: string) => void;
  setActiveLayout: (id: string) => void;
  resizeActiveLayout: (width: number, height: number) => void;
  clearActiveLayout: () => void;
  /** Paint a stamp of the given kind anchored at (x,y) with size w x h. */
  placeStamp: (x: number, y: number, w: number, h: number, kind: TileKind) => void;
  /** Remove whatever occupies a single cell (whole group if part of a multi-cell stamp). */
  eraseCell: (x: number, y: number) => void;
  importLayout: (layout: DesignLayout) => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => {
      const initial = emptyLayout('My Farm');
      return {
        layouts: [initial],
        activeLayoutId: initial.id,

        createLayout: (name, width = 24, height = 20) =>
          set((s) => {
            const layout = emptyLayout(name, width, height);
            return { layouts: [...s.layouts, layout], activeLayoutId: layout.id };
          }),

        duplicateLayout: (id) =>
          set((s) => {
            const src = s.layouts.find((l) => l.id === id);
            if (!src) return {};
            const copy: DesignLayout = { ...src, id: uuid(), name: `${src.name} (copy)`, updatedAt: Date.now() };
            return { layouts: [...s.layouts, copy], activeLayoutId: copy.id };
          }),

        renameLayout: (id, name) =>
          set((s) => ({ layouts: s.layouts.map((l) => (l.id === id ? { ...l, name } : l)) })),

        deleteLayout: (id) =>
          set((s) => {
            const remaining = s.layouts.filter((l) => l.id !== id);
            const layouts = remaining.length ? remaining : [emptyLayout('My Farm')];
            const activeLayoutId = s.activeLayoutId === id ? layouts[0].id : s.activeLayoutId;
            return { layouts, activeLayoutId };
          }),

        setActiveLayout: (id) => set({ activeLayoutId: id }),

        resizeActiveLayout: (width, height) =>
          set((s) => ({
            layouts: s.layouts.map((l) =>
              l.id === s.activeLayoutId ? { ...l, width, height, updatedAt: Date.now() } : l,
            ),
          })),

        clearActiveLayout: () =>
          set((s) => ({
            layouts: s.layouts.map((l) =>
              l.id === s.activeLayoutId ? { ...l, cellGroups: {}, groups: {}, updatedAt: Date.now() } : l,
            ),
          })),

        placeStamp: (x, y, w, h, kind) =>
          set((s) => {
            const layout = s.layouts.find((l) => l.id === s.activeLayoutId);
            if (!layout) return {};
            if (x + w > layout.width || y + h > layout.height || x < 0 || y < 0) return {};
            const groupId = uuid();
            const cellGroups = { ...layout.cellGroups };
            const groups = { ...layout.groups, [groupId]: kind };
            const toRemove = new Set<string>();
            for (let dx = 0; dx < w; dx++) {
              for (let dy = 0; dy < h; dy++) {
                const key = `${x + dx},${y + dy}`;
                const existing = cellGroups[key];
                if (existing) toRemove.add(existing);
              }
            }
            for (const gid of toRemove) {
              delete groups[gid];
              for (const key of Object.keys(cellGroups)) {
                if (cellGroups[key] === gid) delete cellGroups[key];
              }
            }
            for (let dx = 0; dx < w; dx++) {
              for (let dy = 0; dy < h; dy++) {
                cellGroups[`${x + dx},${y + dy}`] = groupId;
              }
            }
            return {
              layouts: s.layouts.map((l) =>
                l.id === layout.id ? { ...l, cellGroups, groups, updatedAt: Date.now() } : l,
              ),
            };
          }),

        eraseCell: (x, y) =>
          set((s) => {
            const layout = s.layouts.find((l) => l.id === s.activeLayoutId);
            if (!layout) return {};
            const key = `${x},${y}`;
            const groupId = layout.cellGroups[key];
            if (!groupId) return {};
            const cellGroups = { ...layout.cellGroups };
            const groups = { ...layout.groups };
            for (const k of Object.keys(cellGroups)) {
              if (cellGroups[k] === groupId) delete cellGroups[k];
            }
            delete groups[groupId];
            return {
              layouts: s.layouts.map((l) =>
                l.id === layout.id ? { ...l, cellGroups, groups, updatedAt: Date.now() } : l,
              ),
            };
          }),

        importLayout: (layout) =>
          set((s) => {
            const imported = { ...layout, id: uuid() };
            return { layouts: [...s.layouts, imported], activeLayoutId: imported.id };
          }),
      };
    },
    { name: 'ftg2-design' },
  ),
);
