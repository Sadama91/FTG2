import { useMemo, useRef, useState } from 'react';
import { useDesignStore } from '../store/useDesignStore';
import { PALETTE } from '../data/palette';
import type { TileKind } from '../types';
import { Button, Card, Input, PageHeader, Select } from '../components/ui';
import { Download, Eraser, Minus, Plus, Trash2, Upload } from 'lucide-react';

const ERASER = '__eraser__';

export default function FarmDesign() {
  const layouts = useDesignStore((s) => s.layouts);
  const activeLayoutId = useDesignStore((s) => s.activeLayoutId);
  const createLayout = useDesignStore((s) => s.createLayout);
  const duplicateLayout = useDesignStore((s) => s.duplicateLayout);
  const renameLayout = useDesignStore((s) => s.renameLayout);
  const deleteLayout = useDesignStore((s) => s.deleteLayout);
  const setActiveLayout = useDesignStore((s) => s.setActiveLayout);
  const resizeActiveLayout = useDesignStore((s) => s.resizeActiveLayout);
  const clearActiveLayout = useDesignStore((s) => s.clearActiveLayout);
  const placeStamp = useDesignStore((s) => s.placeStamp);
  const eraseCell = useDesignStore((s) => s.eraseCell);
  const importLayout = useDesignStore((s) => s.importLayout);

  const layout = layouts.find((l) => l.id === activeLayoutId) ?? layouts[0];

  const [tool, setTool] = useState<string>(PALETTE[0].kind);
  const [cellSize, setCellSize] = useState(20);
  const [isPainting, setIsPainting] = useState(false);
  const paintMode = useRef<'paint' | 'erase'>('paint');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = PALETTE.find((p) => p.kind === tool);

  const groupBounds = useMemo(() => {
    const bounds: Record<string, { x: number; y: number; w: number; h: number; kind: TileKind }> = {};
    for (const [key, groupId] of Object.entries(layout.cellGroups)) {
      const [x, y] = key.split(',').map(Number);
      const kind = layout.groups[groupId];
      if (!kind) continue;
      if (!bounds[groupId]) bounds[groupId] = { x, y, w: 1, h: 1, kind };
      else {
        const b = bounds[groupId];
        const minX = Math.min(b.x, x);
        const minY = Math.min(b.y, y);
        const maxX = Math.max(b.x + b.w - 1, x);
        const maxY = Math.max(b.y + b.h - 1, y);
        b.x = minX;
        b.y = minY;
        b.w = maxX - minX + 1;
        b.h = maxY - minY + 1;
      }
    }
    return Object.values(bounds);
  }, [layout.cellGroups, layout.groups]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of groupBounds) c[b.kind] = (c[b.kind] ?? 0) + 1;
    return c;
  }, [groupBounds]);

  function handleCellDown(x: number, y: number) {
    setIsPainting(true);
    if (tool === ERASER) {
      paintMode.current = 'erase';
      eraseCell(x, y);
    } else if (selectedItem) {
      paintMode.current = 'paint';
      placeStamp(x, y, selectedItem.w, selectedItem.h, selectedItem.kind);
    }
  }

  function handleCellEnter(x: number, y: number) {
    if (!isPainting) return;
    if (paintMode.current === 'erase') {
      eraseCell(x, y);
    } else if (selectedItem && selectedItem.w === 1 && selectedItem.h === 1) {
      placeStamp(x, y, 1, 1, selectedItem.kind);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layout.name.replace(/\s+/g, '-').toLowerCase()}.json`;
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
        if (parsed && typeof parsed.width === 'number' && typeof parsed.height === 'number') {
          importLayout(parsed);
        }
      } catch {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div onMouseUp={() => setIsPainting(false)} onMouseLeave={() => setIsPainting(false)}>
      <PageHeader
        title="Farm Design"
        description="Sketch your plot layout: paint crop plots, paths, water and buildings on a grid, just like planning your real farm."
      />

      <Card className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <Select value={activeLayoutId} onChange={(e) => setActiveLayout(e.target.value)}>
          {layouts.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <Input
          value={layout.name}
          onChange={(e) => renameLayout(layout.id, e.target.value)}
          className="w-40"
          title="Rename layout"
        />
        <Button size="sm" variant="secondary" onClick={() => createLayout('New Farm')}>
          New
        </Button>
        <Button size="sm" variant="secondary" onClick={() => duplicateLayout(layout.id)}>
          Duplicate
        </Button>
        <Button size="sm" variant="danger" onClick={() => deleteLayout(layout.id)}>
          <Trash2 size={12} /> Delete
        </Button>

        <div className="mx-2 h-6 w-px bg-neutral-800" />

        <label className="flex items-center gap-1 text-xs text-neutral-400">
          W
          <Input
            type="number"
            value={layout.width}
            min={5}
            max={60}
            onChange={(e) => resizeActiveLayout(Number(e.target.value) || layout.width, layout.height)}
            className="w-16"
          />
        </label>
        <label className="flex items-center gap-1 text-xs text-neutral-400">
          H
          <Input
            type="number"
            value={layout.height}
            min={5}
            max={60}
            onChange={(e) => resizeActiveLayout(layout.width, Number(e.target.value) || layout.height)}
            className="w-16"
          />
        </label>

        <div className="mx-2 h-6 w-px bg-neutral-800" />

        <Button size="sm" variant="ghost" onClick={() => setCellSize((z) => Math.max(10, z - 2))} title="Zoom out">
          <Minus size={14} />
        </Button>
        <span className="text-xs text-neutral-500">{cellSize}px</span>
        <Button size="sm" variant="ghost" onClick={() => setCellSize((z) => Math.min(40, z + 2))} title="Zoom in">
          <Plus size={14} />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={exportJson}>
            <Download size={12} /> Export
          </Button>
          <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={12} /> Import
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={importJson} />
          <Button size="sm" variant="danger" onClick={clearActiveLayout}>
            Clear grid
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Palette */}
        <Card className="h-fit shrink-0 p-3 lg:w-56">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Palette</div>
          <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
            <button
              onClick={() => setTool(ERASER)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                tool === ERASER ? 'bg-rose-600/20 text-rose-400' : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Eraser size={14} /> Eraser
            </button>
            {PALETTE.map((item) => (
              <button
                key={item.kind}
                onClick={() => setTool(item.kind)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  tool === item.kind ? 'bg-emerald-600/20 text-emerald-400' : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>{item.emoji}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-neutral-600">
                  {item.w}×{item.h}
                </span>
              </button>
            ))}
          </div>

          {Object.keys(counts).length > 0 && (
            <div className="mt-4 border-t border-neutral-800 pt-3">
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Placed</div>
              <div className="space-y-1 text-xs text-neutral-400">
                {Object.entries(counts).map(([kind, n]) => {
                  const item = PALETTE.find((p) => p.kind === kind);
                  return (
                    <div key={kind} className="flex justify-between">
                      <span>
                        {item?.emoji} {item?.label ?? kind}
                      </span>
                      <span>{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Grid */}
        <Card className="flex-1 overflow-auto p-4">
          <div
            className="relative select-none"
            style={{ width: layout.width * cellSize, height: layout.height * cellSize }}
          >
            {/* checkerboard background */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${layout.width}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${layout.height}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: layout.width * layout.height }).map((_, i) => {
                const x = i % layout.width;
                const y = Math.floor(i / layout.width);
                const even = (x + y) % 2 === 0;
                return <div key={i} className={even ? 'bg-neutral-800/40' : 'bg-neutral-800/20'} />;
              })}
            </div>

            {/* placed stamps */}
            {groupBounds.map((b, i) => {
              const item = PALETTE.find((p) => p.kind === b.kind);
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-[3px] border text-center leading-none"
                  style={{
                    left: b.x * cellSize,
                    top: b.y * cellSize,
                    width: b.w * cellSize,
                    height: b.h * cellSize,
                    background: (item?.color ?? '#666') + '33',
                    borderColor: (item?.color ?? '#666') + '99',
                    fontSize: Math.min(cellSize * Math.min(b.w, b.h) * 0.6, 28),
                  }}
                >
                  {item?.emoji}
                </div>
              );
            })}

            {/* pointer grid */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${layout.width}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${layout.height}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: layout.width * layout.height }).map((_, i) => {
                const x = i % layout.width;
                const y = Math.floor(i / layout.width);
                return (
                  <div
                    key={i}
                    onMouseDown={() => handleCellDown(x, y)}
                    onMouseEnter={() => handleCellEnter(x, y)}
                    className="hover:bg-white/10"
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Click or click-and-drag to paint. Buildings are placed with a single click anchored at the cell you click.
        Layouts save automatically in your browser — use Export to back up or share a layout as a file.
      </p>
    </div>
  );
}
