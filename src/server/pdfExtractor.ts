import { PDFParse } from 'pdf-parse';

/**
 * Extracts raw text content from a PDF Buffer with multiple fallback methods.
 */
export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  if (!buffer || buffer.length === 0) {
    throw new Error('The uploaded PDF is empty.');
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const parsed = await parser.getText();
    const pages = parsed.pages
      .map((page, index) => {
        const pageText = page.text?.trim();
        return pageText ? `[Page ${index + 1}]\n${pageText}` : '';
      })
      .filter(Boolean);
    const text = pages.join('\n\n').trim();

    if (!text) {
      throw new Error('The PDF contains no extractable text. Scanned PDFs require OCR before upload.');
    }

    return { text, pageCount: parsed.total || pages.length || 1 };
  } catch (err) {
    throw new Error(`PDF text extraction failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    await parser.destroy();
  }
}
