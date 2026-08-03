import type { Quest } from '../types';

/**
 * Example starter quests/milestones. Edit or delete these and add your
 * own from the in-game quest log — the app has no way to read your
 * actual quest state automatically.
 */
export const STARTER_QUESTS: Omit<Quest, 'id' | 'createdAt'>[] = [
  { title: 'Plant your first crop', category: 'main', rewardCoins: 50, rewardXp: 10, done: false },
  { title: 'Build your first fence section', category: 'main', rewardCoins: 30, rewardXp: 8, done: false },
  { title: 'Harvest 10 crops', category: 'milestone', rewardCoins: 100, rewardXp: 20, done: false },
  { title: 'Unlock your first animal', category: 'milestone', rewardCoins: 150, rewardXp: 25, done: false },
  { title: 'Expand your plot for the first time', category: 'main', rewardCoins: 80, rewardXp: 15, done: false },
  { title: 'Complete a daily order', category: 'daily', rewardCoins: 60, rewardXp: 12, done: false },
  { title: 'Plant a full row of the same crop', category: 'custom', rewardCoins: 0, rewardXp: 0, done: false },
];
