# Changelog

## Unreleased

- Removed initial hardcoded Research metrics and benchmark cases from the UI state.
- Added expandable API-backed chunk inspection to the Documents tab.
- Added vector index freshness checks and benchmark-context indexing before retrieval.
- Added live Firebase validation for the configured named database: 4 documents and 13 chunks read back successfully.
- Added live AcademicDomain benchmark validation with computed metrics and measured latency.
- Normalized legacy Report/Research slate utility classes to the shared zinc theme.
- Secured Firestore rules and added authenticated anonymous Firebase startup for the current single-user deployment mode.
- Routed document and benchmark API failures into the shared UI error banner.
- Added concise startup diagnostics for Firebase Anonymous Authentication being disabled.
- Fixed the evaluation notebook to validate the fine-tuned checkpoint before tokenizer loading and use the slow DeBERTa tokenizer when needed.
- Added `sentencepiece` to training requirements and corrected the dataset path/normalization for the repository RAGTruth fixture.
- Hardened uploads, Firestore, vector validation, and ML error handling.
- Removed embedded Firebase fallback configuration and added [`.env.example`](../.env.example).
- Added collision-resistant document IDs and runtime request type validation.
- Tests executed: `npm test`, `npm run lint`, and `npm run build`; all completed successfully after the prior chunking fix.
- Created initial project audit in [docs/PROJECT_AUDIT.md](PROJECT_AUDIT.md).
- Created implementation plan in [docs/IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
- Documented architecture and data flow in [docs/ARCHITECTURE.md](ARCHITECTURE.md) and [docs/DATA_FLOW.md](DATA_FLOW.md).
- Added design and ADR records in [docs/DESIGN.md](DESIGN.md) and [docs/DECISIONS.md](DECISIONS.md).
- Added API, database schema, testing, runbook, and changelog docs.

## Current issues recorded

- No real automated testing layer exists yet.
- Browser-level end-to-end coverage and live Firebase validation remain outstanding.

## Intended follow-up

- Fix upload validation and empty-text rejection.
- Implement configurable chunking with metadata validation.
- Remove hardcoded answer branches and use evidence-driven synthesis.
- Add a minimal real regression suite for chunking and retrieval.
