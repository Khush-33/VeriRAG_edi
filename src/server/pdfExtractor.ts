import * as pdfParseModule from 'pdf-parse';

/**
 * Extracts raw text content from a PDF Buffer with multiple fallback methods.
 */
export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  let extractedText = '';
  let pageCount = 1;

  // Method 1: standard pdf-parse
  try {
    const pdfParser = (pdfParseModule as any).default || (pdfParseModule as any).pdf || pdfParseModule;
    if (typeof pdfParser === 'function') {
      const parsed = await pdfParser(buffer);
      if (parsed && parsed.text && parsed.text.trim().length > 0) {
        extractedText = parsed.text.trim();
        pageCount = parsed.numpages || 1;
        return { text: extractedText, pageCount };
      }
    }
  } catch (err) {
    console.warn('pdf-parse primary parser failed, switching to stream extractor fallback:', err);
  }

  // Method 2: Fallback PDF text stream scanner for binary stream literals
  try {
    const rawPdfString = buffer.toString('utf-8', 0, Math.min(buffer.length, 5000000));
    
    // Match text blocks inside Tj or TJ operators or parenthesized string literals
    const textMatches: string[] = [];
    const tjRegex = /\(([^()]{2,})\)\s*(?:Tj|TJ|'|")/g;
    let match;
    while ((match = tjRegex.exec(rawPdfString)) !== null) {
      const cleanStr = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (cleanStr.length > 1 && !/^[\x00-\x1F]+$/.test(cleanStr)) {
        textMatches.push(cleanStr);
      }
    }

    if (textMatches.length > 5) {
      extractedText = textMatches.join(' ');
      // Estimate page count by counting /Page object markers
      const pageMatches = rawPdfString.match(/\/Type\s*\/Page\b/g);
      pageCount = pageMatches ? pageMatches.length : 1;
      return { text: extractedText, pageCount };
    }
  } catch (fallbackErr) {
    console.warn('Fallback stream scanner failed:', fallbackErr);
  }

  // Method 3: Clean ASCII printable text extract
  try {
    const asciiText = buffer.toString('ascii')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Filter out PDF header metadata words
    const filteredText = asciiText
      .split(' ')
      .filter(word => word.length > 2 && !/^(obj|endobj|stream|endstream|xref|trailer|startxref)$/i.test(word))
      .join(' ');

    if (filteredText.length > 20) {
      return { text: filteredText, pageCount: 1 };
    }
  } catch (asciiErr) {
    console.warn('ASCII filter failed:', asciiErr);
  }

  return { text: extractedText, pageCount };
}
