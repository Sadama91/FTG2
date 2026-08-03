import type { Produce } from '../types';

/**
 * Starter dataset. Farm Together 2 balances prices, grow times and XP in
 * live patches, so treat these numbers as reasonable placeholders, not
 * ground truth. Use the Data Editor to correct any value against what you
 * see in-game — your edits are saved automatically and used everywhere
 * else in the app (planner, dashboard, recommendations).
 */
export const DEFAULT_PRODUCE: Produce[] = [
  // Crops (one-shot, replant each cycle)
  { id: 'wheat', name: 'Wheat', category: 'crop', emoji: '🌾', plotSize: { w: 1, h: 1 }, growTimeMinutes: 10, seedCost: 10, sellPricePerHarvest: 22, xpPerHarvest: 4, unlockLevel: 1 },
  { id: 'carrot', name: 'Carrot', category: 'crop', emoji: '🥕', plotSize: { w: 1, h: 1 }, growTimeMinutes: 20, seedCost: 18, sellPricePerHarvest: 42, xpPerHarvest: 6, unlockLevel: 1 },
  { id: 'potato', name: 'Potato', category: 'crop', emoji: '🥔', plotSize: { w: 1, h: 1 }, growTimeMinutes: 35, seedCost: 28, sellPricePerHarvest: 68, xpPerHarvest: 9, unlockLevel: 2 },
  { id: 'corn', name: 'Corn', category: 'crop', emoji: '🌽', plotSize: { w: 1, h: 1 }, growTimeMinutes: 60, seedCost: 45, sellPricePerHarvest: 120, xpPerHarvest: 14, unlockLevel: 3 },
  { id: 'tomato', name: 'Tomato', category: 'crop', emoji: '🍅', plotSize: { w: 1, h: 1 }, growTimeMinutes: 90, seedCost: 60, sellPricePerHarvest: 165, xpPerHarvest: 18, unlockLevel: 4 },
  { id: 'onion', name: 'Onion', category: 'crop', emoji: '🧅', plotSize: { w: 1, h: 1 }, growTimeMinutes: 120, seedCost: 80, sellPricePerHarvest: 220, xpPerHarvest: 22, unlockLevel: 5 },
  { id: 'pumpkin', name: 'Pumpkin', category: 'crop', emoji: '🎃', plotSize: { w: 2, h: 2 }, growTimeMinutes: 240, seedCost: 150, sellPricePerHarvest: 520, xpPerHarvest: 40, unlockLevel: 7 },
  { id: 'sugarcane', name: 'Sugarcane', category: 'crop', emoji: '🎋', plotSize: { w: 1, h: 1 }, growTimeMinutes: 180, seedCost: 110, sellPricePerHarvest: 300, xpPerHarvest: 28, unlockLevel: 6 },
  { id: 'rice', name: 'Rice', category: 'crop', emoji: '🌾', plotSize: { w: 1, h: 1 }, growTimeMinutes: 300, seedCost: 140, sellPricePerHarvest: 410, xpPerHarvest: 35, unlockLevel: 8 },
  { id: 'grape', name: 'Grapes', category: 'crop', emoji: '🍇', plotSize: { w: 1, h: 1 }, growTimeMinutes: 480, seedCost: 220, sellPricePerHarvest: 640, xpPerHarvest: 50, unlockLevel: 10 },

  // Trees (plant once, harvest repeatedly)
  { id: 'apple-tree', name: 'Apple Tree', category: 'tree', emoji: '🍎', plotSize: { w: 2, h: 2 }, growTimeMinutes: 180, regrowTimeMinutes: 90, seedCost: 200, sellPricePerHarvest: 95, xpPerHarvest: 10, unlockLevel: 4 },
  { id: 'orange-tree', name: 'Orange Tree', category: 'tree', emoji: '🍊', plotSize: { w: 2, h: 2 }, growTimeMinutes: 240, regrowTimeMinutes: 120, seedCost: 260, sellPricePerHarvest: 130, xpPerHarvest: 13, unlockLevel: 6 },
  { id: 'cherry-tree', name: 'Cherry Tree', category: 'tree', emoji: '🍒', plotSize: { w: 2, h: 2 }, growTimeMinutes: 300, regrowTimeMinutes: 150, seedCost: 340, sellPricePerHarvest: 175, xpPerHarvest: 17, unlockLevel: 8 },
  { id: 'coconut-tree', name: 'Coconut Palm', category: 'tree', emoji: '🥥', plotSize: { w: 2, h: 3 }, growTimeMinutes: 420, regrowTimeMinutes: 210, seedCost: 480, sellPricePerHarvest: 260, xpPerHarvest: 24, unlockLevel: 11 },
  { id: 'olive-tree', name: 'Olive Tree', category: 'tree', emoji: '🫒', plotSize: { w: 2, h: 2 }, growTimeMinutes: 360, regrowTimeMinutes: 180, seedCost: 400, sellPricePerHarvest: 220, xpPerHarvest: 21, unlockLevel: 9 },

  // Bushes
  { id: 'blueberry-bush', name: 'Blueberry Bush', category: 'bush', emoji: '🫐', plotSize: { w: 1, h: 1 }, growTimeMinutes: 90, regrowTimeMinutes: 45, seedCost: 90, sellPricePerHarvest: 48, xpPerHarvest: 6, unlockLevel: 5 },
  { id: 'raspberry-bush', name: 'Raspberry Bush', category: 'bush', emoji: '🍓', plotSize: { w: 1, h: 1 }, growTimeMinutes: 75, regrowTimeMinutes: 40, seedCost: 75, sellPricePerHarvest: 40, xpPerHarvest: 5, unlockLevel: 4 },

  // Flowers (mostly decorative + XP/coin trickle)
  { id: 'tulip', name: 'Tulip', category: 'flower', emoji: '🌷', plotSize: { w: 1, h: 1 }, growTimeMinutes: 15, seedCost: 12, sellPricePerHarvest: 26, xpPerHarvest: 5, unlockLevel: 1 },
  { id: 'sunflower', name: 'Sunflower', category: 'flower', emoji: '🌻', plotSize: { w: 1, h: 1 }, growTimeMinutes: 45, seedCost: 32, sellPricePerHarvest: 78, xpPerHarvest: 11, unlockLevel: 3 },
  { id: 'rose', name: 'Rose', category: 'flower', emoji: '🌹', plotSize: { w: 1, h: 1 }, growTimeMinutes: 60, seedCost: 40, sellPricePerHarvest: 100, xpPerHarvest: 13, unlockLevel: 4 },
  { id: 'lavender', name: 'Lavender', category: 'flower', emoji: '💜', plotSize: { w: 1, h: 1 }, growTimeMinutes: 150, seedCost: 95, sellPricePerHarvest: 260, xpPerHarvest: 26, unlockLevel: 7 },

  // Animals (buy once, produce repeatedly)
  { id: 'chicken', name: 'Chicken', category: 'animal', emoji: '🐔', plotSize: { w: 1, h: 1 }, growTimeMinutes: 30, regrowTimeMinutes: 30, seedCost: 150, sellPricePerHarvest: 35, xpPerHarvest: 5, unlockLevel: 2 },
  { id: 'cow', name: 'Cow', category: 'animal', emoji: '🐄', plotSize: { w: 2, h: 2 }, growTimeMinutes: 120, regrowTimeMinutes: 120, seedCost: 600, sellPricePerHarvest: 210, xpPerHarvest: 18, unlockLevel: 6 },
  { id: 'sheep', name: 'Sheep', category: 'animal', emoji: '🐑', plotSize: { w: 2, h: 2 }, growTimeMinutes: 100, regrowTimeMinutes: 100, seedCost: 450, sellPricePerHarvest: 160, xpPerHarvest: 15, unlockLevel: 5 },
  { id: 'pig', name: 'Pig', category: 'animal', emoji: '🐖', plotSize: { w: 2, h: 2 }, growTimeMinutes: 90, regrowTimeMinutes: 90, seedCost: 380, sellPricePerHarvest: 140, xpPerHarvest: 13, unlockLevel: 5 },
  { id: 'goat', name: 'Goat', category: 'animal', emoji: '🐐', plotSize: { w: 1, h: 1 }, growTimeMinutes: 80, regrowTimeMinutes: 80, seedCost: 300, sellPricePerHarvest: 110, xpPerHarvest: 11, unlockLevel: 4 },
  { id: 'duck', name: 'Duck', category: 'animal', emoji: '🦆', plotSize: { w: 1, h: 1 }, growTimeMinutes: 40, regrowTimeMinutes: 40, seedCost: 180, sellPricePerHarvest: 55, xpPerHarvest: 7, unlockLevel: 3 },
  { id: 'llama', name: 'Llama', category: 'animal', emoji: '🦙', plotSize: { w: 2, h: 2 }, growTimeMinutes: 180, regrowTimeMinutes: 180, seedCost: 900, sellPricePerHarvest: 340, xpPerHarvest: 30, unlockLevel: 9 },
  { id: 'bee-hive', name: 'Bee Hive', category: 'animal', emoji: '🐝', plotSize: { w: 1, h: 1 }, growTimeMinutes: 60, regrowTimeMinutes: 60, seedCost: 260, sellPricePerHarvest: 95, xpPerHarvest: 10, unlockLevel: 6 },
];
