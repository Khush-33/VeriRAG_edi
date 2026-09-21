# Architecture Decision Records

## ADR-001: Use an Express API in front of a React client

- Date: 2026-09-21
- Status: Accepted
- Context: The repo contains a React frontend and a Node/Express backend that share one repository but are separated by route boundaries.
- Options considered: all-in-one Vite app, full backend service, single Node SSR app.
- Decision: Keep the API and frontend separated while running Vite dev middleware for local development.
- Reasons: The code already uses both React and Express and the system isolates the ML pipeline from the UI.
- Consequences: More moving parts, but explicit API boundaries and easier debugging.
- Alternatives rejected: one-size monolith, purely static UI.
- Migration implications: Add endpoints and types carefully to support future backend decoupling.

## ADR-002: Use a local dense vector store with JSON persistence

- Date: 2026-09-21
- Status: Accepted
- Context: The project needs retrieval over uploaded documents without enterprise infrastructure.
- Options considered: FAISS, Pinecone, Firebase Firestore vector extension, local in-memory store.
- Decision: Use a local cosine-similarity vector store saved to `.vector_store.json` and keep Firestore for metadata.
- Reasons: Works in a lightweight repo and is easy to inspect and validate.
- Consequences: Not production-scale, requires explicit reintegration for large workloads.
- Alternatives rejected: external managed vector DB due to project simplicity and lack of environment setup.
- Migration implications: Later swap with FAISS or a managed index without changing the `IVectorDatabase` interface.

## ADR-003: Use Transformers.js models for runtime inference

- Date: 2026-09-21
- Status: Accepted
- Context: The repo intends to perform real embedding and NLI inference in browser/server-safe JavaScript.
- Options considered: Python-only pipeline, hosted API, custom frontend-only model.
- Decision: Use Xenova/Transformers.js in the Node server for embeddings and NLI.
- Reasons: Already implemented and matched to the project architecture.
- Consequences: Runtime model downloads and CPU memory needs are real constraints.
- Alternatives rejected: remote LLM API due to lack of credentials and external dependency.
- Migration implications: Any model switch must update model IDs and embedding dimensions.

## ADR-004: Keep benchmark and demo datasets isolated from live ingestion

- Date: 2026-09-21
- Status: Proposed
- Context: The app contains benchmark corpus data and sample academic documents; they must not be conflated with live user uploads.
- Decision: Proposed: keep benchmark data behind explicit benchmark actions and sample docs behind explicit UI actions only.
- Reasons: Required to avoid reporting demo or benchmark content as live user evidence.
- Consequences: Additional UI and logic guard rails are needed.
- Alternatives rejected: automatic loading of sample docs on startup.
- Migration implications: Future workflows should preserve explicit data source labeling.

## ADR-005: Reject empty extraction rather than synthesize placeholder text

- Date: 2026-09-21
- Status: Proposed
- Context: The app currently creates bogus text when parsing fails, which defeats the research pipeline.
- Decision: Proposed: reject empty or invalid extracted text with a clear error and do not create fake content.
- Reasons: This preserves traceability and prevents false evidence.
- Consequences: Unsupported uploads fail fast instead of producing a misleading document.
- Alternatives rejected: deterministic placeholder text generation.
- Migration implications: UI and API consumers must display a proper error message.
