/**
 * VeriRAG Unified Multi-Source Ingestion Pipeline
 *
 * Provides a unified pipeline and adapter registry for ingesting documents from:
 * - Local files (PDF, DOCX, plain text)
 * - Public URLs (HTML pages and directly-linked documents)
 * - Google Drive share links (Drive files, Docs, Sheets)
 *
 * Handles content validation, format detection, SSRF protection, deduplication,
 * chunking, dense vector indexing, and Firestore persistence with rollback.
 */

import { randomUUID, createHash } from 'crypto';
import {
  DocumentCategory,
  DocumentChunk,
  DocumentFile,
  IngestionSourceType
} from '../types';
import { extractTextFromPdfBuffer } from './pdfExtractor';
import { extractTextFromDocxBuffer } from './docxExtractor';
import { ingestFromUrl } from './urlFetcher';
import { parseDriveUrl, ingestFromDrive } from './driveFetcher';
import {
  chunkDocumentText,
  addChunksToVectorIndex,
  deleteChunksFromVectorIndex
} from './verificationEngine';
import { saveDocumentToFirestore } from './firestoreSync';

// ---------------------------------------------------------------------------
// Pipeline Interfaces
// ---------------------------------------------------------------------------

export interface IngestFileInput {
  name: string;
  category?: DocumentCategory;
  content?: string;
  pdfBase64?: string;
  docxBase64?: string;
}

export interface IngestUrlInput {
  url: string;
  category?: DocumentCategory;
  name?: string;
}

export interface ExtractedContent {
  text: string;
  pageCount: number;
  sourceType: IngestionSourceType;
  sourceUrl?: string;
  sourceLabel: string;
  contentHash: string;
}

export interface IngestionResult {
  document: DocumentFile;
  chunks: DocumentChunk[];
  isDuplicate: boolean;
  message?: string;
}

// ---------------------------------------------------------------------------
// Content Extraction Adapters
// ---------------------------------------------------------------------------

/**
 * Extracts and normalizes text from a file upload input (PDF, DOCX, or text).
 */
export async function extractFromFile(input: IngestFileInput): Promise<ExtractedContent> {
  const { name, content, pdfBase64, docxBase64 } = input;

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Document name is required.');
  }

  let text = content ? String(content).trim() : '';
  let pageCount = 1;
  let sourceType: IngestionSourceType = 'text';

  if (pdfBase64 && typeof pdfBase64 === 'string') {
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').replace(/\s/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const pdfData = await extractTextFromPdfBuffer(buffer);
    text = pdfData.text;
    pageCount = pdfData.pageCount;
    sourceType = 'pdf';
  } else if (docxBase64 && typeof docxBase64 === 'string') {
    const cleanBase64 = docxBase64
      .replace(/^data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document;base64,/, '')
      .replace(/\s/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const docxData = await extractTextFromDocxBuffer(buffer);
    text = docxData.text;
    pageCount = docxData.pageCount;
    sourceType = 'docx';
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Uploaded document produced no readable text. Please upload a valid PDF, DOCX, or text file.');
  }

  const contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');

  return {
    text: text.trim(),
    pageCount: Math.max(pageCount, (text.match(/\[Page\s+\d+\]/gi) || []).length || 1),
    sourceType,
    sourceLabel: name.trim(),
    contentHash
  };
}

/**
 * Extracts and normalizes text from a URL input (web page, Google Drive file, or direct PDF link).
 */
export async function extractFromUrlOrDrive(input: IngestUrlInput): Promise<ExtractedContent> {
  const { url, name } = input;

  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    throw new Error('A valid URL is required.');
  }

  const rawUrl = url.trim();
  const isDriveUrl = /(?:drive|docs)\.google\.com/i.test(rawUrl);

  let text = '';
  let pageCount = 1;
  let sourceLabel = (name && name.trim()) || rawUrl;
  let contentHash = '';
  let sourceType: IngestionSourceType = isDriveUrl ? 'drive' : 'url';

  if (isDriveUrl) {
    const driveResult = await ingestFromDrive(rawUrl);
    if (driveResult.isPdf && driveResult.buffer) {
      const pdfData = await extractTextFromPdfBuffer(driveResult.buffer);
      text = pdfData.text;
      pageCount = pdfData.pageCount;
      contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');
    } else {
      text = driveResult.text;
      pageCount = driveResult.pageCount;
      contentHash = driveResult.contentHash;
    }
    sourceLabel = (name && name.trim()) || driveResult.sourceLabel;
  } else {
    try {
      const urlResult = await ingestFromUrl(rawUrl);
      text = urlResult.text;
      pageCount = urlResult.pageCount;
      contentHash = urlResult.contentHash;
      sourceLabel = (name && name.trim()) || urlResult.sourceLabel;
      sourceType = 'url';
    } catch (err: any) {
      // Direct PDF response signalled by safeFetchUrl
      if (err && typeof err === 'object' && err.isPdf && err.buffer) {
        const pdfData = await extractTextFromPdfBuffer(err.buffer as Buffer);
        text = pdfData.text;
        pageCount = pdfData.pageCount;
        contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');
        sourceLabel = (name && name.trim()) || err.finalUrl || rawUrl;
        sourceType = 'pdf';
      } else {
        throw err;
      }
    }
  }

  if (!text || text.trim().length === 0) {
    throw new Error(`No readable content could be extracted from: ${rawUrl}`);
  }

  return {
    text: text.trim(),
    pageCount,
    sourceType,
    sourceUrl: rawUrl,
    sourceLabel,
    contentHash
  };
}

// ---------------------------------------------------------------------------
// Deduplication & Pipeline Execution
// ---------------------------------------------------------------------------

/**
 * Checks an array of existing documents for a matching content hash.
 */
export function findDuplicateDocument(
  documents: DocumentFile[],
  contentHash: string
): DocumentFile | undefined {
  return documents.find(d => !d.isSample && d.contentHash === contentHash);
}

/**
 * Runs the full ingestion pipeline:
 * 1. Checks for deduplication
 * 2. Creates DocumentFile record
 * 3. Chunks text into DocumentChunk[]
 * 4. Generates embeddings and indexes in DenseVectorStore
 * 5. Persists to Firestore (if configured), rolling back index on error
 */
export async function executeIngestion(
  extracted: ExtractedContent,
  category: DocumentCategory = 'Other',
  existingDocs: DocumentFile[] = []
): Promise<IngestionResult> {
  // Deduplication check
  const duplicate = findDuplicateDocument(existingDocs, extracted.contentHash);
  if (duplicate) {
    return {
      document: duplicate,
      chunks: [],
      isDuplicate: true,
      message: `This document is identical to an already-indexed file: "${duplicate.name}".`
    };
  }

  const docId = `doc-${randomUUID()}`;
  const newDoc: DocumentFile = {
    id: docId,
    name: extracted.sourceLabel,
    category,
    pageCount: extracted.pageCount,
    chunkCount: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    isSample: false,
    content: extracted.text,
    sourceType: extracted.sourceType,
    sourceUrl: extracted.sourceUrl,
    contentHash: extracted.contentHash,
    status: 'ready'
  };

  const chunks = await chunkDocumentText(docId, newDoc.name, extracted.text);
  newDoc.chunkCount = chunks.length;

  // Add chunks to DenseVectorStore
  await addChunksToVectorIndex(chunks);

  // Optional Firestore sync with rollback
  try {
    await saveDocumentToFirestore(newDoc, chunks);
  } catch (persistenceError) {
    await deleteChunksFromVectorIndex(docId);
    throw persistenceError;
  }

  return {
    document: newDoc,
    chunks,
    isDuplicate: false
  };
}
