import { useMemo, useState } from 'react';
import { useLevelStore } from '../store/useLevelStore';
import { levelFromTotalXp } from '../lib/xp';
import { formatCoins } from '../lib/metrics';
import { Badge, Button, Card, Input, PageHeader, Select, StatCard } from '../components/ui';
import type { Quest } from '../types';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const CATEGORY_COLORS: Record<Quest['category'], string> = {
  main: 'emerald',
  daily: 'sky',
  order: 'amber',
  milestone: 'violet',
  custom: 'neutral',
};

export default function Leveling() {
  const { totalXp, xpBase, xpExponent, addXp, setTotalXp, setCurve, quests, addQuest, toggleQuest, removeQuest, resetQuests } =
    useLevelStore();

  const [xpInput, setXpInput] = useState('');
  const [filter, setFilter] = useState<Quest['category'] | 'all'>('all');
  const [form, setForm] = useState<{ title: string; category: Quest['category']; rewardCoins: string; rewardXp: string }>({
    title: '',
    category: 'custom',
    rewardCoins: '',
    rewardXp: '',
  });

  const progress = levelFromTotalXp(totalXp, xpBase, xpExponent);

  const visibleQuests = useMemo(
    () => (filter === 'all' ? quests : quests.filter((q) => q.category === filter)).sort((a, b) => Number(a.done) - Number(b.done)),
    [quests, filter],
  );

  const completed = quests.filter((q) => q.done);
  const earnedCoins = completed.reduce((s, q) => s + (q.rewardCoins ?? 0), 0);
  const earnedXp = completed.reduce((s, q) => s + (q.rewardXp ?? 0), 0);

  function submitQuest(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addQuest({
      title: form.title.trim(),
      category: form.category,
      rewardCoins: form.rewardCoins ? Number(form.rewardCoins) : undefined,
      rewardXp: form.rewardXp ? Number(form.rewardXp) : undefined,
    });
    setForm({ title: '', category: 'custom', rewardCoins: '', rewardXp: '' });
  }

  return (
    <div>
      <PageHeader title="Leveling & Quests" description="Track your XP progress and keep a checklist of quests and orders." />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Level" value={progress.level} />
        <StatCard
          label="XP to next level"
          value={`${formatCoins(progress.xpIntoLevel)} / ${formatCoins(progress.xpForNextLevel)}`}
        />
        <StatCard label="Quests done" value={`${completed.length} / ${quests.length}`} />
        <StatCard label="Earned from quests" value={`${formatCoins(earnedCoins)} coins`} sub={`${formatCoins(earnedXp)} xp`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <h2 className="mb-3 font-semibold text-neutral-100">XP Tracker</h2>
          <div className="mb-1 flex justify-between text-xs text-neutral-500">
            <span>Level {progress.level}</span>
            <span>Level {progress.level + 1}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress.progress * 100}%` }} />
          </div>
          <div className="mt-1 text-center text-xs text-neutral-500">
            {formatCoins(progress.xpForNextLevel - progress.xpIntoLevel)} XP to go
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              type="number"
              placeholder="XP amount"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (xpInput) addXp(Number(xpInput));
                setXpInput('');
              }}
            >
              Add XP
            </Button>
          </div>

          <div className="mt-4 border-t border-neutral-800 pt-4">
            <label className="mb-1 block text-xs text-neutral-500">Set total XP directly</label>
            <Input
              type="number"
              value={totalXp}
              onChange={(e) => setTotalXp(Number(e.target.value) || 0)}
              className="w-full"
            />
          </div>

          <div className="mt-4 border-t border-neutral-800 pt-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">XP curve (tune to match)</div>
            <p className="mb-2 text-xs text-neutral-600">
              XP for next level ≈ base × level^exponent. The game's real curve isn't public — adjust these two
              numbers until the level shown here matches what you see in-game.
            </p>
            <div className="flex gap-2">
              <label className="flex-1 text-xs text-neutral-500">
                Base
                <Input
                  type="number"
                  value={xpBase}
                  onChange={(e) => setCurve(Number(e.target.value) || 1, xpExponent)}
                  className="mt-1 w-full"
                />
              </label>
              <label className="flex-1 text-xs text-neutral-500">
                Exponent
                <Input
                  type="number"
                  step="0.1"
                  value={xpExponent}
                  onChange={(e) => setCurve(xpBase, Number(e.target.value) || 1)}
                  className="mt-1 w-full"
                />
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-neutral-100">Quests & Orders</h2>
            <div className="flex items-center gap-2">
              <Select value={filter} onChange={(e) => setFilter(e.target.value as Quest['category'] | 'all')}>
                <option value="all">All</option>
                <option value="main">Main</option>
                <option value="daily">Daily</option>
                <option value="order">Order</option>
                <option value="milestone">Milestone</option>
                <option value="custom">Custom</option>
              </Select>
              <Button size="sm" variant="ghost" onClick={resetQuests} title="Reset to starter quest list">
                <RotateCcw size={12} /> Reset
              </Button>
            </div>
          </div>

          <form onSubmit={submitQuest} className="mb-4 flex flex-wrap gap-2 rounded-lg border border-neutral-800 p-3">
            <Input
              placeholder="New quest / order title…"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="min-w-[10rem] flex-1"
            />
            <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Quest['category'] }))}>
              <option value="main">Main</option>
              <option value="daily">Daily</option>
              <option value="order">Order</option>
              <option value="milestone">Milestone</option>
              <option value="custom">Custom</option>
            </Select>
            <Input
              type="number"
              placeholder="Coins"
              value={form.rewardCoins}
              onChange={(e) => setForm((f) => ({ ...f, rewardCoins: e.target.value }))}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="XP"
              value={form.rewardXp}
              onChange={(e) => setForm((f) => ({ ...f, rewardXp: e.target.value }))}
              className="w-20"
            />
            <Button type="submit">
              <Plus size={14} /> Add
            </Button>
          </form>

          <div className="space-y-1.5">
            {visibleQuests.map((q) => (
              <label
                key={q.id}
                className={`flex items-center gap-3 rounded-lg border border-neutral-800 px-3 py-2 text-sm ${
                  q.done ? 'opacity-50' : ''
                }`}
              >
                <input type="checkbox" checked={q.done} onChange={() => toggleQuest(q.id)} className="h-4 w-4 accent-emerald-500" />
                <span className={`flex-1 ${q.done ? 'line-through' : ''}`}>{q.title}</span>
                <Badge color={CATEGORY_COLORS[q.category]}>{q.category}</Badge>
                {q.rewardCoins ? <span className="text-xs text-amber-400">+{q.rewardCoins}c</span> : null}
                {q.rewardXp ? <span className="text-xs text-sky-400">+{q.rewardXp}xp</span> : null}
                <button onClick={() => removeQuest(q.id)} className="text-neutral-600 hover:text-rose-400">
                  <Trash2 size={14} />
                </button>
              </label>
            ))}
            {visibleQuests.length === 0 && (
              <div className="rounded-lg border border-dashed border-neutral-800 py-8 text-center text-sm text-neutral-500">
                No quests in this filter yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
