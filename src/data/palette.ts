import type { PaletteItem } from '../types';

export const PALETTE: PaletteItem[] = [
  { kind: 'plot', label: 'Crop Plot', emoji: '🟫', color: '#8b5e34', w: 1, h: 1 },
  { kind: 'flowerbed', label: 'Flower Bed', emoji: '🌷', color: '#d6409f', w: 1, h: 1 },
  { kind: 'path', label: 'Path', emoji: '⬜', color: '#c9b896', w: 1, h: 1 },
  { kind: 'fence', label: 'Fence', emoji: '🚧', color: '#a5772f', w: 1, h: 1 },
  { kind: 'water', label: 'Water', emoji: '💧', color: '#3b82f6', w: 1, h: 1 },
  { kind: 'decoration', label: 'Decoration', emoji: '🌳', color: '#22c55e', w: 1, h: 1 },
  { kind: 'house', label: 'Farmhouse', emoji: '🏠', color: '#ef4444', w: 3, h: 3 },
  { kind: 'barn', label: 'Barn', emoji: '🏚️', color: '#b45309', w: 3, h: 2 },
  { kind: 'silo', label: 'Silo', emoji: '🛢️', color: '#94a3b8', w: 2, h: 2 },
  { kind: 'coop', label: 'Chicken Coop', emoji: '🐔', color: '#facc15', w: 2, h: 2 },
  { kind: 'storage', label: 'Storage', emoji: '📦', color: '#78716c', w: 2, h: 2 },
  { kind: 'pond', label: 'Pond', emoji: '🪷', color: '#0ea5e9', w: 3, h: 3 },
  { kind: 'workshop', label: 'Workshop', emoji: '🔧', color: '#6366f1', w: 2, h: 2 },
  { kind: 'market', label: 'Market Stall', emoji: '🏪', color: '#f97316', w: 2, h: 2 },
];

export const ERASER = 'eraser' as const;
