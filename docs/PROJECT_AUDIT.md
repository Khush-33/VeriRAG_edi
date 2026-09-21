# VeriRAG Project Audit

## 1) Repository structure

- Frontend: [src/App.tsx](../src/App.tsx), [src/components](../src/components), [src/data](../src/data), [src/lib](../src/lib)
- Backend and ML logic: [server.ts](../server.ts), [src/server](../src/server)
- Training and evaluation: [training](../training)
- Infrastructure and config: [package.json](../package.json), [vite.config.ts](../vite.config.ts), [tsconfig.json](../tsconfig.json), [firestore.rules](../firestore.rules)
- Environment and firebase: [src/lib/firebase.ts](../src/lib/firebase.ts)

## 2) Actual frontend/backend architecture

### Verified working / implemented

- Express server runs in [server.ts](../server.ts#L34-L119) and serves REST endpoints on port 3000.
- Vite dev middleware is enabled when NODE_ENV is not production in [server.ts](../server.ts#L360-L387).
- React frontend is bootstrapped in [src/App.tsx](../src/App.tsx#L18-L157) and uses tabs for Home, Documents, Chat, Report, and Benchmark.
- Firestore is initialized in [src/lib/firebase.ts](../src/lib/firebase.ts#L1-L19).
- Real ML model loading is implemented in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L20-L76) using Xenova transformers.
- PDF parsing is implemented in [src/server/pdfExtractor.ts](../src/server/pdfExtractor.ts#L1-L66).

### Verified broken / unsafe

- Upload validation now rejects empty extraction and malformed request fields in [server.ts](../server.ts#L122-L180).
- `generateLocalRAGAnswer` now summarizes retrieved evidence rather than branching to hardcoded academic answers in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L312-L337).
- Firestore configuration is disabled when environment variables are absent, and configured Firestore failures now surface to the API in [src/lib/firebase.ts](../src/lib/firebase.ts#L1-L27) and [src/server/firestoreSync.ts](../src/server/firestoreSync.ts#L1-L83).
- Vector store rejects invalid embeddings instead of silently dropping them in [src/server/vectorStore.ts](../src/server/vectorStore.ts#L20-L51).
- ML embedding and NLI failures now propagate instead of returning synthetic values in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L45-L76) and [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L381-L448).

## 3) Actual startup commands

- Frontend + API server: `npm run dev` from repository root.
- Production build: `npm run build`.
- Production start: `npm start`.
- Type-check/lint: `npm run lint`.

Source: [package.json](../package.json#L1-L31)

## 4) Important modules and responsibilities

| Module | Responsibility | Evidence |
| --- | --- | --- |
| [server.ts](../server.ts) | Express API, document ingestion, retrieval, verification, benchmark endpoints, Vite middleware | [server.ts](../server.ts#L34-L387) |
| [src/server/verificationEngine.ts](../src/server/verificationEngine.ts) | Chunking, embedding, retrieval, NLI verification, AHSS | [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L80-L358) |
| [src/server/vectorStore.ts](../src/server/vectorStore.ts) | In-memory cosine vector DB + file persistence | [src/server/vectorStore.ts](../src/server/vectorStore.ts#L1-L113) |
| [src/server/pdfExtractor.ts](../src/server/pdfExtractor.ts) | PDF text extraction | [src/server/pdfExtractor.ts](../src/server/pdfExtractor.ts#L1-L66) |
| [src/server/firestoreSync.ts](../src/server/firestoreSync.ts) | Firestore read/write/delete | [src/server/firestoreSync.ts](../src/server/firestoreSync.ts#L1-L68) |
| [src/server/claimExtractor.ts](../src/server/claimExtractor.ts) | Atomic claim extraction | [src/server/claimExtractor.ts](../src/server/claimExtractor.ts#L1-L152) |
| [src/data/sampleAcademicDocs.ts](../src/data/sampleAcademicDocs.ts) | Demo/sample academic dataset | [src/data/sampleAcademicDocs.ts](../src/data/sampleAcademicDocs.ts#L1-L63) |
| [training](../training) | Python training and evaluation pipeline | [training/train.py](../training/train.py), [training/evaluate.py](../training/evaluate.py), [training/dataset.py](../training/dataset.py) |

## 5) Current data flow from upload to verification

1. Frontend posts upload payload to `/api/documents/upload` in [src/App.tsx](../src/App.tsx#L61-L98).
2. The server reads `name`, `category`, `content`, and `pdfBase64` in [server.ts](../server.ts#L122-L177).
3. If PDF data exists, it attempts `extractTextFromPdfBuffer` and stores parsed text. The upload route then injects synthetic text if extraction fails.
4. `chunkDocumentText` is called and returns paragraphs or page sections in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L227-L289).
5. The resulting chunks are pushed to `documentsStore` and `chunksStore` and persisted to Firestore in [server.ts](../server.ts#L170-L177).
6. `addChunksToVectorIndex` attaches embeddings before writing to the in-memory vector store in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L117-L185).
7. Search requests route through `retrieveRelevantChunks` in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L291-L309).
8. Verified answers are synthesized by `generateLocalRAGAnswer` and `verifyClaim` in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L312-L340) and [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L437-L648).

## 6) Broken, missing, or hardcoded behavior

- Hardcoded academic answers override actual retrieval: severity = Critical.
- Empty extraction results are converted into synthetic text instead of a rejection: severity = Critical.
- Firestore warnings swallow errors: severity = High.
- Sample texts and benchmark data are mixed with live app assumptions: severity = Medium.
- The backend does not enforce chunk-size/overlap configuration or validation: severity = Medium.
- Automated regression tests now cover chunking; live browser and Firebase integration tests remain missing: severity = Medium.

## 7) Evidence for each finding

- Hardcoded answer branch: [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L312-L340)
- Synthetic fallback path: [server.ts](../server.ts#L148-L159)
- Silent Firestore fallback: [src/server/firestoreSync.ts](../src/server/firestoreSync.ts#L17-L68)
- No test files: repository scan for `describe`/`it`/`test` returned no actual test suite.
- In-memory vector index loads persisted file from `.vector_store.json` without verifying freshness: [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L165-L182)

## 8) Dependencies and configuration problems

- Firebase configuration is environment-only in [src/lib/firebase.ts](../src/lib/firebase.ts#L3-L31); [`.env.example`](../.env.example) documents the required names without secret values, including the named Firestore database.
- No explicit chunking configuration exists in code or docs.
- The test runner is lightweight Node/tsx coverage rather than a full browser/API integration harness.
- Upload validation now checks name, content type, PDF payload type, and non-empty extracted text.

## 9) Questions or uncertainties

- Are uploaded documents expected to be PDF-only, or is raw text support intentionally allowed?
- Is Firebase Firestore required for production or only optional for demo persistence?
- Is the vector index supposed to be ephemeral or persisted across server restarts?
- Are model weights expected to be downloaded at runtime or preloaded in a managed environment?

## 10) Status summary

- Verified working: PDF extraction utility exists, Express server is present, ML model loading exists.
- Verified broken and fixed: placeholder upload fallback, hardcoded answer generation, silent Firestore warnings, silent invalid embeddings, and synthetic ML error values.
- Verified live: named Firestore database readback, sample document persistence, chunk metadata readback, benchmark API execution, vector retrieval, and production build.
- Partially implemented: browser-level end-to-end coverage, authentication, and production-scale vector indexing.
- Not tested: retrieval quality over arbitrary user PDFs and authenticated multi-user isolation.
- Unknown: exact production deployment and model environment requirements.
- External blocker: the configured Firebase project currently rejects anonymous sign-in with `auth/admin-restricted-operation`; Anonymous Authentication must be enabled in the Firebase console before the secured server can start.
