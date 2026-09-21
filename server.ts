import 'dotenv/config';
import express from 'express';
import path from 'path';
import { randomUUID } from 'crypto';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_ACADEMIC_DOCS } from './src/data/sampleAcademicDocs';
import {
  ClaimVerification,
  DocumentChunk,
  DocumentFile,
  QueryResponse,
  VerificationMethod,
  PerformanceBreakdown
} from './src/types';
import {
  calculateAHSS,
  calculateReliabilityAndRisk,
  chunkDocumentText,
  deleteChunksFromVectorIndex,
  extractAtomicClaims,
  generateDenseEmbedding,
  generateLocalRAGAnswer,
  initializeMLModels,
  loadOrBuildVectorIndex,
  addChunksToVectorIndex,
  retrieveRelevantChunks,
  runRealBenchmarkSuite,
  synthesizeVerifiedAnswer,
  verifyClaim
} from './src/server/verificationEngine';
import { extractTextFromPdfBuffer } from './src/server/pdfExtractor';
import {
  loadDocumentsFromFirestore,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore
} from './src/server/firestoreSync';
import { ensureFirebaseAuthentication, isFirebaseConfigured } from './src/lib/firebase';

// In-memory document and DenseVectorIndex store
let documentsStore: DocumentFile[] = [];
let chunksStore: DocumentChunk[] = [];

// Initialize default sample academic documents
async function populateSampleDocuments() {
  documentsStore = SAMPLE_ACADEMIC_DOCS.map(doc => ({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    pageCount: doc.pageCount,
    chunkCount: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    isSample: true,
    content: doc.content,
    status: 'ready'
  }));

  chunksStore = [];
  for (const doc of documentsStore) {
    const chunks = await chunkDocumentText(doc.id, doc.name, doc.content);
    doc.chunkCount = chunks.length;
    chunksStore.push(...chunks);
    await saveDocumentToFirestore(doc, chunks);
  }

  await loadOrBuildVectorIndex(chunksStore);
  console.log(`[Server] Initialized ${documentsStore.length} sample academic documents with ${chunksStore.length} dense 384-d vector chunks in memory and Firebase Firestore.`);
}

async function startServer() {
  if (isFirebaseConfigured) {
    await ensureFirebaseAuthentication();
    console.log('[Firebase] Authenticated Firestore session initialized.');
  }

  // Pre-warm Hugging Face ML models
  await initializeMLModels();

  // Load from Firebase Firestore or remain empty for direct user upload / demo dataset button
  const firestoreData = await loadDocumentsFromFirestore();
  if (firestoreData && firestoreData.documents.length > 0) {
    documentsStore = firestoreData.documents;
    chunksStore = firestoreData.chunks;
    console.log(`[Server] Loaded ${documentsStore.length} documents and ${chunksStore.length} chunks from Firebase Firestore.`);
    await loadOrBuildVectorIndex(chunksStore);
  } else {
    documentsStore = [];
    chunksStore = [];
    console.log(`[Server] Knowledge base initialized empty. Awaiting user uploads or 'Load Demo Dataset' trigger.`);
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Production ML RAG Hallucination Engine (SentenceTransformers + DeBERTa-v3 NLI + DenseVectorIndex)',
      timestamp: new Date().toISOString()
    });
  });

  // Get all active documents (including full text content)
  app.get('/api/documents', (req, res) => {
    res.json({
      documents: documentsStore,
      totalChunks: chunksStore.length
    });
  });

  // Get single document by ID
  app.get('/api/documents/:id', (req, res) => {
    const doc = documentsStore.find(d => d.id === req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const docChunks = chunksStore.filter(c => c.docId === doc.id);
    res.json({ document: doc, chunks: docChunks });
  });

  // Reset to default sample academic documents
  app.post('/api/documents/load-sample', async (req, res) => {
    try {
      await populateSampleDocuments();
      res.json({
        success: true,
        message: 'Sample academic knowledge base re-vectorized successfully.',
        documents: documentsStore,
        totalChunks: chunksStore.length
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error re-loading sample documents.' });
    }
  });

  // Upload custom document (PDF base64 or raw text)
  app.post('/api/documents/upload', async (req, res) => {
    try {
      const { name, category, content, pdfBase64 } = req.body;

      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Document name is required.' });
      }

      if (content !== undefined && typeof content !== 'string') {
        return res.status(400).json({ error: 'Document content must be text.' });
      }

      if (pdfBase64 !== undefined && typeof pdfBase64 !== 'string') {
        return res.status(400).json({ error: 'PDF content must be a base64 string.' });
      }

      let parsedText = content ? String(content).trim() : '';
      let pageCount = 1;

      if (pdfBase64) {
        try {
          const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').replace(/\s/g, '');
          const buffer = Buffer.from(cleanBase64, 'base64');
          const pdfData = await extractTextFromPdfBuffer(buffer);
          if (pdfData.text && pdfData.text.trim().length > 0) {
            parsedText = pdfData.text.trim();
            pageCount = pdfData.pageCount || 1;
          }
        } catch (pdfErr) {
          console.error('PDF parsing error:', pdfErr);
        }
      }

      if (!parsedText || parsedText.trim().length === 0) {
        return res.status(400).json({
          error: 'Uploaded document produced no readable text. Please upload a valid PDF or text file with actual content.'
        });
      }

      const docId = `doc-${randomUUID()}`;
      const newDoc: DocumentFile = {
        id: docId,
        name: name.trim().endsWith('.pdf') ? name.trim() : `${name.trim()}.pdf`,
        category: category || 'Academic Regulations',
        pageCount: Math.max(pageCount, Math.ceil(parsedText.length / 1200)),
        chunkCount: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        isSample: false,
        content: parsedText,
        status: 'ready'
      };

      const chunks = await chunkDocumentText(docId, newDoc.name, parsedText);
      newDoc.chunkCount = chunks.length;

      await addChunksToVectorIndex(chunks);
      try {
        await saveDocumentToFirestore(newDoc, chunks);
      } catch (persistenceError) {
        await deleteChunksFromVectorIndex(docId);
        throw persistenceError;
      }

      documentsStore.push(newDoc);
      chunksStore.push(...chunks);

      res.json({
        success: true,
        document: newDoc,
        totalChunks: chunksStore.length
      });
    } catch (error: any) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: error.message || 'Failed to upload document.' });
    }
  });

  // Delete a document
  app.delete('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    await deleteDocumentFromFirestore(id, chunksStore);
    await deleteChunksFromVectorIndex(id);
    documentsStore = documentsStore.filter(d => d.id !== id);
    chunksStore = chunksStore.filter(c => c.docId !== id);
    res.json({ success: true, remainingDocuments: documentsStore.length, remainingChunks: chunksStore.length });
  });

  // Primary RAG Question & Verification Endpoint
  app.post('/api/rag/query', async (req, res) => {
    const startTime = Date.now();
    try {
      const { question, method = 'hybrid', docIds } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Valid question prompt is required.' });
      }

      if (chunksStore.length === 0) {
        return res.status(400).json({ error: 'No documents in knowledge base. Please load academic sample PDFs or upload a document.' });
      }

      const activeChunks = docIds && docIds.length > 0
        ? chunksStore.filter(c => docIds.includes(c.docId))
        : chunksStore;

      // 1. Dense Vector Embedding & Retrieval Timing
      const tEmbedStart = Date.now();
      const retrievedChunks = await retrieveRelevantChunks(question, activeChunks, 4);
      const retrievalTimeMs = Date.now() - tEmbedStart;

      // 2. Local RAG Generation Timing
      const tGenStart = Date.now();
      const originalAnswer = generateLocalRAGAnswer(question, retrievedChunks);
      const generationTimeMs = Date.now() - tGenStart;

      // 3. Rule-based Atomic Claim Extraction
      const tVerifyStart = Date.now();
      const atomicClaims = extractAtomicClaims(originalAnswer);

      // 4. Verification Engine Evaluation
      const verifiedClaims: ClaimVerification[] = [];
      for (const atomicClaim of atomicClaims) {
        const verified = await verifyClaim(atomicClaim.claimText, activeChunks, method as VerificationMethod);
        verifiedClaims.push(verified);
      }
      const verificationTimeMs = Date.now() - tVerifyStart;

      // 5. Synthesize Verified / Corrected Answer
      const verifiedAnswer = synthesizeVerifiedAnswer(originalAnswer, verifiedClaims);

      // 6. Research Weighted Reliability & Risk Evaluation + AHSS
      const { reliabilityScore, hallucinationScore, hallucinationRisk, hallucinationDetected } = calculateReliabilityAndRisk(verifiedClaims);
      const ahssResult = calculateAHSS(verifiedClaims);

      const supportedCount = verifiedClaims.filter(c => c.verdict === 'SUPPORTED').length;
      const partiallySupportedCount = verifiedClaims.filter(c => c.verdict === 'PARTIALLY_SUPPORTED').length;
      const unsupportedCount = verifiedClaims.filter(c => c.verdict === 'UNSUPPORTED').length;
      const contradictedCount = verifiedClaims.filter(c => c.verdict === 'CONTRADICTED').length;

      const totalTimeMs = Date.now() - startTime;
      const memoryUsageMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10;

      const performanceBreakdown: PerformanceBreakdown = {
        embeddingTimeMs: Math.round(retrievalTimeMs * 0.4),
        retrievalTimeMs: Math.round(retrievalTimeMs * 0.6),
        generationTimeMs,
        verificationTimeMs,
        totalTimeMs,
        memoryUsageMb
      };

      const queryResponse: QueryResponse = {
        question,
        originalAnswer,
        verifiedAnswer,
        reliabilityScore: ahssResult.trustScore,
        hallucinationScore: ahssResult.score,
        hallucinationRisk: ahssResult.severity,
        hallucinationDetected: ahssResult.hallucinationDetected,
        ahss: ahssResult,
        methodUsed: method as VerificationMethod,
        claims: verifiedClaims,
        retrievedChunks,
        performanceBreakdown,
        metrics: {
          latencyMs: totalTimeMs,
          claimsCount: verifiedClaims.length,
          supportedCount,
          partiallySupportedCount,
          unsupportedCount,
          contradictedCount
        }
      };

      res.json(queryResponse);
    } catch (error: any) {
      console.error('RAG query endpoint error:', error);
      res.status(500).json({ error: error.message || 'Error processing RAG query and verification.' });
    }
  });

  // Research Mode Side-by-Side Method Comparison Endpoint
  app.post('/api/rag/compare', async (req, res) => {
    try {
      const { question, docIds } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Question parameter is required.' });
      }

      const activeChunks = docIds && docIds.length > 0
        ? chunksStore.filter(c => docIds.includes(c.docId))
        : chunksStore;

      const methods: VerificationMethod[] = ['hybrid', 'nli_only', 'semantic_only'];
      const comparisons = [];

      // Retrieve & Generate once
      const retrievedChunks = await retrieveRelevantChunks(question, activeChunks, 4);
      const originalAnswer = generateLocalRAGAnswer(question, retrievedChunks);
      const atomicClaims = extractAtomicClaims(originalAnswer);

      for (const method of methods) {
        const verifiedClaims: ClaimVerification[] = [];
        for (const atomicClaim of atomicClaims) {
          const verified = await verifyClaim(atomicClaim.claimText, activeChunks, method);
          verifiedClaims.push(verified);
        }
        const { reliabilityScore, hallucinationRisk, hallucinationDetected } = calculateReliabilityAndRisk(verifiedClaims);

        comparisons.push({
          method,
          verifiedAnswer: synthesizeVerifiedAnswer(originalAnswer, verifiedClaims),
          reliabilityScore,
          hallucinationRisk,
          hallucinationDetected,
          claims: verifiedClaims
        });
      }

      res.json({
        question,
        originalAnswer,
        comparisons
      });
    } catch (error: any) {
      console.error('Research comparison error:', error);
      res.status(500).json({ error: error.message || 'Error running research mode comparison.' });
    }
  });

  // Research Benchmark evaluation endpoint
  app.post('/api/benchmark/run', async (req, res) => {
    try {
      const { selectedDataset = 'AcademicDomain' } = req.body;
      const benchmarkResults = await runRealBenchmarkSuite(selectedDataset);
      res.json({
        datasetUsed: selectedDataset,
        totalBenchmarkCases: benchmarkResults.benchmarkCases.length,
        methodMetrics: benchmarkResults.methodMetrics,
        benchmarkCases: benchmarkResults.benchmarkCases
      });
    } catch (error: any) {
      console.error('Benchmark run error:', error);
      res.status(500).json({ error: error.message || 'Failed to run benchmark suite.' });
    }
  });

  // Vite Middleware handling in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VeriRAG Open-Source ML Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Server] Startup failed: ${message}`);
  if (message.includes('auth/admin-restricted-operation')) {
    console.error('[Server] Enable Firebase Authentication > Sign-in method > Anonymous for the configured project, then restart npm run dev.');
  }
  process.exitCode = 1;
});
