/**
 * VeriRAG DOCX Text Extractor
 *
 * Extracts plain text from .docx files using mammoth.
 * mammoth converts the OOXML content to readable paragraphs
 * without requiring native binaries.
 */

import mammoth from 'mammoth';
import { createHash } from 'crypto';

export interface DocxExtractionResult {
  text: string;
  pageCount: number;
  contentHash: string;
}

/**
 * Extracts readable text from a DOCX file Buffer.
 *
 * @param buffer - Raw bytes of the .docx file
 * @returns Extracted plain text with paragraph breaks
 */
export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<DocxExtractionResult> {
  if (!buffer || buffer.length === 0) {
    throw new Error('The uploaded DOCX file is empty.');
  }

  let result: { value: string; messages: any[] };
  try {
    result = await mammoth.extractRawText({ buffer });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`DOCX extraction failed: ${message}. Ensure the file is a valid .docx document.`);
  }

  const text = (result.value || '').trim();

  if (!text || text.length === 0) {
    throw new Error(
      'The DOCX file contains no extractable text. It may be empty, contain only images, or use a format not supported by the extractor.'
    );
  }

  // Log any mammoth warnings (e.g., unsupported features) but do not fail
  if (result.messages && result.messages.length > 0) {
    const warnings = result.messages
      .filter((m: any) => m.type === 'warning')
      .map((m: any) => m.message)
      .slice(0, 3);
    if (warnings.length > 0) {
      console.warn('[DOCX Extractor] Warnings:', warnings.join('; '));
    }
  }

  // Estimate page count: roughly 3000 chars per page for a standard DOCX
  const pageCount = Math.max(1, Math.ceil(text.length / 3000));
  const contentHash = createHash('sha256').update(text, 'utf-8').digest('hex');

  return { text, pageCount, contentHash };
}
