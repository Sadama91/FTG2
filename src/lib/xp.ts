/**
 * XP required to go from `level` to `level + 1`.
 * The exact in-game curve isn't public, so this uses an editable
 * base/exponent power curve you can tune in the Leveling page to match
 * what you observe in-game.
 */
export function xpForLevel(level: number, base: number, exponent: number): number {
  return Math.round(base * Math.pow(level, exponent));
}

export function totalXpForLevel(level: number, base: number, exponent: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpForLevel(l, base, exponent);
  return total;
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

/** Given total accumulated XP, derive current level + progress within it. */
export function levelFromTotalXp(totalXp: number, base: number, exponent: number, maxLevel = 200): LevelProgress {
  let level = 1;
  let remaining = totalXp;
  while (level < maxLevel) {
    const need = xpForLevel(level, base, exponent);
    if (remaining < need) break;
    remaining -= need;
    level++;
  }
  const need = xpForLevel(level, base, exponent);
  return { level, xpIntoLevel: remaining, xpForNextLevel: need, progress: Math.min(1, remaining / need) };
}
