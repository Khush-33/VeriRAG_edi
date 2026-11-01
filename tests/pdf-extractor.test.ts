import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractTextFromPdfBuffer } from '../src/server/pdfExtractor';

describe('PDF Extractor', () => {
  it('rejects an empty buffer with a clear error', async () => {
    await assert.rejects(
      async () => {
        await extractTextFromPdfBuffer(Buffer.alloc(0));
      },
      /empty/i
    );
  });

  it('rejects an invalid corrupted PDF buffer with descriptive error', async () => {
    await assert.rejects(
      async () => {
        await extractTextFromPdfBuffer(Buffer.from('not a valid pdf content header'));
      },
      /PDF text extraction failed/i
    );
  });
});
