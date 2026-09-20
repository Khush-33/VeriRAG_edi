import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { QueryResponse } from '../types';

interface VerificationReportProps {
  currentResponse: QueryResponse | null;
}

export const VerificationReportView: React.FC<VerificationReportProps> = ({ currentResponse }) => {
  if (!currentResponse) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Verification Report Generated Yet</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please run a query in the Chat Playground to generate an in-depth claim-level verification report.
        </p>
      </div>
    );
  }

  const supportedClaims = currentResponse.claims.filter(c => c.verdict === 'SUPPORTED');
  const partiallySupported = currentResponse.claims.filter(c => c.verdict === 'PARTIALLY_SUPPORTED');
  const unsupportedClaims = currentResponse.claims.filter(c => c.verdict === 'UNSUPPORTED');
  const contradictedClaims = currentResponse.claims.filter(c => c.verdict === 'CONTRADICTED');

  const handleDownloadSingleReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      question: currentResponse.question,
      methodUsed: currentResponse.methodUsed,
      reliabilityScore: currentResponse.reliabilityScore,
      hallucinationScore: currentResponse.hallucinationScore,
      hallucinationRisk: currentResponse.hallucinationRisk,
      originalAnswer: currentResponse.originalAnswer,
      verifiedAnswer: currentResponse.verifiedAnswer,
      claims: currentResponse.claims,
      performanceBreakdown: currentResponse.performanceBreakdown
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Verification_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Detailed Claim-Level Verification Report
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formal audit log evaluating groundedness, NLI entailment probabilities, and source PDF page citations.
          </p>
        </div>

        {/* Global Reliability / Risk Badge & Download */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-6 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Overall Reliability</span>
              <span className={`text-2xl font-black ${
                currentResponse.reliabilityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentResponse.reliabilityScore}%
              </span>
            </div>

            <div className="w-px h-10 bg-slate-800" />

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Hallucination Risk</span>
              <span className={`text-2xl font-black ${
                currentResponse.hallucinationScore > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {currentResponse.hallucinationScore}%
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadSingleReport}
            className="px-4 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            title="Download JSON Verification Report"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Adaptive Hallucination Severity Score (AHSS) Research Panel */}
      {currentResponse.ahss && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  Adaptive Hallucination Severity Score (AHSS)
                </h3>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  Core Research Metric
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Evidence-weighted scoring function incorporating claim importance, retrieval cosine similarity, and NLI contradiction penalties.
              </p>
            </div>

            <div className="flex items-center space-x-4 font-mono">
              <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase block">Severity Level</span>
                <span className={`text-base font-black px-2 py-0.5 rounded-md ${
                  currentResponse.ahss.severity === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  currentResponse.ahss.severity === 'MODERATE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  currentResponse.ahss.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {currentResponse.ahss.severity}
                </span>
              </div>

              <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase block">Trust Index</span>
                <span className="text-xl font-bold text-cyan-400">
                  {currentResponse.ahss.trustScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Contradiction Penalty</span>
              <span className="text-sm font-bold text-rose-400">-{currentResponse.ahss.breakdown.contradictionPenalty}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Unsupported Penalty</span>
              <span className="text-sm font-bold text-amber-400">-{currentResponse.ahss.breakdown.unsupportedPenalty}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Partial Support Factor</span>
              <span className="text-sm font-bold text-indigo-400">-{currentResponse.ahss.breakdown.partialSupportDiscount}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Avg Evidence Quality</span>
              <span className="text-sm font-bold text-emerald-400">{(currentResponse.ahss.breakdown.evidenceQualityFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">AHSS Risk Index</span>
              <span className="text-sm font-bold text-cyan-400">{currentResponse.ahss.score}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Question Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
        <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Query Audited</span>
        <h3 className="text-lg font-bold text-white">"{currentResponse.question}"</h3>
        <p className="text-xs text-slate-400">
          Verification Engine: <strong className="text-slate-200 uppercase font-mono">{currentResponse.methodUsed}</strong> • Execution Latency: <strong className="text-slate-200 font-mono">{currentResponse.metrics.latencyMs}ms</strong>
        </p>
      </div>

      {/* Performance Breakdown Section */}
      {currentResponse.performanceBreakdown && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Pipeline Execution & Performance Analysis</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Embedding Latency</span>
              <span className="text-sm font-bold text-slate-200">{currentResponse.performanceBreakdown.embeddingTimeMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Retrieval Latency</span>
              <span className="text-sm font-bold text-slate-200">{currentResponse.performanceBreakdown.retrievalTimeMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">RAG Generation</span>
              <span className="text-sm font-bold text-slate-200">{currentResponse.performanceBreakdown.generationTimeMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Verification Engine</span>
              <span className="text-sm font-bold text-cyan-400">{currentResponse.performanceBreakdown.verificationTimeMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">Memory Overhead</span>
              <span className="text-sm font-bold text-cyan-400">{currentResponse.performanceBreakdown.memoryUsageMb} MB</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 space-y-1">
          <span className="text-xs font-mono text-emerald-500">Supported Claims</span>
          <div className="text-2xl font-bold font-mono">{supportedClaims.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-400 space-y-1">
          <span className="text-xs font-mono text-indigo-500">Partially Supported</span>
          <div className="text-2xl font-bold font-mono">{partiallySupported.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-400 space-y-1">
          <span className="text-xs font-mono text-amber-500">Unsupported Claims</span>
          <div className="text-2xl font-bold font-mono">{unsupportedClaims.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-400 space-y-1">
          <span className="text-xs font-mono text-rose-500">Contradicted Claims</span>
          <div className="text-2xl font-bold font-mono">{contradictedClaims.length}</div>
        </div>
      </div>

      {/* Detailed Claims Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Atomic Claim Evidence Log</span>
        </h3>

        <div className="space-y-4">
          {currentResponse.claims.map((claim, idx) => (
            <div
              key={claim.claimId || idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-slate-500">Claim #{idx + 1}</span>

                  {claim.verdict === 'SUPPORTED' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SUPPORTED ({claim.confidence}%)</span>
                    </span>
                  )}

                  {claim.verdict === 'PARTIALLY_SUPPORTED' && (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PARTIALLY_SUPPORTED ({claim.confidence}%)</span>
                    </span>
                  )}

                  {claim.verdict === 'UNSUPPORTED' && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>UNSUPPORTED (HALLUCINATION)</span>
                    </span>
                  )}

                  {claim.verdict === 'CONTRADICTED' && (
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>CONTRADICTED</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-cyan-400">
                  Document: <strong>{claim.sourceDocName}</strong> {claim.sourcePageNumber ? `(Page ${claim.sourcePageNumber})` : ''}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-mono">Statement:</div>
                <p className="text-base font-semibold text-white">"{claim.claimText}"</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-slate-400 font-bold">Retrieved PDF Evidence:</div>
                <p className="text-slate-300 leading-relaxed">"{claim.evidenceText}"</p>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <span className="font-bold text-slate-400 font-mono">DeBERTa NLI Assessment: </span>
                <span>{claim.reasoning}</span>
              </div>

              {/* Individual Score Breakdown */}
              {claim.scores && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Semantic Sim</span>
                    <span className="text-slate-200 font-bold">{(claim.scores.semanticSimilarity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">NLI Score</span>
                    <span className="text-slate-200 font-bold">{(claim.scores.nliEntailment * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Evidence Retrieval</span>
                    <span className="text-slate-200 font-bold">{(claim.scores.evidenceRetrievalScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-400 block font-bold">Hybrid Score</span>
                    <span className="text-cyan-400 font-bold">{(claim.scores.hybridScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
