# Data Flow

## End-to-end flow

1. File input: The frontend sends a PDF or text payload to `/api/documents/upload` in [src/App.tsx](../src/App.tsx#L61-L98).
2. Text extraction: The server reads `pdfBase64` and calls `extractTextFromPdfBuffer` in [server.ts](../server.ts#L122-L177) and [src/server/pdfExtractor.ts](../src/server/pdfExtractor.ts#L1-L66).
3. Chunk generation: `chunkDocumentText` splits the extracted text into chunks in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L227-L289).
4. Embedding generation: `attachEmbeddingsToChunks` and `generateDenseEmbeddingsForTexts` produce vectors in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L80-L117).
5. Persistence: Document and chunk metadata are written to Firestore in [src/server/firestoreSync.ts](../src/server/firestoreSync.ts#L17-L68) and to the vector file in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L165-L185).
6. Retrieval: `/api/rag/query` calls `retrieveRelevantChunks` in [server.ts](../server.ts#L198-L291).
7. NLI inference: `verifyClaim` calls `evaluateDeBERTaNLIProbs` in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L381-L448).
8. Score calculation: `calculateReliabilityAndRisk` and `calculateAHSS` compute the verdict summary in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L649-L760).
9. API response: `QueryResponse` is returned from the API in [src/types.ts](../src/types.ts#L75-L109) and [server.ts](../server.ts#L198-L291).
10. Frontend rendering: React displays the data in [src/App.tsx](../src/App.tsx#L118-L157) and component views under [src/components](../src/components).

## Source of important values

- Document ID: generated in the server as `doc-${Date.now()}` in [server.ts](../server.ts#L160-L168).
- File name: from upload input or normalized PDF name.
- Chunk ID: constructed by `chunkDocumentText` using `docId` and index in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L239-L289).
- Page number: from page markers in the file text or from the default of 1.
- Embedding dimensions: 384 by design in [src/server/vectorStore.ts](../src/server/vectorStore.ts#L18-L18).
- Similarity score: computed in `DenseVectorStore.cosineSimilarity` in [src/server/vectorStore.ts](../src/server/vectorStore.ts#L69-L88).
- NLI score: returned by `evaluateDeBERTaNLIProbs` in [src/server/verificationEngine.ts](../src/server/verificationEngine.ts#L381-L448).

## Known gaps

- Some paths still normalize empty extraction into fake text instead of rejecting input.
- The current generation path still contains hardcoded policy text instead of evidence-driven summarization.
- No real end-to-end pipeline test exists to assert every intermediate value is derived from actual uploads.
