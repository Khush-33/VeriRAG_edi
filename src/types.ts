export type DocumentCategory = 
  | 'Academic Regulations'
  | 'Examination Rules'
  | 'Attendance Policy'
  | 'Course Syllabus & Credits'
  | 'Placement & Internship'
  | 'Hostel & Scholarship'
  | 'Student Handbook'
  | 'Other';

export interface DocumentFile {
  id: string;
  name: string;
  category: DocumentCategory;
  pageCount: number;
  chunkCount: number;
  uploadDate: string;
  isSample?: boolean;
  content: string;
  status?: 'uploading' | 'processing' | 'chunking' | 'embedding' | 'ready';
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  pageNumber: number;
  text: string;
  embedding?: number[];
  score?: number;
}

export type ClaimVerdict = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'CONTRADICTED' | 'UNSUPPORTED';

export interface PerformanceBreakdown {
  embeddingTimeMs: number;
  retrievalTimeMs: number;
  generationTimeMs: number;
  verificationTimeMs: number;
  totalTimeMs: number;
  memoryUsageMb: number;
}

export interface EvidenceChunkMatch {
  chunkId: string;
  docName: string;
  pageNumber: number;
  text: string;
  similarityScore: number;
  matchedHighlightText?: string;
}

export interface ClaimVerification {
  claimId: string;
  claimText: string;
  originalSentence?: string;
  verdict: ClaimVerdict;
  confidence: number; // 0 - 100
  evidenceText: string;
  sourceDocName: string;
  sourcePageNumber: number | null;
  reasoning: string;
  evidenceChunks?: EvidenceChunkMatch[];
  scores: {
    semanticSimilarity: number;
    nliEntailment: number;
    evidenceRetrievalScore: number;
    keywordOverlap: number;
    negationDetected: boolean;
    hybridScore: number;
  };
}

export interface AHSSResult {
  score: number; // 0 - 100 Risk %
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  trustScore: number; // 0 - 100 Trust %
  reliabilityScore: number; // 0 - 100 Reliability %
  hallucinationDetected: boolean;
  breakdown: {
    contradictionPenalty: number;
    unsupportedPenalty: number;
    partialSupportDiscount: number;
    evidenceQualityFactor: number;
    claimCount: number;
  };
}

export type VerificationMethod = 'hybrid' | 'semantic_only' | 'nli_only';

export interface QueryResponse {
  question: string;
  originalAnswer: string;
  verifiedAnswer: string;
  reliabilityScore: number; // 0 - 100
  hallucinationScore: number; // 0 - 100
  hallucinationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  hallucinationDetected: boolean;
  ahss?: AHSSResult;
  methodUsed: VerificationMethod;
  claims: ClaimVerification[];
  retrievedChunks: DocumentChunk[];
  performanceBreakdown?: PerformanceBreakdown;
  metrics: {
    latencyMs: number;
    claimsCount: number;
    supportedCount: number;
    partiallySupportedCount: number;
    unsupportedCount: number;
    contradictedCount: number;
  };
}

export interface GroundTruthClaim {
  claimText: string;
  groundTruthVerdict: ClaimVerdict;
  evidenceSnippet: string;
  docName?: string;
  pageNumber?: number;
}

export interface BenchmarkCase {
  id: string;
  dataset: 'RAGTruth' | 'AcademicDomain';
  taskType?: 'QA' | 'Summary' | 'Data2txt';
  domain: string;
  query: string;
  generatedAnswer: string;
  retrievedContext: string;
  groundTruthClaims: GroundTruthClaim[];
}

export interface ConfusionMatrix {
  truePositive: number;  // Correctly detected hallucination
  trueNegative: number;  // Correctly identified non-hallucinated claim
  falsePositive: number; // Non-hallucinated falsely marked as hallucinated
  falseNegative: number; // Hallucination missed
}

export interface ErrorAnalysisSample {
  id: string;
  caseId: string;
  query: string;
  claimText: string;
  groundTruthVerdict: ClaimVerdict;
  predictedVerdict: ClaimVerdict;
  errorType: 'False Positive' | 'False Negative' | 'Verdict Mismatch' | 'Correct';
  confidence: number;
  reasoning: string;
}

export interface MethodBenchmarkResult {
  method: VerificationMethod;
  methodName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgLatencyMs: number;
  hallucinationReductionRate: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  avgConfidence: number;
  confusionMatrix: ConfusionMatrix;
  description: string;
}

