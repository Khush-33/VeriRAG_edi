import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, RefreshCw, ShieldCheck } from 'lucide-react';
import { DocumentFile, QueryResponse, VerificationMethod } from '../types';
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
  documents?: DocumentFile[];
  onOpenReport: () => void;
}

const METHODS: { id: VerificationMethod; label: string }[] = [
  { id: 'hybrid', label: 'Hybrid (DeBERTa + Dense)' },
  { id: 'nli_only', label: 'Cross-Encoder NLI' },
  { id: 'semantic_only', label: 'Dense Semantic Cosine' },
];

export const ChatView: React.FC<ChatViewProps> = ({
  onQuerySubmit,
  currentResponse,
  isLoading,
  selectedMethod,
  setSelectedMethod,
  documentCount,
  documents = [],
  onOpenReport,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);

  // Dynamically derive suggested queries from active indexed documents
  const dynamicSuggestions = documents.length > 0
    ? documents.slice(0, 3).map((d) => `What are the primary regulations and requirements specified in ${d.name}?`)
    : [];

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
      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase font-bold text-stone-500">Inference Engine:</span>
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMethod(m.id)}
              className="rounded px-3 py-1 font-mono text-xs font-semibold transition"
              style={selectedMethod === m.id
                ? { background: '#121316', color: '#ffffff', border: '1px solid #121316' }
                : { background: 'var(--bg-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }
              }
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
            placeholder="Ask about attendance regulations, graduation credits, capstone criteria…"
            disabled={isLoading}
            className="w-full rounded-md py-3.5 pl-4 pr-28 text-sm focus:outline-none transition font-sans"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(5,150,105,0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading || !inputQuestion.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 font-mono uppercase text-[11px] tracking-wider"
            icon={isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : undefined}
          >
            {isLoading ? 'Verifying' : 'Verify'}
          </Button>
        </form>

        {dynamicSuggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
            <span className="text-[10px] font-mono uppercase text-stone-400">Contextual Inquiries:</span>
            {dynamicSuggestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(q)}
                className="rounded px-2.5 py-1 text-left text-xs font-sans transition text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 rounded-2xl p-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
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
            <div
              className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <div className="flex items-center gap-3">
                <Badge tone={currentResponse.reliabilityScore >= 80 ? 'success' : 'warning'}>
                  {currentResponse.reliabilityScore}% reliable
                </Badge>
                <Badge tone={currentResponse.hallucinationScore > 0 ? 'danger' : 'success'}>
                  {currentResponse.hallucinationScore}% hallucination risk
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onOpenReport}
                style={{ color: 'var(--brand-600)' }}>
                Full report
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="p-5">
              <p className="mb-2 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Verified answer</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
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
                      <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                        {claim.sourceDocName}
                        {claim.sourcePageNumber ? ` · p.${claim.sourcePageNumber}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-primary)' }}>{claim.claimText}</p>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
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
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition"
            style={{ border: '1px solid var(--border-default)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}
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
          <ShieldCheck className="mb-3 h-8 w-8" style={{ color: 'var(--brand-400)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Submit a question to see verified results here.</p>
        </Card>
      )}
    </div>
  );
};
