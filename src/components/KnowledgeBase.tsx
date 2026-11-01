import React, { useState } from 'react';
import { ChevronDown, FileText, Globe, Link2, RefreshCw, Trash2, Upload, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { DocumentCategory, DocumentChunk, DocumentFile, IngestionSourceType } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { cn } from '../lib/cn';

interface KnowledgeBaseProps {
  documents: DocumentFile[];
  totalChunks: number;
  onResetSampleDocs: () => Promise<void>;
  onUploadDocument: (fileData: { name: string; category: DocumentCategory; content?: string; pdfBase64?: string; docxBase64?: string }) => Promise<void>;
  onIngestUrl: (urlData: { url: string; category: DocumentCategory; name?: string }) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
}

const CATEGORIES: DocumentCategory[] = [
  'Academic Regulations',
  'Examination Rules',
  'Attendance Policy',
  'Course Syllabus & Credits',
  'Placement & Internship',
  'Hostel & Scholarship',
  'Student Handbook',
  'Other',
];

type IngestionTab = 'file' | 'url';

const SOURCE_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'TXT',
  url: 'Website',
  drive: 'Google Drive',
  text: 'Text',
};

function SourceTypeBadge({ sourceType }: { sourceType?: string }) {
  if (!sourceType) return null;
  const label = SOURCE_TYPE_LABELS[sourceType] || sourceType;
  const colorClass =
    sourceType === 'pdf' ? 'bg-rose-500/15 text-rose-300' :
    sourceType === 'docx' ? 'bg-blue-500/15 text-blue-300' :
    sourceType === 'url' ? 'bg-emerald-500/15 text-emerald-300' :
    sourceType === 'drive' ? 'bg-yellow-500/15 text-yellow-300' :
    'bg-zinc-700/40 text-zinc-400';

  return (
    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', colorClass)}>
      {label}
    </span>
  );
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  documents,
  totalChunks,
  onResetSampleDocs,
  onUploadDocument,
  onIngestUrl,
  onDeleteDocument,
}) => {
  const [activeTab, setActiveTab] = useState<IngestionTab>('file');
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Academic Regulations');
  const [rawContent, setRawContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // URL tab state
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlCategory, setUrlCategory] = useState<DocumentCategory>('Other');
  const [isIngestingUrl, setIsIngestingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSuccess, setUrlSuccess] = useState<string | null>(null);

  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [chunksByDocument, setChunksByDocument] = useState<Record<string, DocumentChunk[]>>({});
  const [loadingChunksFor, setLoadingChunksFor] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!docName) setDocName(file.name.replace(/\.[^.]+$/, ''));
    setUploadError(null);
  };

  const resetFileForm = () => {
    setDocName('');
    setRawContent('');
    setSelectedFile(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!selectedFile && !rawContent.trim()) || !docName.trim() || isUploading) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (selectedFile) {
        const lowerName = selectedFile.name.toLowerCase();
        const isDocx = lowerName.endsWith('.docx');
        const isTxt = lowerName.endsWith('.txt') || lowerName.endsWith('.md') || selectedFile.type.includes('text');

        if (isTxt) {
          const text = await selectedFile.text();
          await onUploadDocument({ name: docName.trim(), category, content: text });
        } else {
          const reader = new FileReader();
          await new Promise<void>((resolve, reject) => {
            reader.onload = async () => {
              try {
                const dataUrl = reader.result as string;
                if (isDocx) {
                  await onUploadDocument({ name: docName.trim(), category, docxBase64: dataUrl });
                } else {
                  // Assume PDF
                  await onUploadDocument({ name: docName.trim(), category, pdfBase64: dataUrl });
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
        }
      } else {
        await onUploadDocument({ name: docName.trim(), category, content: rawContent.trim() });
      }

      setUploadSuccess('Document indexed successfully.');
      resetFileForm();
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isIngestingUrl) return;

    setIsIngestingUrl(true);
    setUrlError(null);
    setUrlSuccess(null);

    try {
      await onIngestUrl({ url: urlInput.trim(), category: urlCategory, name: urlName.trim() || undefined });
      setUrlSuccess('Source ingested and indexed successfully.');
      setUrlInput('');
      setUrlName('');
    } catch (err: any) {
      setUrlError(err?.message || 'Failed to ingest from URL.');
    } finally {
      setIsIngestingUrl(false);
    }
  };

  const handleToggleChunks = async (documentId: string) => {
    if (expandedDocId === documentId) {
      setExpandedDocId(null);
      return;
    }

    setExpandedDocId(documentId);
    if (chunksByDocument[documentId]) return;

    setLoadingChunksFor(documentId);
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load document chunks.');
      setChunksByDocument(current => ({ ...current, [documentId]: data.chunks || [] }));
    } catch (error) {
      console.error('Error loading document chunks:', error);
      setChunksByDocument(current => ({ ...current, [documentId]: [] }));
    } finally {
      setLoadingChunksFor(null);
    }
  };

  const isGoogleDriveUrl = (u: string) => /(?:drive|docs)\.google\.com/i.test(u);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Documents"
        description={`${documents.length} files · ${totalChunks} indexed chunks`}
        action={
          <Button variant="secondary" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={onResetSampleDocs}>
            Load samples
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Ingestion Panel */}
        <Card className="p-5">
          {/* Tab Switch */}
          <div className="mb-4 flex gap-1 rounded-xl border border-white/[0.06] bg-zinc-950/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition',
                activeTab === 'file'
                  ? 'bg-white/10 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload file
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition',
                activeTab === 'url'
                  ? 'bg-white/10 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              URL / Drive
            </button>
          </div>

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Document name"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-200 focus:border-white/20 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label className={cn(
                'flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/[0.1] px-4 py-8 text-center transition hover:border-white/20 hover:bg-white/[0.02]'
              )}>
                <Upload className="mb-2 h-5 w-5 text-zinc-500" />
                <span className="text-xs text-zinc-400">
                  {selectedFile ? selectedFile.name : 'Drop PDF, DOCX, TXT, or click to browse'}
                </span>
                <span className="mt-1 text-[11px] text-zinc-600">PDF · DOCX · TXT · MD</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>

              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Or paste text directly…"
                rows={2}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none font-mono"
              />

              {uploadError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  {uploadSuccess}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isUploading || (!selectedFile && !rawContent.trim()) || !docName.trim()}
                icon={isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isUploading ? 'Indexing…' : 'Index document'}
              </Button>
            </form>
          )}

          {/* URL / Drive Tab */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  {isGoogleDriveUrl(urlInput) ? '🔗 Google Drive link detected' : '🌐 Website or document URL'}
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="https://example.com/paper.pdf or https://drive.google.com/file/d/..."
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
                />
              </div>

              <input
                type="text"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                placeholder="Custom document name (optional)"
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />

              <select
                value={urlCategory}
                onChange={(e) => setUrlCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-200 focus:border-white/20 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 px-3 py-2.5 text-[11px] text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Supported:</strong> HTML web pages · plain text pages · direct PDF links · public Google Drive files (Docs, PDF, TXT).
                <br />
                <strong className="text-zinc-400">Not supported:</strong> Private Drive files · pages requiring login or JavaScript · scanned image PDFs.
              </div>

              {urlError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {urlError}
                </div>
              )}
              {urlSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  {urlSuccess}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isIngestingUrl || !urlInput.trim()}
                icon={isIngestingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              >
                {isIngestingUrl ? 'Fetching & indexing…' : 'Fetch & index'}
              </Button>
            </form>
          )}
        </Card>

        {/* Document List */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <Card className="flex flex-col items-center px-6 py-16 text-center">
              <FileText className="mb-3 h-8 w-8 text-zinc-600" />
              <p className="text-sm text-zinc-500">No documents yet. Upload a file, enter a URL, or load the sample dataset.</p>
            </Card>
          ) : (
            documents.map((doc) => {
              const isExpanded = expandedDocId === doc.id;
              const chunks = chunksByDocument[doc.id] || [];

              return (
                <Card key={doc.id} className="overflow-hidden">
                  <div className="flex items-center justify-between gap-4 p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleChunks(doc.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-zinc-500 transition', isExpanded && 'rotate-180')} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="block truncate text-sm font-medium text-zinc-100">{doc.name}</span>
                          {doc.sourceType && !doc.isSample && (
                            <SourceTypeBadge sourceType={doc.sourceType} />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {doc.category} · {doc.pageCount} pages · {doc.chunkCount} chunks
                          {doc.sourceUrl && (
                            <> · <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-600 hover:text-zinc-400 underline"
                              onClick={e => e.stopPropagation()}
                            >source ↗</a></>
                          )}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDocument(doc.id)}
                      className="rounded-lg p-2 text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-400"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/[0.06] bg-zinc-950/50 p-4">
                      {loadingChunksFor === doc.id ? (
                        <p className="text-xs text-zinc-500">Loading stored chunks…</p>
                      ) : chunks.length === 0 ? (
                        <p className="text-xs text-zinc-500">No stored chunks were returned for this document.</p>
                      ) : (
                        <div className="space-y-2">
                          {chunks.map((chunk, index) => (
                            <div key={chunk.id} className="rounded-xl border border-white/[0.06] bg-zinc-900/70 p-3">
                              <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                                <span>Chunk {index + 1} · page {chunk.pageNumber}</span>
                                <span className="font-mono">{chunk.id}</span>
                              </div>
                              <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">{chunk.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
