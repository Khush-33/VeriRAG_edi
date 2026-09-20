import React, { useState } from 'react';
import {
  ArrowDown,
  CheckCircle,
  Cpu,
  Database,
  FileCheck,
  FileText,
  GitCommit,
  HelpCircle,
  Layers,
  Play,
  Scale,
  Search,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const AlgorithmExplainer: React.FC = () => {
  const [testPremise, setTestPremise] = useState(
    'Students must maintain a minimum mandatory attendance of 75% in every registered course to be eligible for End-Semester Examinations. Attendance cannot be purchased or relaxed by paying fees or fines.'
  );
  const [testClaim, setTestClaim] = useState(
    'Students having 65-75% attendance can pay a fine to sit for the exam.'
  );
  const [testResult, setTestResult] = useState<{
    semanticSim: number;
    nliResult: string;
    hybridVerdict: string;
    confidence: number;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runPlaygroundTest = async () => {
    if (!testPremise.trim() || !testClaim.trim() || isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Auditing custom premise-claim hypothesis pair',
          answer: testClaim,
          method: 'hybrid',
          documentText: testPremise
        })
      });

      if (res.ok) {
        const data = await res.json();
        const firstClaim = data.claims && data.claims.length > 0 ? data.claims[0] : null;
        if (firstClaim) {
          setTestResult({
            semanticSim: Math.round((firstClaim.scores?.semanticSimilarity || 0.7) * 100),
            nliResult: firstClaim.scores?.nliEntailmentProb ? (
              firstClaim.scores.nliEntailmentProb.contradiction > 0.5 ? 'CONTRADICTION' :
              firstClaim.scores.nliEntailmentProb.entailment > 0.5 ? 'ENTAILMENT' : 'NEUTRAL'
            ) : 'NEUTRAL',
            hybridVerdict: firstClaim.verdict,
            confidence: Math.round((firstClaim.confidenceScore || 0.85) * 100)
          });
        }
      }
    } catch (err) {
      console.error('Playground audit error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Under the Hood: VeriRAG Verification Pipeline Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Visualizing how raw academic RAG answers are decomposed, matched against PDF chunks, and evaluated using our lightweight evidence-aware hybrid model.
        </p>
      </div>

      {/* Pipeline Visual Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
            01
          </div>
          <h3 className="text-sm font-bold text-white">1. PDF Chunking & Vector Index</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Academic PDFs are ingested, maintaining exact page markers <code className="text-indigo-400">[Page X]</code>. Text is split into ~250 word chunks and indexed with TF-IDF and vector embeddings.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
            02
          </div>
          <h3 className="text-sm font-bold text-white">2. Answer Generation & Claim Split</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard RAG answer is generated. VeriRAG's decomposition layer immediately parses the answer into atomic, testable claims (Claim 1, Claim 2).
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
            03
          </div>
          <h3 className="text-sm font-bold text-white">3. Hybrid Fact-Check & Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Each claim retrieves top PDF evidence. Semantic cosine similarity + NLI entailment logic produces verdict (<code className="text-emerald-400">SUPPORTED</code> / <code className="text-rose-400">UNSUPPORTED</code>) + Page citation.
          </p>
        </div>

      </div>

      {/* Interactive Claim Verification Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Interactive Hybrid Verification Playground
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Test custom Premise vs Hypothesis pairs to see how semantic similarity and NLI logic collaborate to spot hallucinations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Premise Evidence (from PDF)
            </label>
            <textarea
              value={testPremise}
              onChange={(e) => setTestPremise(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Generated Claim / Hypothesis (RAG Output)
            </label>
            <textarea
              value={testClaim}
              onChange={(e) => setTestClaim(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <button
          onClick={runPlaygroundTest}
          disabled={isAnalyzing}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isAnalyzing ? 'Running NLI Audit...' : 'Execute Real Hybrid Audit'}</span>
        </button>

        {testResult && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-indigo-400 font-bold">Verification Engine Output:</span>
              <span className="text-white font-bold bg-indigo-600 px-2.5 py-0.5 rounded">
                Verdict: {testResult.hybridVerdict}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 block">Semantic Overlap</span>
                <span className="text-sm font-bold text-slate-200">{testResult.semanticSim}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">NLI Logical Class</span>
                <span className="text-sm font-bold text-amber-400">{testResult.nliResult}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Confidence Score</span>
                <span className="text-sm font-bold text-emerald-400">{testResult.confidence}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
