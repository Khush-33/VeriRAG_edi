import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar, DashboardTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ChatView } from './components/ChatView';
import { VerificationReportView } from './components/VerificationReport';
import { BenchmarkView } from './components/BenchmarkView';
import { AnimatedPage } from './components/ui/AnimatedPage';
import {
  BenchmarkCase,
  DocumentCategory,
  DocumentFile,
  MethodBenchmarkResult,
  QueryResponse,
  VerificationMethod
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>('hybrid');
  const [currentResponse, setCurrentResponse] = useState<QueryResponse | null>(null);
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<MethodBenchmarkResult[]>([]);
  const [benchmarkCases, setBenchmarkCases] = useState<BenchmarkCase[]>([]);
  const [isLoadingBenchmark, setIsLoadingBenchmark] = useState<boolean>(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        setTotalChunks(data.totalChunks || 0);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleQuerySubmit = async (question: string, method: VerificationMethod) => {
    setIsLoadingQuery(true);
    setQueryError(null);
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, method })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate RAG answer and verification.');
      }

      const data: QueryResponse = await res.json();
      setCurrentResponse(data);
    } catch (err: any) {
      console.error('Query submit error:', err);
      setQueryError(err.message || 'An error occurred while verifying query.');
    } finally {
      setIsLoadingQuery(false);
    }
  };

  const handleUploadDocument = async (fileData: { name: string; category: DocumentCategory; content?: string; pdfBase64?: string }) => {
    setQueryError(null);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
      });

      if (res.ok) {
        await fetchDocuments();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload document.');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setQueryError(err instanceof Error ? err.message : 'Failed to upload document.');
    }
  };

  const handleResetSampleDocs = async () => {
    setQueryError(null);
    try {
      const res = await fetch('/api/documents/load-sample', { method: 'POST' });
      if (res.ok) {
        await fetchDocuments();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load sample documents.');
      }
    } catch (err) {
      console.error('Error resetting sample documents:', err);
      setQueryError(err instanceof Error ? err.message : 'Failed to load sample documents.');
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setQueryError(null);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchDocuments();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete document.');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setQueryError(err instanceof Error ? err.message : 'Failed to delete document.');
    }
  };

  const handleRunBenchmarkSuite = async (dataset: string) => {
    setIsLoadingBenchmark(true);
    setQueryError(null);
    try {
      const res = await fetch('/api/benchmark/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedDataset: dataset })
      });

      if (res.ok) {
        const data = await res.json();
        setBenchmarkMetrics(data.methodMetrics || []);
        setBenchmarkCases(data.benchmarkCases || []);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to run benchmark evaluation.');
      }
    } catch (err) {
      console.error('Error running benchmark suite:', err);
      setQueryError(err instanceof Error ? err.message : 'Failed to run benchmark evaluation.');
    } finally {
      setIsLoadingBenchmark(false);
    }
  };

  return (
    <div className="app-grid flex min-h-screen flex-col text-zinc-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        docCount={documents.length}
        chunkCount={totalChunks}
        onResetDocs={handleResetSampleDocs}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {queryError && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <span>{queryError}</span>
            <button type="button" onClick={() => setQueryError(null)} className="text-rose-300 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <AnimatedPage key="home">
              <HomeView
                onNavigate={(tab) => setActiveTab(tab)}
                documentCount={documents.length}
                chunkCount={totalChunks}
              />
            </AnimatedPage>
          )}

          {activeTab === 'docs' && (
            <AnimatedPage key="docs">
              <KnowledgeBase
                documents={documents}
                totalChunks={totalChunks}
                onResetSampleDocs={handleResetSampleDocs}
                onUploadDocument={handleUploadDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </AnimatedPage>
          )}

          {activeTab === 'chat' && (
            <AnimatedPage key="chat">
              <ChatView
                onQuerySubmit={handleQuerySubmit}
                currentResponse={currentResponse}
                isLoading={isLoadingQuery}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                documentCount={documents.length}
                onOpenReport={() => setActiveTab('report')}
              />
            </AnimatedPage>
          )}

          {activeTab === 'report' && (
            <AnimatedPage key="report">
              <VerificationReportView
                currentResponse={currentResponse}
                onGoToVerify={() => setActiveTab('chat')}
              />
            </AnimatedPage>
          )}

          {activeTab === 'benchmark' && (
            <AnimatedPage key="benchmark">
              <BenchmarkView
                methodMetrics={benchmarkMetrics}
                benchmarkCases={benchmarkCases}
                onRunBenchmarkSuite={handleRunBenchmarkSuite}
                isLoading={isLoadingBenchmark}
              />
            </AnimatedPage>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/[0.04] py-5 text-center text-xs text-zinc-600">
        VeriRAG · Evidence-aware hallucination detection for academic RAG
      </footer>
    </div>
  );
}
