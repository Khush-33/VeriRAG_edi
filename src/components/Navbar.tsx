import React from 'react';
import { motion } from 'motion/react';
import {
  FileCheck2,
  FileSearch,
  FolderArchive,
  Layers,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export type DashboardTab = 'home' | 'chat' | 'docs' | 'report' | 'benchmark';

interface NavbarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  docCount: number;
  chunkCount: number;
  onResetDocs: () => void;
}

const navItems: { id: DashboardTab; label: string; number: string; icon: React.ReactNode }[] = [
  { id: 'home',      label: 'Overview',   number: '01', icon: <Layers className="h-3.5 w-3.5" /> },
  { id: 'chat',      label: 'Verify Lab', number: '02', icon: <FileSearch className="h-3.5 w-3.5" /> },
  { id: 'docs',      label: 'Corpus',     number: '03', icon: <FolderArchive className="h-3.5 w-3.5" /> },
  { id: 'report',    label: 'Audit Log',  number: '04', icon: <FileCheck2 className="h-3.5 w-3.5" /> },
  { id: 'benchmark', label: 'RAGTruth',   number: '05', icon: <Cpu className="h-3.5 w-3.5" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  docCount,
  chunkCount,
  onResetDocs,
}) => {
  return (
    <header
      className="sticky top-0 z-50 hairline-b backdrop-blur-md"
      style={{
        background: 'rgba(251, 251, 250, 0.94)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Top telemetry rule */}
      <div
        className="hairline-b px-4 py-1 text-[11px] font-mono flex items-center justify-between"
        style={{
          background: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)'
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 pulse-indicator" />
            VERIRAG / EVIDENCE & GROUNDING ENGINE
          </span>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span className="hidden sm:inline">DEBERTA-V3 CROSS-ENCODER</span>
          <span className="hidden md:inline text-stone-300">|</span>
          <span className="hidden md:inline">AHSS SEVERITY METRICS</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            <span className="font-semibold text-stone-900">{docCount}</span> docs indexed
          </span>
          <span className="hidden sm:inline text-stone-300">·</span>
          <span className="hidden sm:inline">
            <span className="font-semibold text-stone-900">{chunkCount}</span> vector chunks
          </span>
          <button
            type="button"
            onClick={onResetDocs}
            className="flex items-center gap-1 text-[10px] uppercase font-bold text-stone-600 hover:text-stone-900 px-1.5 py-0.5 rounded transition hover:bg-stone-200"
            title="Reload default sample documents"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Load Demo Corpus
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity mark */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded border border-stone-800 bg-stone-950 text-stone-100 font-mono text-xs font-bold transition group-hover:bg-emerald-900 group-hover:border-emerald-700"
          >
            VR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-950">
                VeriRAG
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase text-emerald-800 border border-emerald-300">
                NLI Provenance
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-sans tracking-wide">
              Hallucination Detection & Evidence Audit
            </p>
          </div>
        </button>

        {/* Art-directed tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <span className="font-mono text-[10px] text-stone-400">
                  {item.number}
                </span>
                <span className="flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-[11px] left-2 right-2 h-[2px] bg-emerald-700"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
