import type { PaletteItem } from '../types';

/**
 * Terrain-style tiles for the Farm Design grid. Named buildings/machines
 * (Sprinkler, Silo, Cheese Factory, etc.) come from the Data Editor's
 * Machines list instead — see FarmDesign.tsx, which merges this static
 * palette with `useMachineStore` so the grid always reflects whatever
 * machines you've defined there.
 */
export const TERRAIN_PALETTE: PaletteItem[] = [
  { kind: 'plot', label: 'Crop Plot', emoji: '🟫', color: '#8b5e34', w: 1, h: 1 },
  { kind: 'flowerbed', label: 'Flower Bed', emoji: '🌷', color: '#d6409f', w: 1, h: 1 },
  { kind: 'path', label: 'Path', emoji: '⬜', color: '#c9b896', w: 1, h: 1 },
  { kind: 'fence', label: 'Fence', emoji: '🚧', color: '#a5772f', w: 1, h: 1 },
  { kind: 'water', label: 'Water', emoji: '💧', color: '#3b82f6', w: 1, h: 1 },
  { kind: 'decoration', label: 'Decoration', emoji: '🌳', color: '#22c55e', w: 1, h: 1 },
  { kind: 'house', label: 'Farmhouse', emoji: '🏠', color: '#ef4444', w: 3, h: 3 },
  { kind: 'pond', label: 'Fish Pond', emoji: '🪷', color: '#0ea5e9', w: 3, h: 3 },
];
