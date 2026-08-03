import { useMemo } from 'react';
import { useFarmStore } from '../store/useFarmStore';
import { useCropStore } from '../store/useCropStore';
import { useLevelStore } from '../store/useLevelStore';
import { useNow } from '../lib/useNow';
import { computeMetrics, formatCoins, formatDuration } from '../lib/metrics';
import { levelFromTotalXp } from '../lib/xp';
import { Badge, Button, Card, Input, PageHeader, StatCard } from '../components/ui';
import { Coins, Minus, Plus, Sparkles, Trash2, Wheat, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Production() {
  const plantings = useFarmStore((s) => s.plantings);
  const removePlanting = useFarmStore((s) => s.removePlanting);
  const setQuantity = useFarmStore((s) => s.setQuantity);
  const restartCycle = useFarmStore((s) => s.restartCycle);
  const produce = useCropStore((s) => s.produce);
  const { totalXp, xpBase, xpExponent } = useLevelStore();
  const now = useNow();

  const level = levelFromTotalXp(totalXp, xpBase, xpExponent).level;

  const rows = useMemo(
    () =>
      plantings
        .map((planting) => {
          const p = produce.find((x) => x.id === planting.produceId);
          if (!p) return null;
          const m = computeMetrics(p);
          const cycleMs = m.cycleMinutes * 60000;
          const elapsed = now - planting.plantedAt;
          const remaining = Math.max(0, cycleMs - elapsed);
          const ready = remaining <= 0;
          const progress = Math.min(1, elapsed / cycleMs);
          return { planting, produce: p, metrics: m, remaining, ready, progress };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [plantings, produce, now],
  );

  const totals = useMemo(() => {
    let tiles = 0;
    let coinsPerHour = 0;
    let xpPerHour = 0;
    let ready = 0;
    for (const r of rows) {
      tiles += r.metrics.tiles * r.planting.quantity;
      coinsPerHour += r.metrics.coinsPerHour * r.planting.quantity;
      xpPerHour += r.metrics.xpPerHour * r.planting.quantity;
      if (r.ready) ready += 1;
    }
    return { tiles, coinsPerHour, xpPerHour, ready };
  }, [rows]);

  const recommendations = useMemo(() => {
    const activeIds = new Set(plantings.map((p) => p.produceId));
    return produce
      .filter((p) => p.unlockLevel <= level)
      .map((p) => ({ produce: p, metrics: computeMetrics(p), active: activeIds.has(p.id) }))
      .sort((a, b) => b.metrics.coinsPerHourPerTile - a.metrics.coinsPerHourPerTile)
      .slice(0, 5);
  }, [produce, plantings, level]);

  return (
    <div>
      <PageHeader
        title="Production Overview"
        description="Track what's growing, catch harvests the moment they're ready, and see what to focus on next."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tiles in use" value={totals.tiles} icon={<Wheat size={14} />} />
        <StatCard
          label="Coins / hr"
          value={formatCoins(totals.coinsPerHour)}
          icon={<Coins size={14} />}
          sub="at current plantings"
        />
        <StatCard label="XP / hr" value={formatCoins(totals.xpPerHour)} icon={<Zap size={14} />} sub="at current plantings" />
        <StatCard
          label="Ready to harvest"
          value={totals.ready}
          icon={<Sparkles size={14} />}
          sub={totals.ready > 0 ? 'go collect!' : 'all caught up'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-100">My Farm</h2>
              <Link to="/planner" className="text-xs text-emerald-400 hover:underline">
                + Plan more crops
              </Link>
            </div>

            {rows.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-800 py-10 text-center text-sm text-neutral-500">
                Nothing planted yet. Head to the Crop Planner and hit "Plant" to start tracking.
              </div>
            ) : (
              <div className="space-y-2">
                {rows.map((r) => (
                  <div key={r.planting.id} className="rounded-lg border border-neutral-800 p-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-2xl">{r.produce.emoji}</span>
                      <div className="min-w-[8rem] flex-1">
                        <div className="flex items-center gap-2 font-medium text-neutral-100">
                          {r.produce.name}
                          {r.ready && <Badge color="emerald">Ready!</Badge>}
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                          <div
                            className={`h-full rounded-full ${r.ready ? 'bg-emerald-500' : 'bg-sky-500'}`}
                            style={{ width: `${r.progress * 100}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">
                          {r.ready ? 'Ready to harvest' : `Ready in ${formatDuration(r.remaining)}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setQuantity(r.planting.id, Math.max(1, r.planting.quantity - 1))}
                        >
                          <Minus size={12} />
                        </Button>
                        <Input
                          type="number"
                          value={r.planting.quantity}
                          onChange={(e) => setQuantity(r.planting.id, Math.max(1, Number(e.target.value) || 1))}
                          className="w-14 px-2 text-center"
                        />
                        <Button size="sm" variant="ghost" onClick={() => setQuantity(r.planting.id, r.planting.quantity + 1)}>
                          <Plus size={12} />
                        </Button>
                      </div>

                      <Button size="sm" variant={r.ready ? 'primary' : 'secondary'} disabled={!r.ready} onClick={() => restartCycle(r.planting.id)}>
                        Harvest
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => removePlanting(r.planting.id)}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-4">
          <h2 className="mb-3 font-semibold text-neutral-100">Focus on next</h2>
          <p className="mb-3 text-xs text-neutral-500">Top earners unlocked at your current level ({level}).</p>
          <div className="space-y-2">
            {recommendations.map((r) => (
              <div key={r.produce.id} className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.produce.emoji}</span>
                  <span className="font-medium text-neutral-200">{r.produce.name}</span>
                  {r.active && <Badge color="sky">planted</Badge>}
                </div>
                <span className="text-emerald-400">{formatCoins(r.metrics.coinsPerHourPerTile)}/hr·tile</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-600">
            Level is estimated from the XP curve set on the Leveling page — tune it there for accuracy.
          </p>
        </Card>
      </div>
    </div>
  );
}
