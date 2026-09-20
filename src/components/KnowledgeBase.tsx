import React, { useState } from 'react';
import { Trash2, Upload, FileText, RefreshCw } from 'lucide-react';
import { DocumentCategory, DocumentFile } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { cn } from '../lib/cn';

interface KnowledgeBaseProps {
  documents: DocumentFile[];
  totalChunks: number;
  onResetSampleDocs: () => Promise<void>;
  onUploadDocument: (fileData: { name: string; category: DocumentCategory; content?: string; pdfBase64?: string }) => Promise<void>;
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

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  documents,
  totalChunks,
  onResetSampleDocs,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Academic Regulations');
  const [rawContent, setRawContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!docName) setDocName(file.name);
  };

  const resetForm = () => {
    setDocName('');
    setRawContent('');
    setSelectedFile(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!selectedFile && !rawContent.trim()) || !docName.trim() || isUploading) return;

    setIsUploading(true);
    try {
      if (selectedFile) {
        let fileTextContent = rawContent.trim();
        if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
          try {
            fileTextContent = await selectedFile.text();
          } catch (_) {}
        }

        const reader = new FileReader();
        reader.onload = async () => {
          await onUploadDocument({
            name: docName.trim(),
            category,
            pdfBase64: reader.result as string,
            content: fileTextContent || undefined,
          });
          resetForm();
          setIsUploading(false);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        await onUploadDocument({ name: docName.trim(), category, content: rawContent.trim() });
        resetForm();
        setIsUploading(false);
      }
    } catch (err) {
      console.error('Failed to upload document:', err);
      setIsUploading(false);
    }
  };

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
        {/* Upload */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-medium text-zinc-200">Add document</h3>
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

            <label
              className={cn(
                'flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/[0.1] px-4 py-8 text-center transition hover:border-white/20 hover:bg-white/[0.02]'
              )}
            >
              <Upload className="mb-2 h-5 w-5 text-zinc-500" />
              <span className="text-xs text-zinc-400">
                {selectedFile ? selectedFile.name : 'Drop PDF or click to browse'}
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
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

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isUploading || (!selectedFile && !rawContent.trim()) || !docName.trim()}
              icon={isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isUploading ? 'Indexing…' : 'Index document'}
            </Button>
          </form>
        </Card>

        {/* Document list */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <Card className="flex flex-col items-center px-6 py-16 text-center">
              <FileText className="mb-3 h-8 w-8 text-zinc-600" />
              <p className="text-sm text-zinc-500">No documents yet. Upload a PDF or load the sample dataset.</p>
            </Card>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-100">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {doc.category} · {doc.pageCount} pages · {doc.chunkCount} chunks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteDocument(doc.id)}
                  className="rounded-lg p-2 text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
