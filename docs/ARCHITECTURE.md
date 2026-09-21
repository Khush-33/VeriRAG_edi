# Architecture

## System architecture

```mermaid
flowchart LR
    User[User / Browser] --> UI[React App - src/App.tsx]
    UI --> API[Express API - server.ts]
    API --> Parser[PDF/text extraction]
    API --> Chunker[Chunking & metadata]
    Chunker --> Embed[Embedding generation]
    Embed --> Vector[DenseVectorStore]
    Vector --> Retrieval[retrieveRelevantChunks]
    Retrieval --> Verify[verifyClaim]
    Verify --> Report[Verification report / UI]
    API --> Firestore[Firestore sync]
    Engage[Training scripts] --> Models[Transformers models]
```

## Document ingestion

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant API as Express API
    participant PDF as PDF Parser
    participant CH as Chunking Logic
    participant IDX as Vector Store
    participant FB as Firestore
    U->>FE: Upload PDF or text
    FE->>API: POST /api/documents/upload
    API->>PDF: extractTextFromPdfBuffer
    PDF-->>API: raw extracted text
    API->>CH: chunkDocumentText(docId, docName, text)
    CH-->>API: DocumentChunk[]
    API->>IDX: addChunksToVectorIndex
    API->>FB: saveDocumentToFirestore
    API-->>FE: success payload
```

## Claim verification

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React UI
    participant API as Express API
    participant RET as Retrieval Engine
    participant CLA as Claim Extractor
    participant NLI as DeBERTa NLI
    participant AHSS as Scoring Engine
    U->>FE: Ask verification question
    FE->>API: POST /api/rag/query
    API->>RET: retrieveRelevantChunks
    RET-->>API: relevant evidence
    API->>CLA: extractAtomicClaims
    CLA-->>API: atomic claims
    API->>NLI: verifyClaim
    NLI-->>API: verdict, scores
    API->>AHSS: calculateReliabilityAndRisk
    AHSS-->>API: risk, trust, verdict
    API-->>FE: verified answer + evidence
```

## Model/training workflow

```mermaid
flowchart TD
    RAW[Dataset / sample docs] --> PREP[training/dataset.py]
    PREP --> TRAIN[training/train.py]
    TRAIN --> CKPT[Saved model checkpoint]
    CKPT --> EVAL[training/evaluate.py]
    EVAL --> REPORT[Metrics and benchmark output]
    APP[Runtime app] --> MODELS[Transformers runtime models: all-MiniLM-L6-v2 / nli-deberta-v3-small]
```

## Boundaries

- Frontend is React/Vite; it is not the authoritative data store.
- Express API is the authority for upload and query orchestration.
- Firestore is persistence, but vector indexing is local in-memory plus JSON file persistence.
- Training scripts are separate from the runtime inference pipeline and should not be confused with deployed model status.

## Dependencies

- React 19, Vite 6, Express 4, Firebase 12, pdf-parse 2, @xenova/transformers 2.17.
- Runtime models are downloaded on demand by the transformers package.
