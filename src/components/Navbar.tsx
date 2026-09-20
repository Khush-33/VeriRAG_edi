import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, BookOpen, Home, MessageSquare, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/cn';

export type DashboardTab = 'home' | 'docs' | 'chat' | 'report' | 'benchmark';

interface NavbarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  docCount: number;
  chunkCount: number;
  onResetDocs: () => void;
}

const navItems: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { id: 'chat', label: 'Verify', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'docs', label: 'Documents', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'report', label: 'Report', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'benchmark', label: 'Research', icon: <BarChart3 className="h-4 w-4" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  docCount,
  chunkCount,
  onResetDocs,
}) => (
  <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2.5 shrink-0"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <ShieldCheck className="h-4 w-4 text-zinc-100" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-50">VeriRAG</span>
      </button>

      <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                isActive ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="hidden items-center gap-2 text-[11px] text-zinc-500 md:flex shrink-0">
        <span className="tabular-nums">{docCount} docs</span>
        <span className="text-zinc-700">·</span>
        <span className="tabular-nums">{chunkCount} chunks</span>
        <button
          type="button"
          onClick={onResetDocs}
          className="ml-2 rounded-lg px-2 py-1 text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300"
          title="Reset to sample documents"
        >
          Reset
        </button>
      </div>
    </div>
  </header>
);
