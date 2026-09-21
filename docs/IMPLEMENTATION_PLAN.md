# VeriRAG Implementation Plan

## Phase 1 — Audit and reproduce the real issue

- Objective: Confirm how upload, extraction, chunking, indexing, retrieval, and verification behave in the current code.
- Existing problem: The upload route injects fallback text and the verification engine contains fixed output branches.
- Proposed change: Document and reproduce the gap, then fix the real pipeline.
- Files expected to change: [server.ts](../server.ts), [src/server/verificationEngine.ts](../src/server/verificationEngine.ts), [src/server/firestoreSync.ts](../src/server/firestoreSync.ts)
- Dependencies: None beyond repository inspection and runtime validation.
- Risks: None beyond temporary confusion in the sample dataset flow.
- Acceptance criteria: Root cause is proven and logged in docs.
- Test cases: direct function-level checks for empty extraction and hardcoded-answer detection.
- Status: Completed

## Phase 2 — Fix document ingestion and validation

- Objective: Ensure uploaded docs are only accepted when they contain actual extracted text.
- Existing problem: Empty extraction results are replaced with fake text in [server.ts](../server.ts#L148-L159).
- Proposed change: Validate input and throw explicit errors instead of generating placeholder content.
- Files expected to change: [server.ts](../server.ts), [src/server/pdfExtractor.ts](../src/server/pdfExtractor.ts)
- Dependencies: Document parsing and validation must succeed before chunking.
- Risks: Unsupported files may now fail fast.
- Acceptance criteria: Empty or invalid uploads return a clear HTTP 400 error.
- Test cases: empty raw text, empty PDF parse result, valid text upload.
- Status: Completed

## Phase 3 — Fix chunking behavior and metadata

- Objective: Generate real chunks from real extracted text with configurable size and overlap.
- Existing problem: `chunkDocumentText` currently splits only by paragraphs and lacks validation for size/overlap.
- Proposed change: Add safe chunking config with defaults, document ID tracking, and rejection on empty input.
- Files expected to change: [src/server/verificationEngine.ts](../src/server/verificationEngine.ts), [src/types.ts](../src/types.ts)
- Dependencies: Document extraction must produce non-empty text.
- Risks: Large documents may need more than one segment.
- Acceptance criteria: Long documents create multiple chunks with stable IDs and page numbers.
- Test cases: text over chunk size, edge case overlap validation, metadata verification.
- Status: Completed

## Phase 4 — Remove hardcoded or fake answer generation

- Objective: Generate answers from actual retrieved evidence rather than static policy strings.
- Existing problem: `generateLocalRAGAnswer` is hardcoded for attendance/credit/placement/hostel queries in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L312-L340).
- Proposed change: Synthesize a real summary from relevant retrieved text chunks.
- Files expected to change: [src/server/verificationEngine.ts](../src/server/verificationEngine.ts)
- Dependencies: Chunking and retrieval must work first.
- Risks: Some model-generated language may be less polished than the previous hardcoded text.
- Acceptance criteria: Output summarizes retrieved evidence without matching a hardcoded branch.
- Test cases: query with retrieved chunks returning actual evidence text.
- Status: Completed

## Phase 5 — Harden backend and data integrity

- Objective: Prevent silent data loss and hidden fallback states.
- Existing problem: Firestore warnings are swallowed and vector store silently ignores invalid embeddings.
- Proposed change: Raise errors and validate embeddings and persistence results.
- Files expected to change: [src/server/firestoreSync.ts](../src/server/firestoreSync.ts), [src/server/vectorStore.ts](../src/server/vectorStore.ts)
- Dependencies: Document ingestion and chunk creation must be valid.
- Risks: Some errors surface earlier in development, which is desirable.
- Acceptance criteria: Invalid persistence or invalid embedding data is surfaced clearly.
- Test cases: empty embedding list, Firestore permission failure, vector index validation.
- Status: Completed

## Phase 6 — Add automated verification tests

- Objective: Create a minimal but real regression suite for chunking and retrieval behavior.
- Existing problem: The repository contains no test files.
- Proposed change: Add Node-based tests for real chunk generation and answer synthesis.
- Files expected to change: new `tests` directory and package scripts.
- Dependencies: The production code must expose deterministic helpers.
- Risks: Need to keep tests lightweight and independent from heavy ML models.
- Acceptance criteria: chunking and answer synthesis tests pass without mock-only assertions.
- Test cases: valid input, empty input, multiple-chunk output, and answer summarization.
- Status: Completed

## Phase 7 — Documentation and release readiness

- Objective: Keep architecture, data-flow, and runbook docs aligned with the real implementation.
- Existing problem: The repository had no structured docs for the actual code path.
- Proposed change: Create the required docs in [docs](../docs).
- Files expected to change: all docs under [docs](../docs)
- Dependencies: Prior phases complete.
- Risks: Documentation can drift if code evolves without update.
- Acceptance criteria: Docs describe actual commands, data flow, and remaining risks clearly.
- Test cases: doc review for consistency with code.
- Status: Completed

## Phase 8 — Live Firebase and UI verification

- Objective: Verify that the configured named Firestore database stores real documents and chunks and that the UI consumes live API results.
- Existing problem: The old database contained a legacy raw-PDF artifact, and the local vector index could be stale or miss benchmark context chunks.
- Proposed change: Filter unreadable legacy records, detect vector-index/source ID mismatches, add API-backed chunk inspection, and run live health, document, chunk, and benchmark checks.
- Files changed: [src/server/firestoreSync.ts](../src/server/firestoreSync.ts), [src/server/vectorStore.ts](../src/server/vectorStore.ts), [src/server/verificationEngine.ts](../src/server/verificationEngine.ts), [src/components/KnowledgeBase.tsx](../src/components/KnowledgeBase.tsx), [src/components/BenchmarkView.tsx](../src/components/BenchmarkView.tsx), [src/App.tsx](../src/App.tsx)
- Acceptance criteria: Firebase returns real chunk text and metadata; Research metrics come from the benchmark endpoint; no initial fabricated metrics appear in the UI.
- Verification: Named Firestore database returned 4 sample documents and 13 chunks. AcademicDomain benchmark returned computed metrics for all three methods.
- Status: Completed
