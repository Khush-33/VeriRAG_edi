import { PDFParse } from 'pdf-parse';

/**
 * Extracts raw text content and page markers from a PDF Buffer using pdf-parse v2.
 */
export async function extractTextFromPdfBuffer(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  if (!buffer || buffer.length === 0) {
    throw new Error('The uploaded PDF is empty.');
  }

  let parser: PDFParse | undefined;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    const pageCount = result.total || 1;
    const pages = (result.pages || [])
      .map(page => {
        const trimmed = (page.text || '').trim();
        return trimmed ? `[Page ${page.num}]\n${trimmed}` : '';
      })
      .filter(Boolean);

    const text = pages.length > 0 ? pages.join('\n\n').trim() : (result.text || '').trim();

    if (!text) {
      throw new Error(
        'The PDF contains no extractable text. Scanned PDFs require OCR before upload.'
      );
    }

    return { text, pageCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`PDF text extraction failed: ${message}`);
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
