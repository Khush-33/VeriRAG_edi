# VeriRAG User Workflow

VeriRAG is an academic-document RAG application with a claim-level hallucination verification layer. The chatbot is the demo surface; the verification result is the main product behavior.

## 1. Upload Documents

The user uploads academic PDFs such as regulations, examination rules, attendance policies, syllabi, and internship guidelines. The server extracts PDF text, preserves page markers, creates semantic chunks, generates dense embeddings, and stores the document and chunks in the configured Firestore/vector store.

The interface shows the document name, category, page count, and indexed chunk count. No machine-learning knowledge is required from the user.

## 2. Ask a Question

The user asks a natural-language question in the Verify view. The server retrieves the highest-scoring chunks from the active knowledge base using dense similarity and lexical overlap.

## 3. Generate the Original RAG Answer

Gemini generates the original answer using only the retrieved chunks. The prompt explicitly requires a concise answer to the user's question and forbids external facts, assumptions, advice, or unrelated information.

The Gemini model is configured through `GEMINI_MODEL` and defaults to `gemini-3.6-flash`. The API key is read only from `GEMINI_API_KEY` on the server.

## 4. Extract Relevant Atomic Claims

The generated answer is split into atomic factual claims. Claims are filtered against meaningful terms and numeric values in the user's question. This prevents unrelated generated statements from appearing in the verification result.

If filtering would remove every claim, the system retains the extracted claims so that an answer is never silently treated as verified without analysis.

## 5. Verify Each Claim

Each relevant claim retrieves its own evidence from the uploaded documents. The selected verification method then evaluates:

- `semantic_only`: dense semantic similarity
- `nli_only`: DeBERTa NLI entailment and contradiction probabilities
- `hybrid`: semantic similarity, lexical overlap, NLI, and negation detection

Every claim receives a verdict, confidence, evidence text, source document, and source page when available. Verdicts are `SUPPORTED`, `PARTIALLY_SUPPORTED`, `CONTRADICTED`, or `UNSUPPORTED`.

## 6. Display the Result

The Verify view displays:

- Original RAG answer
- Clean verified answer containing supported or partially supported claims only
- Overall reliability and hallucination risk
- Relevant claims only
- Verdict and confidence for every relevant claim
- Source document and page for supported claims
- A removal or rejection explanation for unsupported or contradicted claims

Unsupported text is not included in the clean verified answer. The report view contains the detailed claim evidence and downloadable JSON report.

## 7. Research Boundary

RAGTruth and benchmark comparisons are research/evaluation functionality. Academic PDFs are the application knowledge base. The verification layer is designed to compare lightweight semantic, NLI, and hybrid approaches without requiring a second expensive LLM judge.
