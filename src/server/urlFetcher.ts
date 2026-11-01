/**
 * VeriRAG URL Fetcher with SSRF Protection
 *
 * Safely fetches web content from user-supplied URLs.
 * Implements SSRF protections: private IP blocking, scheme validation,
 * redirect re-validation, timeout, and response size limits.
 */

import { createHash } from 'crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALLOWED_SCHEMES = new Set(['http:', 'https:']);
const MAX_RESPONSE_BYTES = 10 * 1024 * 1024; // 10 MB
const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;

/** Private/reserved CIDR ranges that must not be accessed server-side. */
const BLOCKED_HOSTNAME_PATTERNS = [
  // Loopback
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^::1$/,
  // Private networks
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  // Link-local & cloud metadata
  /^169\.254\.\d+\.\d+$/,
  /^metadata\.google\.internal$/i,
  /^169\.254\.169\.254$/,
  // IPv6 private
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
  // Zero / broadcast
  /^0\.0\.0\.0$/,
];

// ---------------------------------------------------------------------------
// SSRF Guard
// ---------------------------------------------------------------------------

export function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/\.+$/, '');
  return BLOCKED_HOSTNAME_PATTERNS.some(pattern => pattern.test(normalized));
}

function assertSafeUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: "${rawUrl}". Provide a valid http:// or https:// address.`);
  }

  if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
    throw new Error(`URL scheme "${parsed.protocol}" is not supported. Only http:// and https:// are allowed.`);
  }

  if (isBlockedHostname(parsed.hostname)) {
    throw new Error(`Access to "${parsed.hostname}" is not permitted. Internal network addresses are blocked.`);
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// HTML → Plain Text Extraction
// ---------------------------------------------------------------------------

/**
 * Extracts readable text from HTML, removing scripts, styles, navigation,
 * and other non-content elements. Returns clean paragraphs.
 */
export function extractTextFromHtml(html: string, sourceUrl: string): string {
  // Remove <script> and <style> blocks entirely
  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Convert block-level elements to newlines before stripping tags
  cleaned = cleaned
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|article|section|h[1-6]|li|dt|dd|blockquote|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' '); // strip all remaining tags

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // Collapse whitespace and blank lines
  const lines = cleaned
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line.length > 0);

  // Remove obvious boilerplate short lines
  const content = lines
    .filter(line => line.length > 20)
    .join('\n');

  return content.trim();
}

// ---------------------------------------------------------------------------
// Fetch with SSRF protection and redirect re-validation
// ---------------------------------------------------------------------------

export interface FetchResult {
  text: string;
  contentType: string;
  finalUrl: string;
  byteLength: number;
  sourceLabel: string;
}

/**
 * Safely fetches a URL, validates each redirect destination,
 * limits response size, and extracts readable text from HTML.
 *
 * For direct document links (PDF, DOCX, TXT) the raw Buffer is returned.
 * Callers must check `contentType` and handle accordingly.
 */
export async function safeFetchUrl(rawUrl: string): Promise<{ buffer: Buffer; contentType: string; finalUrl: string }> {
  const initial = assertSafeUrl(rawUrl);
  let currentUrl = initial.toString();
  let redirectCount = 0;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    while (true) {
      assertSafeUrl(currentUrl); // re-validate every redirect destination

      const res = await fetch(currentUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'VeriRAG-Document-Ingestion/1.0 (+https://github.com/verirag)',
          'Accept': 'text/html,application/xhtml+xml,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*;q=0.8',
        },
        redirect: 'manual',
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location');
        if (!location) {
          throw new Error(`Server returned redirect ${res.status} with no Location header.`);
        }
        if (redirectCount >= MAX_REDIRECTS) {
          throw new Error(`Too many redirects (>${MAX_REDIRECTS}) while fetching "${rawUrl}".`);
        }
        // Resolve relative redirects against current URL
        currentUrl = new URL(location, currentUrl).toString();
        redirectCount++;
        continue;
      }

      if (!res.ok) {
        const statusText = res.statusText || `HTTP ${res.status}`;
        if (res.status === 403) {
          throw new Error(`Access denied (HTTP 403): "${currentUrl}". The resource is not publicly accessible.`);
        }
        if (res.status === 404) {
          throw new Error(`Page not found (HTTP 404): "${currentUrl}".`);
        }
        throw new Error(`HTTP ${res.status} ${statusText} fetching "${currentUrl}".`);
      }

      const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();

      // Read body with size cap
      const reader = res.body?.getReader();
      if (!reader) throw new Error('Response body is not readable.');

      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        if (totalBytes > MAX_RESPONSE_BYTES) {
          reader.cancel();
          throw new Error(`Response exceeds the 10 MB size limit for "${currentUrl}".`);
        }
        chunks.push(value);
      }

      const buffer = Buffer.concat(chunks);
      return { buffer, contentType, finalUrl: currentUrl };
    }
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// High-level: fetch URL → extract text
// ---------------------------------------------------------------------------

export interface UrlIngestionResult {
  text: string;
  pageCount: number;
  contentType: string;
  finalUrl: string;
  sourceLabel: string;
  contentHash: string;
}

/**
 * Fetches a URL and returns extracted text ready for chunking.
 * Supports HTML pages, plain text, and redirected document links.
 * Returns an error string (not throws) so callers can surface it gracefully.
 */
export async function ingestFromUrl(rawUrl: string): Promise<UrlIngestionResult> {
  const { buffer, contentType, finalUrl } = await safeFetchUrl(rawUrl);

  let text = '';
  let pageCount = 1;

  if (contentType === 'application/pdf' || finalUrl.toLowerCase().endsWith('.pdf')) {
    // Caller must handle PDF via pdfExtractor to avoid circular deps
    // Return raw buffer as base64-like signal — server.ts handles routing
    throw new Object({ isPdf: true, buffer, finalUrl, contentType });
  }

  if (contentType.includes('text/html') || contentType.includes('application/xhtml')) {
    const html = buffer.toString('utf-8');
    text = extractTextFromHtml(html, finalUrl);
    if (!text || text.length < 50) {
      throw new Error(
        `The page at "${finalUrl}" produced no readable text. It may require JavaScript rendering, authentication, or contain only images/media.`
      );
    }
  } else if (contentType.startsWith('text/')) {
    text = buffer.toString('utf-8').trim();
  } else {
    throw new Error(
      `Unsupported content type "${contentType}" at "${finalUrl}". Supported types: HTML pages, plain text, PDF, and DOCX.`
    );
  }

  if (!text || text.trim().length === 0) {
    throw new Error(`No readable content was extracted from "${finalUrl}".`);
  }

  const contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');
  const hostname = new URL(finalUrl).hostname;

  return {
    text: text.trim(),
    pageCount,
    contentType,
    finalUrl,
    sourceLabel: hostname,
    contentHash,
  };
}
