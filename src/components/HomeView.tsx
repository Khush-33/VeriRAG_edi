import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { DashboardTab } from './Navbar';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Stat } from './ui/Stat';

interface HomeViewProps {
  onNavigate: (tab: DashboardTab) => void;
  documentCount: number;
  chunkCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, documentCount, chunkCount }) => (
  <div className="space-y-10">
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 sm:px-10 sm:py-16">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-2xl space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          RAG verification
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
          Verify every claim against your documents.
        </h1>
        <p className="text-base leading-relaxed text-zinc-400">
          Ask a question, get a grounded answer, and see which claims are supported, partial, or hallucinated — with PDF citations.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={<MessageSquare className="h-4 w-4" />}
            onClick={() => onNavigate('chat')}
          >
            Start verifying
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => onNavigate('docs')}>
            Manage documents
          </Button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Stat label="Documents indexed" value={documentCount} hint="Academic PDFs in knowledge base" />
      <Stat label="Vector chunks" value={chunkCount} hint="Searchable evidence segments" />
    </section>

    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        {
          title: 'Verify answers',
          body: 'Decompose RAG output into claims and score each against retrieved evidence.',
          tab: 'chat' as DashboardTab,
        },
        {
          title: 'Full audit report',
          body: 'Export claim-level verdicts, confidence scores, and source page references.',
          tab: 'report' as DashboardTab,
        },
        {
          title: 'Benchmark methods',
          body: 'Compare semantic, NLI, and hybrid verification on RAGTruth.',
          tab: 'benchmark' as DashboardTab,
        },
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <Card hover className="h-full p-5" onClick={() => onNavigate(item.tab)}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
              <ShieldCheck className="h-4 w-4 text-zinc-300" />
            </div>
            <h3 className="font-medium text-zinc-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.body}</p>
          </Card>
        </motion.div>
      ))}
    </section>
  </div>
);
