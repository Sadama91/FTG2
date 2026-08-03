export type ProduceCategory = 'crop' | 'tree' | 'bush' | 'flower' | 'animal';

export interface Produce {
  id: string;
  name: string;
  category: ProduceCategory;
  emoji: string;
  /** Tiles occupied, width x height */
  plotSize: { w: number; h: number };
  /** Minutes until the first harvest is ready */
  growTimeMinutes: number;
  /** Minutes between harvests after the first one (trees/animals/bushes). Undefined = one-shot crop that must be replanted. */
  regrowTimeMinutes?: number;
  /** Coins to plant/buy */
  seedCost: number;
  /** Coins earned per harvest */
  sellPricePerHarvest: number;
  /** XP earned per harvest */
  xpPerHarvest: number;
  /** Player level required to unlock */
  unlockLevel: number;
  notes?: string;
}

export type TileKind =
  | 'empty'
  | 'plot'
  | 'path'
  | 'water'
  | 'fence'
  | 'flowerbed'
  | 'decoration'
  | 'house'
  | 'barn'
  | 'silo'
  | 'coop'
  | 'storage'
  | 'pond'
  | 'workshop'
  | 'market';

export interface PaletteItem {
  kind: TileKind;
  label: string;
  emoji: string;
  color: string;
  w: number;
  h: number;
}

export interface DesignLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  /** key: "x,y" -> groupId */
  cellGroups: Record<string, string>;
  /** groupId -> tile kind for the stamp occupying those cells */
  groups: Record<string, TileKind>;
  updatedAt: number;
}

export interface FarmPlanting {
  id: string;
  produceId: string;
  quantity: number;
  plantedAt: number;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: 'main' | 'daily' | 'order' | 'milestone' | 'custom';
  rewardCoins?: number;
  rewardXp?: number;
  done: boolean;
  createdAt: number;
}
