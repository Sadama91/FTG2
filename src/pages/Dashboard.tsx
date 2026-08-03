import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFarmStore } from '../store/useFarmStore';
import { useCropStore } from '../store/useCropStore';
import { useLevelStore } from '../store/useLevelStore';
import { useProduceLevelStore, levelFromHarvests } from '../store/useProduceLevelStore';
import { useWateringStore } from '../store/useWateringStore';
import { useNow } from '../lib/useNow';
import { computeMetrics, formatCoins } from '../lib/metrics';
import { levelFromTotalXp } from '../lib/xp';
import { Card, PageHeader, StatCard, Badge } from '../components/ui';
import { Coins, Map, Sparkles, Sprout, Target, Trophy, Zap } from 'lucide-react';

export default function Dashboard() {
  const plantings = useFarmStore((s) => s.plantings);
  const produce = useCropStore((s) => s.produce);
  const { totalXp, xpBase, xpExponent, quests } = useLevelStore();
  const harvestCounts = useProduceLevelStore((s) => s.harvestCounts);
  const watering = useWateringStore();
  const now = useNow(5000);

  const progress = levelFromTotalXp(totalXp, xpBase, xpExponent);

  const rows = useMemo(
    () =>
      plantings
        .map((planting) => {
          const p = produce.find((x) => x.id === planting.produceId);
          if (!p) return null;
          const itemLevel = levelFromHarvests(p, harvestCounts[p.id] ?? 0);
          const m = computeMetrics(p, itemLevel, watering);
          const cycleMs = m.cycleMinutes * 60000;
          const remaining = Math.max(0, cycleMs - (now - planting.plantedAt));
          return { planting, produce: p, metrics: m, ready: remaining <= 0 };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [plantings, produce, now, harvestCounts, watering],
  );

  const totals = rows.reduce(
    (acc, r) => {
      acc.coinsPerHour += r.metrics.coinsPerHour * r.planting.quantity;
      acc.xpPerHour += r.metrics.xpPerHour * r.planting.quantity;
      acc.ready += r.ready ? 1 : 0;
      return acc;
    },
    { coinsPerHour: 0, xpPerHour: 0, ready: 0 },
  );

  const pendingQuests = quests.filter((q) => !q.done).slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="Your Farm Together 2 command center." />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Level" value={progress.level} icon={<Trophy size={14} />} sub={`${Math.round(progress.progress * 100)}% to next`} />
        <StatCard label="Coins / hr" value={formatCoins(totals.coinsPerHour)} icon={<Coins size={14} />} />
        <StatCard label="XP / hr" value={formatCoins(totals.xpPerHour)} icon={<Zap size={14} />} />
        <StatCard label="Ready to harvest" value={totals.ready} icon={<Sparkles size={14} />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-100">Currently growing</h2>
            <Link to="/production" className="text-xs text-emerald-400 hover:underline">
              View production →
            </Link>
          </div>
          {rows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-800 py-10 text-center text-sm text-neutral-500">
              Nothing planted yet.{' '}
              <Link to="/planner" className="text-emerald-400 hover:underline">
                Plan your first crop
              </Link>
              .
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {rows.map((r) => (
                <div key={r.planting.id} className="flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm">
                  <span className="text-lg">{r.produce.emoji}</span>
                  {r.produce.name}
                  <span className="text-neutral-500">×{r.planting.quantity}</span>
                  {r.ready && <Badge color="emerald">Ready</Badge>}
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <QuickLink to="/planner" icon={<Sprout size={18} />} label="Crop Planner" />
            <QuickLink to="/design" icon={<Map size={18} />} label="Farm Design" />
            <QuickLink to="/production" icon={<Sparkles size={18} />} label="Production" />
            <QuickLink to="/leveling" icon={<Trophy size={18} />} label="Leveling" />
            <QuickLink to="/goals" icon={<Target size={18} />} label="Goal Planner" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-100">Open quests</h2>
            <Link to="/leveling" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>
          {pendingQuests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-800 py-8 text-center text-sm text-neutral-500">
              All caught up!
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {pendingQuests.map((q) => (
                <li key={q.id} className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2">
                  <span>{q.title}</span>
                  {q.rewardXp ? <span className="text-xs text-sky-400">+{q.rewardXp}xp</span> : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-800/40 px-3 py-4 text-xs font-medium text-neutral-300 transition-colors hover:border-emerald-700 hover:text-emerald-400"
    >
      {icon}
      {label}
    </Link>
  );
}
