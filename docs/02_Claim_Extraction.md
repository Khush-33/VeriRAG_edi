# Claim Extraction Engine

## Overview
Instead of treating the LLM's generated answer as a monolithic block, VeriRAG deconstructs the answer into independent, factual propositions known as "atomic claims". This allows the verification engine to fact-check specific statements rather than evaluating the answer as a whole, ensuring fine-grained hallucination detection.

## Implementation Details

The extraction process is implemented in `src/server/claimExtractor.ts`. Notably, it is implemented using deterministic natural language processing rules and regex rather than relying on another expensive LLM. This satisfies the project's goal of being a lightweight approach.

### Steps in Claim Extraction:
1. **Sentence Splitting**: The text is split into raw sentences using punctuation markers (`.`, `!`, `?`), while preserving common abbreviations (e.g., `Mr.`, `Dr.`, `e.g.`) to prevent premature splitting.
2. **Compound Sentence Deconstruction**: Sentences containing multiple distinct facts are split into standalone claims. The engine detects:
   - Semicolons (`;`)
   - Conjunctions (e.g., `and`, `but`, `while`, `whereas`) where both sides contain verbs or factual assertions.
   - Numbered or bulleted lists within a sentence.
3. **Keyword Extraction**: For each extracted atomic claim, key domain entities and content tokens are extracted by filtering out common stop words. This aids in retrieving the most relevant evidence during the verification phase.

### Example
**Original Answer:**
"Students need a minimum 75% attendance to appear for the examination. Students having 65–75% attendance can pay a fine and appear for the examination."

**Extracted Claims:**
- Claim 1: "Students need a minimum 75% attendance to appear for the examination."
- Claim 2: "Students having 65–75% attendance can pay a fine and appear for the examination."
