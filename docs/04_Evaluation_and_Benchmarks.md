# Evaluation and Benchmarks

## Overview
To validate the effectiveness of VeriRAG's lightweight verification engine, it must be evaluated against established datasets. The primary research question is: *Can we get good claim-level hallucination detection using a lightweight evidence-aware approach, without depending on another expensive LLM as a judge?*

## Datasets

### 1. RAGTruth Benchmark
- **Purpose**: Used as the primary research benchmark to develop and evaluate the hallucination detector.
- **Implementation**: The dataset cases are implemented in `src/data/benchmarkDataset.ts`.
- **Metrics Evaluated**:
  - Precision
  - Recall
  - F1 Score
  - Latency (Time taken to verify)
  - Cost (Computed implicitly as local models are virtually free compared to API-based LLMs)

### 2. Academic Domain Application
- **Purpose**: Used for the actual application demo and real-world testing.
- **Implementation**: Default sample documents are provided in `src/data/sampleAcademicDocs.ts`.
- **Usage**: Users upload college PDFs (Academic Regulations, Exam Rules, Attendance Policies, etc.). This domain serves as a practical testbed to see how well the detector generalizes from the RAGTruth benchmark to actual academic use cases.

## Comparing Approaches
The system allows for comparing different verification methods:
- Semantic Similarity Only
- NLI Only
- Hybrid Approach (Semantic + NLI)

By running the benchmark suite (accessible via the UI's Benchmark view), the system generates a performance breakdown, comparing the F1 score, accuracy, and processing times of these methods against the ground truth provided in the RAGTruth dataset.
