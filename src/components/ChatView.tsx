import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, RefreshCw, ShieldCheck } from 'lucide-react';
import { QueryResponse, VerificationMethod } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { VerdictBadge } from './ui/VerdictBadge';
import { cn } from '../lib/cn';

interface ChatViewProps {
  onQuerySubmit: (question: string, method: VerificationMethod) => Promise<void>;
  currentResponse: QueryResponse | null;
  isLoading: boolean;
  selectedMethod: VerificationMethod;
  setSelectedMethod: (method: VerificationMethod) => void;
  documentCount: number;
  onOpenReport: () => void;
}

const METHODS: { id: VerificationMethod; label: string }[] = [
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'nli_only', label: 'NLI' },
  { id: 'semantic_only', label: 'Semantic' },
];

const SAMPLE_QUERIES = [
  'What is the minimum attendance requirement for semester exams?',
  'How many credits are required for a B.Tech degree?',
];

export const ChatView: React.FC<ChatViewProps> = ({
  onQuerySubmit,
  currentResponse,
  isLoading,
  selectedMethod,
  setSelectedMethod,
  documentCount,
  onOpenReport,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;
    onQuerySubmit(inputQuestion.trim(), selectedMethod);
  };

  const handleSampleClick = (query: string) => {
    setInputQuestion(query);
    onQuerySubmit(query, selectedMethod);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Verify a question"
        description={
          documentCount > 0
            ? `${documentCount} documents indexed. Each answer is split into claims and checked against PDF evidence.`
            : 'Upload documents first, or load the sample dataset from the Documents tab.'
        }
      />

      {/* Method + input */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Engine</span>
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMethod(m.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                selectedMethod === m.id
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about attendance, credits, placement rules…"
            disabled={isLoading}
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 py-3.5 pl-4 pr-28 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading || !inputQuestion.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            icon={isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : undefined}
          >
            {isLoading ? 'Running' : 'Verify'}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSampleClick(q)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-left text-xs text-zinc-400 transition hover:border-white/10 hover:text-zinc-200"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 rounded-2xl border border-white/[0.06] p-6"
          >
            <div className="skeleton h-4 w-1/3 rounded-lg" />
            <div className="skeleton h-3 w-full rounded-lg" />
            <div className="skeleton h-3 w-2/3 rounded-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {currentResponse && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Scores + verified answer — hero */}
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-3">
                <Badge tone={currentResponse.reliabilityScore >= 80 ? 'success' : 'warning'}>
                  {currentResponse.reliabilityScore}% reliable
                </Badge>
                <Badge tone={currentResponse.hallucinationScore > 0 ? 'danger' : 'success'}>
                  {currentResponse.hallucinationScore}% hallucination risk
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onOpenReport}>
                Full report
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="p-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">Verified answer</p>
              <p className="text-sm leading-relaxed text-zinc-100 whitespace-pre-wrap">
                {currentResponse.verifiedAnswer}
              </p>
            </div>
          </Card>

          {/* Claims — relevant claims only */}
          <div className="space-y-3">
            <SectionHeader
              title={`${currentResponse.claims.length} claims analyzed`}
              description="Each statement from the RAG answer, scored against retrieved evidence."
            />
            <div className="space-y-2">
              {currentResponse.claims.map((claim, idx) => (
                <Card key={claim.claimId || idx} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <VerdictBadge verdict={claim.verdict} confidence={claim.confidence} />
                    {claim.sourceDocName && (
                      <span className="text-[11px] text-zinc-500">
                        {claim.sourceDocName}
                        {claim.sourcePageNumber ? ` · p.${claim.sourcePageNumber}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-zinc-200">{claim.claimText}</p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {claim.verdict === 'SUPPORTED' || claim.verdict === 'PARTIALLY_SUPPORTED'
                      ? `${claim.sourceDocName || 'Document'}${claim.sourcePageNumber ? ` · page ${claim.sourcePageNumber}` : ''}`
                      : `${claim.verdict === 'CONTRADICTED' ? 'Rejected' : 'Removed'} because no supporting evidence was found in the uploaded documents.`}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Collapsible: original answer */}
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.02]"
          >
            <span>Original RAG answer</span>
            <ChevronDown className={cn('h-4 w-4 transition', showOriginal && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showOriginal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-4 text-sm text-zinc-400">{currentResponse.originalAnswer}</Card>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

      {!currentResponse && !isLoading && (
        <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <ShieldCheck className="mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">Submit a question to see verified results here.</p>
        </Card>
      )}
    </div>
  );
};
