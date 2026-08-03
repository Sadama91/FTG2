import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Sprout, Map, Factory, Trophy, Target, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/planner', label: 'Crop Planner', icon: Sprout },
  { to: '/design', label: 'Farm Design', icon: Map },
  { to: '/production', label: 'Production', icon: Factory },
  { to: '/leveling', label: 'Leveling & Quests', icon: Trophy },
  { to: '/goals', label: 'Goal Planner', icon: Target },
  { to: '/data', label: 'Data Editor', icon: Database },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg">🌾</span> Farmhand
        </div>
        <button onClick={() => setOpen((o) => !o)} className="rounded-md p-2 hover:bg-neutral-800">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 shrink-0 transform border-r border-neutral-800 bg-neutral-900 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="hidden items-center gap-2 px-5 py-5 text-xl font-bold md:flex">
          <span className="text-2xl">🌾</span> Farmhand
        </div>
        <div className="px-5 py-3 text-xs text-neutral-500 md:pt-0">Farm Together 2 companion</div>
        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-neutral-800 px-5 py-4 text-xs text-neutral-500">
          Unofficial fan tool. Not affiliated with Milkstone Studios.
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-10 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <main className="min-w-0 flex-1 pt-14 md:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
