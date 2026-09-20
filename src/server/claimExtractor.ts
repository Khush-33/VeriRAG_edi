/**
 * VeriRAG Atomic Claim Extraction Engine
 * 
 * Deconstructs raw LLM-generated sentences into atomic factual propositions.
 * Compound sentences containing multiple distinct facts are split into standalone claims.
 */

export interface AtomicClaim {
  id: string;
  claimText: string;
  originalSentence: string;
  claimIndex: number;
  subjectContext?: string;
  keywords: string[];
}

const ABBREVIATION_PATTERN = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|inc|ltd|co|corp|e\.g|i\.e|vs|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\./gi;

function protectAbbreviations(text: string): string {
  return text.replace(ABBREVIATION_PATTERN, (match) => match.replace('.', '_DOT_'));
}

function restoreAbbreviations(text: string): string {
  return text.replace(/_DOT_/g, '.');
}

/**
 * Extracts atomic claims from generated answer text.
 */
export function extractAtomicClaims(text: string): AtomicClaim[] {
  if (!text || text.trim().length === 0) return [];

  const protectedText = protectAbbreviations(text);
  
  // Primary sentence splitting on . ! ?
  const rawSentences = protectedText
    .split(/(?<=[.!?])\s+/)
    .map(s => restoreAbbreviations(s).trim())
    .filter(s => s.length > 3);

  const claims: AtomicClaim[] = [];
  let claimCounter = 1;
  let lastSubject = '';

  for (const sentence of rawSentences) {
    const subClauses = splitCompoundSentence(sentence);

    for (let i = 0; i < subClauses.length; i++) {
      let clauseText = subClauses[i].trim();

      // Clean up leading conjunctions
      clauseText = clauseText
        .replace(/^(and|but|while|whereas|however|furthermore|in addition|also|moreover)\s+/i, '')
        .trim();

      if (clauseText.length < 5) continue;

      // Ensure clause starts with capital letter
      clauseText = clauseText.charAt(0).toUpperCase() + clauseText.slice(1);

      // Extract subject context if pronoun is used
      if (/^(he|she|it|they|this|these|those)\b/i.test(clauseText) && lastSubject) {
        // e.g. "It is located in..." -> "The restaurant is located in..."
        // Preserve readable claim
      }

      // Track main subject noun phrase
      const subjectMatch = clauseText.match(/^([A-Z][a-z0-9_\-\s]{2,25})\s+(is|are|was|were|has|have|had|requires|states|provides|includes|costs)/);
      if (subjectMatch) {
        lastSubject = subjectMatch[1];
      }

      const keywords = extractKeywords(clauseText);

      claims.push({
        id: `claim-${claimCounter++}`,
        claimText: clauseText,
        originalSentence: sentence,
        claimIndex: claims.length + 1,
        keywords
      });
    }
  }

  return claims;
}

/**
 * Splits a compound sentence into separate atomic propositions.
 */
function splitCompoundSentence(sentence: string): string[] {
  // Pattern 1: Semicolon split
  if (sentence.includes(';')) {
    const parts = sentence.split(';').map(p => p.trim()).filter(p => p.length > 5);
    if (parts.length > 1) {
      return parts.flatMap(p => splitCompoundSentence(p));
    }
  }

  // Pattern 2: "X and Y" or "X, while Y" or "X, whereas Y" where both sides contain verbs/facts
  const conjunctionRegex = /\s*(?:,\s*(?:and|but|while|whereas|however|additionally)|(?:\s+and\s+|\s+while\s+|\s+whereas\s+))\s*/i;

  if (conjunctionRegex.test(sentence)) {
    const chunks = sentence.split(conjunctionRegex).map(c => c.trim()).filter(c => c.length > 8);
    // Verify each chunk has a verb or numerical assertion
    const allHaveVerbs = chunks.every(c => /\b(is|are|was|were|has|have|had|can|may|must|will|would|could|should|died|located|serves|requires|filed|reported|gives|contains|incurs|leads|pays|pay|[0-9]+%?)\b/i.test(c));

    if (chunks.length > 1 && allHaveVerbs) {
      return chunks;
    }
  }

  // Pattern 3: Numbered or bullet lists within sentence (e.g., "1) ... 2) ...")
  if (/\b(?:1\)|2\)|3\)|\(1\)|\(2\)|\(3\))\s+/.test(sentence)) {
    const listParts = sentence.split(/\b(?:1\)|2\)|3\)|\(1\)|\(2\)|\(3\))\s+/).map(p => p.trim()).filter(p => p.length > 5);
    if (listParts.length > 1) return listParts;
  }

  return [sentence];
}

/**
 * Extracts key domain entities and content tokens from a claim.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'to', 'from', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just',
    'don', 'should', 'now'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s\$\%\.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}
