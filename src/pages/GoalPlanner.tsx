import { useMemo, useState } from 'react';
import { useCropStore } from '../store/useCropStore';
import { useMachineStore } from '../store/useMachineStore';
import { useLevelStore } from '../store/useLevelStore';
import { useProduceLevelStore, levelFromHarvests } from '../store/useProduceLevelStore';
import { useWateringStore } from '../store/useWateringStore';
import { computeMetrics, formatCoins, formatMinutes } from '../lib/metrics';
import { levelFromTotalXp, totalXpForLevel } from '../lib/xp';
import { coinsAtLevel } from '../types';
import { Badge, Button, Card, Input, PageHeader, Select } from '../components/ui';
import { AlertTriangle, Droplets, Target } from 'lucide-react';

export default function GoalPlanner() {
  const [goalType, setGoalType] = useState<'produce' | 'machine'>('produce');
  return (
    <div>
      <PageHeader
        title="Goal Planner"
        description="Pick a target — a crop/tree/animal level, or a building you want to unlock — and see exactly what it takes to get there."
      />
      <div className="mb-4 flex gap-2">
        <Button variant={goalType === 'produce' ? 'primary' : 'secondary'} size="sm" onClick={() => setGoalType('produce')}>
          Level up a crop / tree / animal
        </Button>
        <Button variant={goalType === 'machine' ? 'primary' : 'secondary'} size="sm" onClick={() => setGoalType('machine')}>
          Unlock a building / machine
        </Button>
      </div>
      {goalType === 'produce' ? <ProduceGoal /> : <MachineGoal />}
    </div>
  );
}

function ProduceGoal() {
  const produce = useCropStore((s) => s.produce);
  const { totalXp, xpBase, xpExponent } = useLevelStore();
  const harvestCounts = useProduceLevelStore((s) => s.harvestCounts);
  const setHarvestCount = useProduceLevelStore((s) => s.setHarvestCount);
  const watering = useWateringStore();
  const setWatering = useWateringStore((s) => s.setWatering);

  const farmLevel = levelFromTotalXp(totalXp, xpBase, xpExponent).level;

  const [search, setSearch] = useState('');
  const [produceId, setProduceId] = useState(produce[0]?.id ?? '');
  const [targetLevel, setTargetLevel] = useState(40);
  const [plots, setPlots] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return produce;
    return produce.filter((p) => p.name.toLowerCase().includes(q));
  }, [produce, search]);

  const selected = produce.find((p) => p.id === produceId) ?? produce[0];

  const plan = useMemo(() => {
    if (!selected) return null;
    const harvests = harvestCounts[selected.id] ?? 0;
    const currentLevel = levelFromHarvests(selected, harvests);
    const clampedTarget = Math.min(selected.maxLevel, Math.max(currentLevel, targetLevel));

    const harvestsForTarget = (clampedTarget - 1) * selected.harvestsPerLevel;
    const harvestsRemaining = Math.max(0, harvestsForTarget - harvests);

    const m = computeMetrics(selected, currentLevel, watering);
    const cycleMinutes = m.cycleMinutes;
    const parallelPlots = Math.max(1, plots);
    const cyclesRemaining = Math.ceil(harvestsRemaining / parallelPlots);
    const totalMinutes = cyclesRemaining * cycleMinutes;

    // Sum coins earned across every remaining harvest as level climbs (harvestsPerLevel is a uniform approximation).
    let coinsEarned = 0;
    let xpEarned = 0;
    let lvl = currentLevel;
    let intoLevel = harvests % Math.max(1, selected.harvestsPerLevel);
    for (let h = 0; h < harvestsRemaining; h++) {
      coinsEarned += coinsAtLevel(selected, lvl) * (watering.enabled && selected.category === 'flower' ? 1 + watering.coverage : 1);
      xpEarned += selected.xpPerHarvest;
      intoLevel++;
      if (intoLevel >= selected.harvestsPerLevel && lvl < clampedTarget) {
        lvl++;
        intoLevel = 0;
      }
    }

    const farmLevelGap = selected.unlockLevel - farmLevel;
    const xpNeededForUnlock = farmLevelGap > 0 ? totalXpForLevel(selected.unlockLevel, xpBase, xpExponent) - totalXp : 0;

    return {
      currentLevel,
      clampedTarget,
      harvests,
      harvestsRemaining,
      cyclesRemaining,
      totalMinutes,
      coinsEarned,
      xpEarned,
      cycleMinutes,
      farmLevelGap,
      xpNeededForUnlock,
    };
  }, [selected, harvestCounts, targetLevel, watering, plots, farmLevel, xpBase, xpExponent, totalXp]);

  if (!selected) return <Card className="p-6 text-sm text-neutral-500">No produce in your data set yet.</Card>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-4 lg:col-span-1">
        <h2 className="mb-3 font-semibold text-neutral-100">Target</h2>

        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2 w-full" />
        <Select
          value={produceId}
          onChange={(e) => setProduceId(e.target.value)}
          className="mb-3 w-full"
          size={Math.min(8, Math.max(4, filtered.length))}
        >
          {filtered.map((p) => (
            <option key={p.id} value={p.id}>
              {p.emoji} {p.name} (unlock lvl {p.unlockLevel})
            </option>
          ))}
        </Select>

        <label className="mb-1 block text-xs text-neutral-500">Target item level (max {selected.maxLevel})</label>
        <Input
          type="number"
          min={1}
          max={selected.maxLevel}
          value={targetLevel}
          onChange={(e) => setTargetLevel(Math.max(1, Math.min(selected.maxLevel, Number(e.target.value) || 1)))}
          className="mb-3 w-full"
        />

        <label className="mb-1 block text-xs text-neutral-500">Harvests logged so far for {selected.name}</label>
        <Input
          type="number"
          min={0}
          value={harvestCounts[selected.id] ?? 0}
          onChange={(e) => setHarvestCount(selected.id, Math.max(0, Number(e.target.value) || 0))}
          className="mb-3 w-full"
        />

        <label className="mb-1 block text-xs text-neutral-500">Plots growing in parallel</label>
        <Input
          type="number"
          min={1}
          value={plots}
          onChange={(e) => setPlots(Math.max(1, Number(e.target.value) || 1))}
          className="mb-3 w-full"
        />

        <div className="mt-4 border-t border-neutral-800 pt-4">
          <label className="flex items-center gap-2 text-sm text-neutral-200">
            <input
              type="checkbox"
              checked={watering.enabled}
              onChange={(e) => setWatering({ enabled: e.target.checked })}
              className="h-4 w-4 accent-sky-500"
            />
            <Droplets size={14} className="text-sky-400" />
            Factor in watering bonus
          </label>
          {watering.enabled && (
            <div className="mt-2">
              <label className="mb-1 block text-xs text-neutral-500">
                Watering coverage: {Math.round(watering.coverage * 100)}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(watering.coverage * 100)}
                onChange={(e) => setWatering({ coverage: Number(e.target.value) / 100 })}
                className="w-full accent-sky-500"
              />
              <p className="mt-1 text-xs text-neutral-600">
                100% ≈ a Sprinkler (3×3 auto-water) or constant manual watering. Crops/bushes: up to -50% grow time.
                Flowers: up to +100% coins. Trees/animals aren't affected.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{selected.emoji}</span>
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold text-neutral-100">
              {selected.name}
              <Badge color="emerald">
                lvl {plan?.currentLevel} → {plan?.clampedTarget}
              </Badge>
            </div>
            <div className="text-xs text-neutral-500">
              {selected.category} · unlocks at farm level {selected.unlockLevel}
            </div>
          </div>
        </div>

        {plan && plan.farmLevelGap > 0 && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-800/50 bg-amber-950/20 px-3 py-2 text-sm text-amber-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              You're farm level {farmLevel}, but {selected.name} unlocks at level {selected.unlockLevel} ({plan.farmLevelGap} to
              go). You need about {formatCoins(plan.xpNeededForUnlock)} more farm XP first — tune the XP curve on the
              Leveling page for accuracy.
            </div>
          </div>
        )}

        {selected.requirement && (
          <div className="mb-4 rounded-lg border border-neutral-800 bg-neutral-800/30 px-3 py-2 text-sm text-neutral-300">
            Also requires: <span className="font-medium">{selected.requirement}</span>
          </div>
        )}

        {plan && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Harvests needed" value={formatCoins(plan.harvestsRemaining)} />
              <Stat label="Cycles (with parallel plots)" value={formatCoins(plan.cyclesRemaining)} />
              <Stat label="Time per harvest" value={formatMinutes(plan.cycleMinutes)} />
              <Stat label="Est. total time" value={formatMinutes(plan.totalMinutes)} highlight />
              <Stat label="Coins earned along the way" value={formatCoins(plan.coinsEarned)} highlight />
              <Stat label="XP earned along the way" value={formatCoins(plan.xpEarned)} />
            </div>

            <p className="mt-5 text-xs text-neutral-600">
              <Target size={12} className="mr-1 inline" />
              Assumes you harvest {plan.currentLevel === plan.clampedTarget ? '—' : 'the moment each cycle is ready'} across{' '}
              {plots} plot{plots === 1 ? '' : 's'} growing in parallel. Level-up thresholds (harvests/level) are a uniform
              approximation — the real per-level milestones aren't published, so correct{' '}
              <code className="rounded bg-neutral-800 px-1">harvestsPerLevel</code> for this item in the Data Editor if you
              know better.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

function MachineGoal() {
  const machines = useMachineStore((s) => s.machines);
  const { totalXp, xpBase, xpExponent } = useLevelStore();
  const farmLevel = levelFromTotalXp(totalXp, xpBase, xpExponent).level;

  const [machineId, setMachineId] = useState(machines[0]?.id ?? '');
  const selected = machines.find((m) => m.id === machineId) ?? machines[0];

  if (!selected) return <Card className="p-6 text-sm text-neutral-500">No buildings/machines in your data set yet.</Card>;

  const gap = selected.unlockLevel - farmLevel;
  const xpNeeded = gap > 0 ? totalXpForLevel(selected.unlockLevel, xpBase, xpExponent) - totalXp : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-4 lg:col-span-1">
        <h2 className="mb-3 font-semibold text-neutral-100">Target</h2>
        <Select value={machineId} onChange={(e) => setMachineId(e.target.value)} className="w-full">
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji} {m.name} (lvl {m.unlockLevel})
            </option>
          ))}
        </Select>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{selected.emoji}</span>
          <div>
            <div className="text-lg font-semibold text-neutral-100">{selected.name}</div>
            <div className="text-xs text-neutral-500">
              {selected.category} · {selected.footprint.w}×{selected.footprint.h} · unlocks at farm level{' '}
              {selected.unlockLevel}
            </div>
          </div>
        </div>

        {gap > 0 ? (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-800/50 bg-amber-950/20 px-3 py-2 text-sm text-amber-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              You're farm level {farmLevel}; this unlocks at {selected.unlockLevel} ({gap} to go, roughly{' '}
              {formatCoins(xpNeeded)} more farm XP — tune the curve on the Leveling page for accuracy).
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-lg border border-emerald-800/50 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-300">
            Already unlocked at your farm level.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Cost" value={`${formatCoins(selected.cost)} ${selected.costCurrency}`} highlight />
          <Stat label="Footprint" value={`${selected.footprint.w}×${selected.footprint.h}`} />
          <Stat label="Category" value={selected.category} />
        </div>
        {selected.effect && <p className="mt-4 text-sm text-neutral-400">{selected.effect}</p>}
      </Card>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-neutral-800 p-3">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`mt-1 text-lg font-bold ${highlight ? 'text-emerald-400' : 'text-neutral-100'}`}>{value}</div>
    </div>
  );
}
