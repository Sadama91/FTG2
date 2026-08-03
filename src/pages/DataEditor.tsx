import { useRef, useState } from 'react';
import { useCropStore } from '../store/useCropStore';
import { useMachineStore } from '../store/useMachineStore';
import type { Machine, MachineCategory, Produce, ProduceCategory } from '../types';
import { Button, Card, Input, PageHeader, Select } from '../components/ui';
import { Download, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';

const CATEGORIES: ProduceCategory[] = ['crop', 'tree', 'bush', 'flower', 'animal'];
const MACHINE_CATEGORIES: MachineCategory[] = ['processing', 'storage', 'housing', 'decoration', 'utility'];
const CURRENCIES: Machine['costCurrency'][] = ['coins', 'medals', 'ribbons', 'diamonds'];

const BLANK_PRODUCE: Omit<Produce, 'id'> = {
  name: '',
  category: 'crop',
  emoji: '🌱',
  growTimeMinutes: 10,
  regrowTimeMinutes: undefined,
  seedCost: 0,
  sellPricePerHarvest: 0,
  xpPerHarvest: 0,
  unlockLevel: 1,
  maxLevel: 10,
  harvestsPerLevel: 15,
  coinGrowthPerLevel: 0.08,
  waterable: true,
};

const BLANK_MACHINE: Omit<Machine, 'id'> = {
  name: '',
  emoji: '🏗️',
  category: 'processing',
  footprint: { w: 2, h: 2 },
  cost: 0,
  costCurrency: 'coins',
  unlockLevel: 1,
  effect: '',
};

export default function DataEditor() {
  const [tab, setTab] = useState<'produce' | 'machines'>('produce');
  return (
    <div>
      <PageHeader
        title="Data Editor"
        description="Farm Together 2 rebalances prices, timers and XP over time — correct any value here and it flows through the whole app."
      />
      <div className="mb-4 flex gap-2">
        <Button variant={tab === 'produce' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('produce')}>
          Crops / Trees / Animals
        </Button>
        <Button variant={tab === 'machines' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('machines')}>
          Buildings / Machines
        </Button>
      </div>
      {tab === 'produce' ? <ProduceEditor /> : <MachineEditor />}
    </div>
  );
}

function ProduceEditor() {
  const produce = useCropStore((s) => s.produce);
  const addProduce = useCropStore((s) => s.addProduce);
  const updateProduce = useCropStore((s) => s.updateProduce);
  const removeProduce = useCropStore((s) => s.removeProduce);
  const resetToDefaults = useCropStore((s) => s.resetToDefaults);
  const importProduce = useCropStore((s) => s.importProduce);

  const [draft, setDraft] = useState(BLANK_PRODUCE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function field<K extends keyof Produce>(id: string, key: K, value: Produce[K]) {
    updateProduce(id, { [key]: value } as Partial<Produce>);
  }

  function submitNew(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    addProduce(draft);
    setDraft(BLANK_PRODUCE);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(produce, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ftg2-produce-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) importProduce(parsed);
      } catch {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div>
      <Card className="mb-4 flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant="secondary" onClick={exportJson}>
          <Download size={12} /> Export JSON
        </Button>
        <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={12} /> Import JSON
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={importJson} />
        <Button size="sm" variant="danger" onClick={resetToDefaults}>
          <RotateCcw size={12} /> Reset to defaults
        </Button>
        <span className="ml-auto text-xs text-neutral-500">{produce.length} items</span>
      </Card>

      <Card className="mb-4 overflow-x-auto">
        <table className="w-full min-w-[1400px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-3 py-2">Emoji</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Grow (min)</th>
              <th className="px-3 py-2">Regrow (min)</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Sell price (lvl 1)</th>
              <th className="px-3 py-2">XP</th>
              <th className="px-3 py-2">Unlock lvl</th>
              <th className="px-3 py-2">Max item lvl</th>
              <th className="px-3 py-2">Harvests/lvl</th>
              <th className="px-3 py-2">Coin growth/lvl</th>
              <th className="px-3 py-2">Waterable</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {produce.map((p) => (
              <tr key={p.id} className="border-b border-neutral-800/60 last:border-0">
                <td className="px-3 py-1.5">
                  <Input value={p.emoji} onChange={(e) => field(p.id, 'emoji', e.target.value)} className="w-14 text-center" />
                </td>
                <td className="px-3 py-1.5">
                  <Input value={p.name} onChange={(e) => field(p.id, 'name', e.target.value)} className="w-36" />
                </td>
                <td className="px-3 py-1.5">
                  <Select value={p.category} onChange={(e) => field(p.id, 'category', e.target.value as ProduceCategory)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.growTimeMinutes}
                    onChange={(e) => field(p.id, 'growTimeMinutes', Number(e.target.value) || 0)}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.regrowTimeMinutes ?? ''}
                    placeholder="—"
                    onChange={(e) => field(p.id, 'regrowTimeMinutes', e.target.value === '' ? undefined : Number(e.target.value))}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.seedCost}
                    onChange={(e) => field(p.id, 'seedCost', Number(e.target.value) || 0)}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.sellPricePerHarvest}
                    onChange={(e) => field(p.id, 'sellPricePerHarvest', Number(e.target.value) || 0)}
                    className="w-24"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.xpPerHarvest}
                    onChange={(e) => field(p.id, 'xpPerHarvest', Number(e.target.value) || 0)}
                    className="w-16"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.unlockLevel}
                    onChange={(e) => field(p.id, 'unlockLevel', Number(e.target.value) || 1)}
                    className="w-16"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.maxLevel}
                    onChange={(e) => field(p.id, 'maxLevel', Number(e.target.value) || 1)}
                    className="w-16"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={p.harvestsPerLevel}
                    onChange={(e) => field(p.id, 'harvestsPerLevel', Number(e.target.value) || 1)}
                    className="w-16"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    value={p.coinGrowthPerLevel}
                    onChange={(e) => field(p.id, 'coinGrowthPerLevel', Number(e.target.value) || 0)}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.waterable}
                    onChange={(e) => field(p.id, 'waterable', e.target.checked)}
                    className="h-4 w-4 accent-sky-500"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Button size="sm" variant="danger" onClick={() => removeProduce(p.id)}>
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 font-semibold text-neutral-100">Add new produce</h2>
        <form onSubmit={submitNew} className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-neutral-500">
            Emoji
            <Input value={draft.emoji} onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))} className="mt-1 w-14 text-center" />
          </label>
          <label className="text-xs text-neutral-500">
            Name
            <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="mt-1 w-36" />
          </label>
          <label className="text-xs text-neutral-500">
            Category
            <Select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as ProduceCategory }))}
              className="mt-1"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-xs text-neutral-500">
            Grow (min)
            <Input
              type="number"
              value={draft.growTimeMinutes}
              onChange={(e) => setDraft((d) => ({ ...d, growTimeMinutes: Number(e.target.value) || 0 }))}
              className="mt-1 w-20"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Cost
            <Input
              type="number"
              value={draft.seedCost}
              onChange={(e) => setDraft((d) => ({ ...d, seedCost: Number(e.target.value) || 0 }))}
              className="mt-1 w-20"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Sell price
            <Input
              type="number"
              value={draft.sellPricePerHarvest}
              onChange={(e) => setDraft((d) => ({ ...d, sellPricePerHarvest: Number(e.target.value) || 0 }))}
              className="mt-1 w-20"
            />
          </label>
          <label className="text-xs text-neutral-500">
            XP
            <Input
              type="number"
              value={draft.xpPerHarvest}
              onChange={(e) => setDraft((d) => ({ ...d, xpPerHarvest: Number(e.target.value) || 0 }))}
              className="mt-1 w-16"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Unlock lvl
            <Input
              type="number"
              value={draft.unlockLevel}
              onChange={(e) => setDraft((d) => ({ ...d, unlockLevel: Number(e.target.value) || 1 }))}
              className="mt-1 w-16"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Max item lvl
            <Input
              type="number"
              value={draft.maxLevel}
              onChange={(e) => setDraft((d) => ({ ...d, maxLevel: Number(e.target.value) || 1 }))}
              className="mt-1 w-16"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Harvests/lvl
            <Input
              type="number"
              value={draft.harvestsPerLevel}
              onChange={(e) => setDraft((d) => ({ ...d, harvestsPerLevel: Number(e.target.value) || 1 }))}
              className="mt-1 w-16"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-neutral-500">
            <input
              type="checkbox"
              checked={draft.waterable}
              onChange={(e) => setDraft((d) => ({ ...d, waterable: e.target.checked }))}
              className="h-4 w-4 accent-sky-500"
            />
            Waterable
          </label>
          <Button type="submit">
            <Plus size={14} /> Add produce
          </Button>
        </form>
      </Card>
    </div>
  );
}

function MachineEditor() {
  const machines = useMachineStore((s) => s.machines);
  const addMachine = useMachineStore((s) => s.addMachine);
  const updateMachine = useMachineStore((s) => s.updateMachine);
  const removeMachine = useMachineStore((s) => s.removeMachine);
  const resetToDefaults = useMachineStore((s) => s.resetToDefaults);
  const importMachines = useMachineStore((s) => s.importMachines);

  const [draft, setDraft] = useState(BLANK_MACHINE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function field<K extends keyof Machine>(id: string, key: K, value: Machine[K]) {
    updateMachine(id, { [key]: value } as Partial<Machine>);
  }

  function submitNew(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    addMachine(draft);
    setDraft(BLANK_MACHINE);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(machines, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ftg2-machines-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) importMachines(parsed);
      } catch {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div>
      <Card className="mb-4 flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant="secondary" onClick={exportJson}>
          <Download size={12} /> Export JSON
        </Button>
        <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={12} /> Import JSON
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={importJson} />
        <Button size="sm" variant="danger" onClick={resetToDefaults}>
          <RotateCcw size={12} /> Reset to defaults
        </Button>
        <span className="ml-auto text-xs text-neutral-500">{machines.length} items</span>
      </Card>

      <Card className="mb-4 overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-3 py-2">Emoji</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">W</th>
              <th className="px-3 py-2">H</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Currency</th>
              <th className="px-3 py-2">Unlock lvl</th>
              <th className="px-3 py-2">Effect</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id} className="border-b border-neutral-800/60 last:border-0">
                <td className="px-3 py-1.5">
                  <Input value={m.emoji} onChange={(e) => field(m.id, 'emoji', e.target.value)} className="w-14 text-center" />
                </td>
                <td className="px-3 py-1.5">
                  <Input value={m.name} onChange={(e) => field(m.id, 'name', e.target.value)} className="w-36" />
                </td>
                <td className="px-3 py-1.5">
                  <Select value={m.category} onChange={(e) => field(m.id, 'category', e.target.value as MachineCategory)}>
                    {MACHINE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={m.footprint.w}
                    onChange={(e) => field(m.id, 'footprint', { ...m.footprint, w: Number(e.target.value) || 1 })}
                    className="w-14"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={m.footprint.h}
                    onChange={(e) => field(m.id, 'footprint', { ...m.footprint, h: Number(e.target.value) || 1 })}
                    className="w-14"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={m.cost}
                    onChange={(e) => field(m.id, 'cost', Number(e.target.value) || 0)}
                    className="w-20"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Select value={m.costCurrency} onChange={(e) => field(m.id, 'costCurrency', e.target.value as Machine['costCurrency'])}>
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    value={m.unlockLevel}
                    onChange={(e) => field(m.id, 'unlockLevel', Number(e.target.value) || 1)}
                    className="w-16"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input value={m.effect ?? ''} onChange={(e) => field(m.id, 'effect', e.target.value)} className="w-72" />
                </td>
                <td className="px-3 py-1.5">
                  <Button size="sm" variant="danger" onClick={() => removeMachine(m.id)}>
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 font-semibold text-neutral-100">Add new building / machine</h2>
        <form onSubmit={submitNew} className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-neutral-500">
            Emoji
            <Input value={draft.emoji} onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))} className="mt-1 w-14 text-center" />
          </label>
          <label className="text-xs text-neutral-500">
            Name
            <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="mt-1 w-36" />
          </label>
          <label className="text-xs text-neutral-500">
            Category
            <Select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as MachineCategory }))} className="mt-1">
              {MACHINE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-xs text-neutral-500">
            Size WxH
            <div className="mt-1 flex gap-1">
              <Input
                type="number"
                value={draft.footprint.w}
                onChange={(e) => setDraft((d) => ({ ...d, footprint: { ...d.footprint, w: Number(e.target.value) || 1 } }))}
                className="w-14"
              />
              <Input
                type="number"
                value={draft.footprint.h}
                onChange={(e) => setDraft((d) => ({ ...d, footprint: { ...d.footprint, h: Number(e.target.value) || 1 } }))}
                className="w-14"
              />
            </div>
          </label>
          <label className="text-xs text-neutral-500">
            Cost
            <Input
              type="number"
              value={draft.cost}
              onChange={(e) => setDraft((d) => ({ ...d, cost: Number(e.target.value) || 0 }))}
              className="mt-1 w-20"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Currency
            <Select value={draft.costCurrency} onChange={(e) => setDraft((d) => ({ ...d, costCurrency: e.target.value as Machine['costCurrency'] }))} className="mt-1">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-xs text-neutral-500">
            Unlock lvl
            <Input
              type="number"
              value={draft.unlockLevel}
              onChange={(e) => setDraft((d) => ({ ...d, unlockLevel: Number(e.target.value) || 1 }))}
              className="mt-1 w-16"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Effect
            <Input value={draft.effect ?? ''} onChange={(e) => setDraft((d) => ({ ...d, effect: e.target.value }))} className="mt-1 w-64" />
          </label>
          <Button type="submit">
            <Plus size={14} /> Add
          </Button>
        </form>
      </Card>
    </div>
  );
}
