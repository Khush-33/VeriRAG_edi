import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  FolderArchive,
  Layers,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Upload
} from 'lucide-react';
import { DashboardTab } from './Navbar';
import { DocumentFile } from '../types';

interface HomeViewProps {
  onNavigate: (tab: DashboardTab) => void;
  documents: DocumentFile[];
  documentCount: number;
  chunkCount: number;
  onResetDocs: () => void;
  onQuickQuery: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  documents,
  documentCount,
  chunkCount,
  onResetDocs,
  onQuickQuery
}) => {
  const [quickQueryText, setQuickQueryText] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQueryText.trim()) return;
    onQuickQuery(quickQueryText.trim());
  };

  return (
    <div className="space-y-14 pt-3 pb-12">

      {/* ─── HERO WITH BANNER IMAGE & OVERLAID HEADLINE ──────────── */}
      <section className="relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-xl">
        {/* Background Banner Artwork */}
        <img
          src="/banner.jpg"
          alt="VeriRAG Evidence Topology & Citation Provenance Network"
          className="absolute inset-0 h-full w-full object-cover object-right md:object-center opacity-40 sm:opacity-50 transition duration-700 hover:scale-[1.01]"
        />

        {/* High-legibility scrim gradient: deep obsidian on text side, allowing artwork to glow through on the right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(10, 12, 16, 0.96) 0%, rgba(10, 12, 16, 0.90) 45%, rgba(10, 12, 16, 0.62) 75%, rgba(10, 12, 16, 0.28) 100%)'
          }}
        />

        {/* Content layered directly on top of the banner image */}
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16 space-y-7 max-w-5xl">
          {/* Top Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-900/90 border border-stone-700/80 px-3 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-indicator" />
              <span>VERIRAG PLATFORM</span>
              <span className="text-stone-600">/</span>
              <span>EVIDENCE-AWARE GROUNDING & FACTUAL AUDIT</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
              <span>DeBERTa-v3 Cross-Encoder</span>
              <span className="text-stone-700">|</span>
              <span>Dense Vector Index (384-d)</span>
            </div>
          </div>

          {/* Main Headline & Description */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.12] drop-shadow-md">
              Every generated claim must carry an{' '}
              <span className="italic font-normal text-emerald-400">unbroken paper trail</span>.
            </h1>
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-sans max-w-2xl font-light">
              VeriRAG decomposes Retrieval-Augmented Generation answers into atomic factual assertions,
              evaluates cross-encoder NLI entailment probabilities, and cross-references page-level PDF evidence
              to eliminate ungrounded hallucinations in high-stakes research and documentation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('chat')}
              className="group inline-flex items-center gap-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs uppercase font-bold px-6 py-3.5 transition shadow-lg shadow-emerald-950/40 active:scale-95"
            >
              <span>Launch Verification Lab</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className="inline-flex items-center gap-2 rounded border border-stone-700 bg-stone-900/70 hover:bg-stone-900 text-stone-200 font-mono text-xs uppercase font-semibold px-5 py-3.5 backdrop-blur-md transition hover:border-stone-500 active:scale-95"
            >
              <FolderArchive className="h-4 w-4 text-stone-400" />
              <span>Manage Corpus ({documentCount} docs)</span>
            </button>
          </div>

          {/* Bottom telemetry on top of image */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-stone-400 border-t border-stone-800/80">
            <div className="flex items-center gap-2">
              <span>Corpus: <strong className="text-white font-bold">{documentCount} documents</strong> indexed</span>
              <span className="text-stone-700">·</span>
              <span>Vector Chunks: <strong className="text-white font-bold">{chunkCount}</strong></span>
            </div>
            <div className="text-emerald-400 font-semibold">
              Active Engine: DeBERTa-v3 + AHSS v2.4 Online
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE QUICK QUERY WORKBENCH ────────────────── */}
      <section className="rounded-lg border border-stone-300 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-stone-500">
            <FileSearch className="h-4 w-4 text-emerald-700" />
            <span>Interactive Verification Console</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950">
            Submit a question to verify against your knowledge corpus
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Queries retrieve matching evidence segments, decompose the response into atomic propositions, and compute claim-level verdicts in real-time.
          </p>
        </div>

        <form onSubmit={handleQuickSubmit} className="relative">
          <input
            type="text"
            value={quickQueryText}
            onChange={(e) => setQuickQueryText(e.target.value)}
            placeholder={
              documentCount > 0
                ? "Ask a question about the active indexed documents..."
                : "Load the demo corpus or upload documents below to begin verification..."
            }
            className="w-full rounded-md py-3.5 pl-4 pr-32 text-sm focus:outline-none transition font-sans bg-stone-50 border border-stone-300 text-stone-900 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!quickQueryText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-stone-950 hover:bg-emerald-800 text-white font-mono text-xs uppercase font-bold px-4 py-2 transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <span>Verify</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </form>

        {documentCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-stone-500">
            <span className="text-[11px] uppercase font-bold text-stone-400">Sample Inquiries:</span>
            {documents.slice(0, 2).map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => onQuickQuery(`Summarize the core requirements outlined in ${doc.name}`)}
                className="rounded px-2.5 py-1 text-left text-xs font-sans text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition"
              >
                Summarize requirements in {doc.name.replace('.pdf', '')}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ─── LIVE KNOWLEDGE CORPUS STATUS (100% DYNAMIC) ──────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
              Active Knowledge Base
            </div>
            <h2 className="font-serif text-2xl font-medium text-stone-950">
              Vectorized Corpus Index
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-stone-500">
              <strong className="text-stone-900">{documentCount}</strong> documents · <strong className="text-stone-900">{chunkCount}</strong> chunks
            </span>
            <button
              onClick={() => onNavigate('docs')}
              className="font-mono text-xs font-bold text-emerald-800 hover:text-emerald-950 underline transition"
            >
              Corpus Workbench &rarr;
            </button>
          </div>
        </div>

        {documentCount === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/80 p-8 sm:p-12 text-center space-y-4">
            <FolderArchive className="mx-auto h-10 w-10 text-stone-400" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                No Documents Currently Vectorized
              </h3>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-stone-600 font-sans">
                The vector index is awaiting documents. Load the demo academic curriculum dataset or upload your own PDF/DOCX files.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onResetDocs}
                className="flex items-center gap-2 rounded bg-stone-950 px-4 py-2.5 font-mono text-xs uppercase font-bold text-white hover:bg-emerald-800 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Load Demo Corpus
              </button>
              <button
                onClick={() => onNavigate('docs')}
                className="flex items-center gap-2 rounded border border-stone-300 bg-white px-4 py-2.5 font-mono text-xs uppercase font-medium text-stone-700 hover:bg-stone-50 transition"
              >
                <Upload className="h-3.5 w-3.5 text-stone-500" />
                Upload PDF / DOCX
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-stone-300 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-stone-100 border-b border-stone-300 font-mono text-stone-700 uppercase text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Document Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Pages</th>
                    <th className="px-4 py-3 text-center">Vector Chunks</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-stone-50 transition">
                      <td className="px-5 py-3.5 font-semibold text-stone-900 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-stone-500 shrink-0" />
                        <span className="truncate max-w-[280px] sm:max-w-md">{doc.name}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-stone-600">
                        {doc.category}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-stone-600">
                        {doc.pageCount || 1}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-stone-900">
                        {doc.chunkCount}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          Ready
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs">
                        <button
                          onClick={() => {
                            onQuickQuery(`Explain the key rules in ${doc.name}`);
                          }}
                          className="font-bold text-stone-900 hover:text-emerald-800 transition"
                        >
                          Verify &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-stone-50 px-5 py-2.5 border-t border-stone-200 text-[11px] font-mono text-stone-500 flex flex-wrap justify-between gap-2">
              <span>All documents vectorized via dense bi-encoder with sentence-boundary chunking</span>
              <button
                onClick={() => onNavigate('docs')}
                className="font-bold text-stone-700 hover:text-stone-950 underline"
              >
                Upload more files
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ─── PRODUCTION PIPELINE ARCHITECTURE ─────────────────────── */}
      <section className="space-y-6 border-t border-stone-200 pt-10">
        <div className="space-y-1">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
            System Methodology
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-950">
            How VeriRAG audits generated responses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-stone-300 bg-white p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <span className="font-mono text-xs font-bold text-stone-400">PHASE 01</span>
              <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-[10px] text-stone-700 border border-stone-200">
                Decomposition
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Atomic Proposition Extraction
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Complex generative text is parsed into isolated, verifiable factual assertions. This prevents hallucinated sub-clauses from hiding inside otherwise accurate paragraphs.
            </p>
          </div>

          <div className="rounded-lg border border-stone-300 bg-white p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <span className="font-mono text-xs font-bold text-stone-400">PHASE 02</span>
              <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-[10px] text-stone-700 border border-stone-200">
                Dense Pairing
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Page-Level Evidence Retrieval
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Each atomic claim is embedded into the dense vector space and aligned against the top-k document chunks, extracting exact page coordinates and source document metadata.
            </p>
          </div>

          <div className="rounded-lg border border-stone-300 bg-white p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <span className="font-mono text-xs font-bold text-stone-400">PHASE 03</span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] text-emerald-800 border border-emerald-300">
                NLI Cross-Encoder
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Tri-State Entailment & AHSS
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              DeBERTa-v3 evaluates entailment, neutral, and contradiction probabilities to arbitrate verdicts (Supported, Partial, Contradicted) and computes the severity score.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WORKBENCH NAVIGATION MATRIX ─────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-stone-200 pt-10">
        <div
          onClick={() => onNavigate('chat')}
          className="rounded-lg border border-stone-300 bg-white p-5 cursor-pointer hover:border-stone-900 hover:shadow-sm transition space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-400">MOD 01</span>
            <FileSearch className="h-4 w-4 text-emerald-700" />
          </div>
          <h4 className="font-serif text-base font-bold text-stone-950">Verify Lab</h4>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Query the RAG engine with hybrid, NLI, or semantic verification options.
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-800 pt-1">
            Open Lab &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('docs')}
          className="rounded-lg border border-stone-300 bg-white p-5 cursor-pointer hover:border-stone-900 hover:shadow-sm transition space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-400">MOD 02</span>
            <FolderArchive className="h-4 w-4 text-stone-700" />
          </div>
          <h4 className="font-serif text-base font-bold text-stone-950">Knowledge Corpus</h4>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Ingest PDFs, Word files, or external web URLs into the dense vector store.
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-stone-800 pt-1">
            Manage Files &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('report')}
          className="rounded-lg border border-stone-300 bg-white p-5 cursor-pointer hover:border-stone-900 hover:shadow-sm transition space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-400">MOD 03</span>
            <FileCheck2 className="h-4 w-4 text-stone-700" />
          </div>
          <h4 className="font-serif text-base font-bold text-stone-950">Audit Reports</h4>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Detailed claim-by-claim provenance breakdown and formal JSON audit export.
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-stone-800 pt-1">
            View Audit &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('benchmark')}
          className="rounded-lg border border-stone-300 bg-white p-5 cursor-pointer hover:border-stone-900 hover:shadow-sm transition space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-400">MOD 04</span>
            <Cpu className="h-4 w-4 text-stone-700" />
          </div>
          <h4 className="font-serif text-base font-bold text-stone-950">RAGTruth Evaluation</h4>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Execute the quantitative evaluation suite comparing Hybrid vs NLI vs Cosine.
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-stone-800 pt-1">
            Run Benchmark &rarr;
          </span>
        </div>
      </section>

    </div>
  );
};
