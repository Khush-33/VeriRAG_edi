/**
 * VeriRAG Google Drive Ingestion Adapter
 *
 * Handles publicly accessible Google Drive file and Docs links.
 * Extracts file ID, chooses the correct download/export endpoint,
 * and fetches file content safely through the URL fetcher.
 */

import { safeFetchUrl } from './urlFetcher';
import { createHash } from 'crypto';

// ---------------------------------------------------------------------------
// Drive URL normalization
// ---------------------------------------------------------------------------

/**
 * Supported Google Drive URL patterns:
 *
 *   https://drive.google.com/file/d/{ID}/view
 *   https://drive.google.com/file/d/{ID}/view?usp=sharing
 *   https://drive.google.com/open?id={ID}
 *   https://drive.google.com/uc?id={ID}
 *   https://docs.google.com/document/d/{ID}/edit
 *   https://docs.google.com/document/d/{ID}/view
 *   https://docs.google.com/spreadsheets/d/{ID}/edit
 *   https://docs.google.com/presentation/d/{ID}/edit
 */
export type DriveResourceType = 'file' | 'doc' | 'sheet' | 'slide' | 'unknown';

export interface DriveUrlInfo {
  fileId: string;
  resourceType: DriveResourceType;
  originalUrl: string;
}

const DRIVE_FILE_REGEX = /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/;
const DRIVE_OPEN_REGEX = /drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([A-Za-z0-9_-]+)/;
const DOCS_REGEX = /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]+)/;

export function parseDriveUrl(rawUrl: string): DriveUrlInfo | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!host.endsWith('google.com')) return null;

  // Pattern 1: /file/d/{ID}/...
  const fileMatch = rawUrl.match(DRIVE_FILE_REGEX);
  if (fileMatch) {
    return { fileId: fileMatch[1], resourceType: 'file', originalUrl: rawUrl };
  }

  // Pattern 2: /open?id={ID} or /uc?id={ID}
  const openMatch = rawUrl.match(DRIVE_OPEN_REGEX);
  if (openMatch) {
    return { fileId: openMatch[1], resourceType: 'file', originalUrl: rawUrl };
  }

  // Pattern 3: docs.google.com/{type}/d/{ID}
  const docsMatch = rawUrl.match(DOCS_REGEX);
  if (docsMatch) {
    const [, docType, fileId] = docsMatch;
    const resourceType: DriveResourceType =
      docType === 'document' ? 'doc' :
      docType === 'spreadsheets' ? 'sheet' :
      docType === 'presentation' ? 'slide' : 'unknown';
    return { fileId, resourceType, originalUrl: rawUrl };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Download / export URLs
// ---------------------------------------------------------------------------

/**
 * Returns the best download URL for a given Drive resource.
 *
 * - Binary files (PDF, DOCX, etc.): direct download endpoint
 * - Google Docs → export as plain text
 * - Sheets → export as CSV (then parse as plain text)
 * - Slides → not well supported; attempt export as plain text
 */
function buildDownloadUrl(info: DriveUrlInfo): string {
  switch (info.resourceType) {
    case 'doc':
      return `https://docs.google.com/document/d/${info.fileId}/export?format=txt`;
    case 'sheet':
      return `https://docs.google.com/spreadsheets/d/${info.fileId}/export?format=csv`;
    case 'slide':
      return `https://docs.google.com/presentation/d/${info.fileId}/export/txt`;
    case 'file':
    default:
      // Standard Drive download with confirm bypass for large files
      return `https://drive.google.com/uc?export=download&id=${info.fileId}&confirm=t`;
  }
}

// ---------------------------------------------------------------------------
// High-level ingestion
// ---------------------------------------------------------------------------

export interface DriveIngestionResult {
  text: string;
  pageCount: number;
  contentType: string;
  downloadUrl: string;
  originalUrl: string;
  sourceLabel: string;
  contentHash: string;
  /** true when the content-type indicates a PDF — caller handles PDF extraction */
  isPdf: boolean;
  buffer?: Buffer;
}

/**
 * Fetches a publicly accessible Google Drive resource and returns its text.
 *
 * Throws descriptive errors for private files, unsupported types, and failures.
 */
export async function ingestFromDrive(rawUrl: string): Promise<DriveIngestionResult> {
  const info = parseDriveUrl(rawUrl);
  if (!info) {
    throw new Error(
      `"${rawUrl}" is not a recognized Google Drive URL. ` +
      `Supported formats: /file/d/{ID}/view, /open?id={ID}, docs.google.com/document/d/{ID}/edit`
    );
  }

  const downloadUrl = buildDownloadUrl(info);
  let buffer: Buffer;
  let contentType: string;
  let finalUrl: string;

  try {
    ({ buffer, contentType, finalUrl } = await safeFetchUrl(downloadUrl));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('403') || message.includes('Access denied')) {
      throw new Error(
        `The Google Drive file "${rawUrl}" is not publicly accessible. ` +
        `Please share it with "Anyone with the link" before ingesting.`
      );
    }
    if (message.includes('404')) {
      throw new Error(
        `The Google Drive file "${rawUrl}" was not found. ` +
        `Check that the link is valid and the file has not been deleted.`
      );
    }
    throw new Error(`Failed to fetch Google Drive file: ${message}`);
  }

  // Check if content-type indicates a Google "virus scan" warning page
  const bodyPreview = buffer.slice(0, 512).toString('utf-8');
  if (
    contentType.includes('text/html') &&
    (bodyPreview.includes('Google Drive - Virus scan warning') ||
      bodyPreview.includes('confirm=') ||
      bodyPreview.includes('download_warning'))
  ) {
    throw new Error(
      `Google Drive could not serve the file "${rawUrl}" directly ` +
      `(virus-scan warning page). Try downloading it and uploading it as a local file instead.`
    );
  }

  const isPdf = contentType.includes('application/pdf') ||
    finalUrl.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return {
      text: '',
      pageCount: 1,
      contentType,
      downloadUrl,
      originalUrl: rawUrl,
      sourceLabel: `Google Drive (${info.fileId})`,
      contentHash: '',
      isPdf: true,
      buffer,
    };
  }

  // Parse text content
  let text = '';
  if (
    contentType.startsWith('text/') ||
    contentType.includes('application/json') ||
    contentType.includes('text/csv')
  ) {
    text = buffer.toString('utf-8').trim();
  } else if (contentType.includes('text/html')) {
    // Shouldn't normally happen for export URLs, but handle gracefully
    const { extractTextFromHtml } = await import('./urlFetcher');
    text = extractTextFromHtml(buffer.toString('utf-8'), finalUrl);
  } else {
    throw new Error(
      `Unsupported content type "${contentType}" from Google Drive file "${rawUrl}". ` +
      `Supported: Google Docs (exported as text), PDF, plain text. ` +
      `For DOCX files, download and upload them directly.`
    );
  }

  if (!text || text.trim().length < 30) {
    throw new Error(
      `The Google Drive document "${rawUrl}" produced no readable text. ` +
      `Ensure the document contains actual text content.`
    );
  }

  const contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');

  return {
    text: text.trim(),
    pageCount: Math.max(1, Math.ceil(text.length / 3000)),
    contentType,
    downloadUrl,
    originalUrl: rawUrl,
    sourceLabel: `Google Drive (${info.fileId})`,
    contentHash,
    isPdf: false,
  };
}
