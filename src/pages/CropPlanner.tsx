import { useMemo, useState } from 'react';
import { useCropStore } from '../store/useCropStore';
import { useFarmStore } from '../store/useFarmStore';
import { computeMetrics, formatCoins, formatMinutes } from '../lib/metrics';
import { Badge, Button, Card, Input, PageHeader, Select } from '../components/ui';
import type { ProduceCategory } from '../types';
import { ArrowUpDown, Plus } from 'lucide-react';

type SortKey = 'coinsPerHourPerTile' | 'coinsPerHour' | 'xpPerHourPerTile' | 'xpPerHour' | 'paybackCycles' | 'unlockLevel';

const CATEGORY_COLORS: Record<ProduceCategory, string> = {
  crop: 'emerald',
  tree: 'amber',
  bush: 'violet',
  flower: 'rose',
  animal: 'sky',
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'coinsPerHourPerTile', label: 'Coins / hr / tile' },
  { key: 'coinsPerHour', label: 'Coins / hr' },
  { key: 'xpPerHourPerTile', label: 'XP / hr / tile' },
  { key: 'xpPerHour', label: 'XP / hr' },
  { key: 'paybackCycles', label: 'Payback (cycles)' },
  { key: 'unlockLevel', label: 'Unlock level' },
];

export default function CropPlanner() {
  const produce = useCropStore((s) => s.produce);
  const plant = useFarmStore((s) => s.plant);

  const [category, setCategory] = useState<ProduceCategory | 'all'>('all');
  const [maxLevel, setMaxLevel] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('coinsPerHourPerTile');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo(() => {
    let list = produce.map((p) => ({ produce: p, metrics: computeMetrics(p) }));
    if (category !== 'all') list = list.filter((r) => r.produce.category === category);
    if (maxLevel !== '') list = list.filter((r) => r.produce.unlockLevel <= maxLevel);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.produce.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const av = sortKey === 'unlockLevel' ? a.produce.unlockLevel : a.metrics[sortKey as keyof typeof a.metrics];
      const bv = sortKey === 'unlockLevel' ? b.produce.unlockLevel : b.metrics[sortKey as keyof typeof b.metrics];
      return sortDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number);
    });
    return list;
  }, [produce, category, maxLevel, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const best = rows[0];

  return (
    <div>
      <PageHeader
        title="Crop Planner"
        description="Compare every crop, tree, bush, flower and animal by profitability so you know what to plant next."
      />

      {best && (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 border-emerald-800/50 bg-emerald-950/20 p-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-500">Best pick right now</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <span className="text-2xl">{best.produce.emoji}</span>
              {best.produce.name}
              <Badge color={CATEGORY_COLORS[best.produce.category]}>{best.produce.category}</Badge>
            </div>
            <div className="mt-1 text-sm text-neutral-400">
              {formatCoins(best.metrics.coinsPerHourPerTile)} coins/hr per tile · {formatCoins(best.metrics.xpPerHourPerTile)} xp/hr per tile
            </div>
          </div>
          <Button onClick={() => plant(best.produce.id, 1)}>
            <Plus size={14} /> Add to my farm
          </Button>
        </Card>
      )}

      <Card className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <Input placeholder="Search crops…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
        <Select value={category} onChange={(e) => setCategory(e.target.value as ProduceCategory | 'all')}>
          <option value="all">All categories</option>
          <option value="crop">Crops</option>
          <option value="tree">Trees</option>
          <option value="bush">Bushes</option>
          <option value="flower">Flowers</option>
          <option value="animal">Animals</option>
        </Select>
        <Input
          type="number"
          placeholder="Max unlock level"
          value={maxLevel}
          onChange={(e) => setMaxLevel(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-40"
        />
        <div className="ml-auto text-xs text-neutral-500">{rows.length} items</div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Produce</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Cycle</th>
              {SORT_OPTIONS.map(({ key, label }) => (
                <th key={key} className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort(key)}>
                  <span className={`inline-flex items-center gap-1 ${sortKey === key ? 'text-emerald-400' : ''}`}>
                    {label}
                    <ArrowUpDown size={12} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ produce: p, metrics: m }) => (
              <tr key={p.id} className="border-b border-neutral-800/60 last:border-0 hover:bg-neutral-800/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-neutral-100">
                    <span className="text-lg">{p.emoji}</span>
                    {p.name}
                    <Badge color={CATEGORY_COLORS[p.category]}>{p.category}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {p.plotSize.w}×{p.plotSize.h}
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {formatMinutes(m.cycleMinutes)}
                  {p.regrowTimeMinutes && <span className="ml-1 text-xs text-neutral-600">(regrow)</span>}
                </td>
                <td className="px-4 py-3 font-medium text-emerald-400">{formatCoins(m.coinsPerHourPerTile)}</td>
                <td className="px-4 py-3">{formatCoins(m.coinsPerHour)}</td>
                <td className="px-4 py-3 font-medium text-sky-400">{formatCoins(m.xpPerHourPerTile)}</td>
                <td className="px-4 py-3">{formatCoins(m.xpPerHour)}</td>
                <td className="px-4 py-3">{m.paybackCycles || '—'}</td>
                <td className="px-4 py-3 text-neutral-400">Lv {p.unlockLevel}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="secondary" onClick={() => plant(p.id, 1)}>
                    <Plus size={12} /> Plant
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-xs text-neutral-600">
        Coin/XP values are editable starter estimates — open the Data Editor to correct anything against what you see
        in-game.
      </p>
    </div>
  );
}
