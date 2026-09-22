# VeriRAG Architecture Overview

## Introduction
VeriRAG is a Retrieval-Augmented Generation (RAG) system with a specialized focus on hallucination detection. Normal LLMs in RAG architectures can still confidently generate incorrect information or hallucinate facts not present in the retrieved context. VeriRAG solves this by introducing a lightweight verification layer post-generation.

## System Flow

1. **Document Processing (PDF Upload)**
   - The user uploads academic documents (e.g., Academic Regulations, Exam Rules).
   - The system extracts text using `pdf-parse`.
   - Text is divided into overlapping semantic chunks.
   - Embeddings are generated for each chunk using a local Hugging Face SentenceTransformer model (`Xenova/all-MiniLM-L6-v2`).
   - Chunks and embeddings are stored in a local Vector Database (and optionally synced to Firebase Firestore).
   - *User Experience:* The user sees a simple success message ("Documents processed successfully").

2. **User Query & RAG Generation**
   - The user asks a question via the chat interface.
   - The question is converted into an embedding.
   - The Vector DB retrieves the most relevant chunks based on semantic similarity.
   - A local RAG answer is synthesized using the retrieved chunks.

3. **Verification Layer (The Fact-Checking Core)**
   - The generated answer is broken down into atomic claims.
   - For each claim, relevant evidence is retrieved from the original document chunks.
   - The claim is verified against the evidence using a hybrid approach of Semantic Similarity and Natural Language Inference (NLI).
   - Each claim is assigned a verdict (`SUPPORTED`, `UNSUPPORTED`, `CONTRADICTED`), a confidence score, and linked to a specific source page.

4. **Final Output Display**
   - The user is presented with the final verified answer.
   - The UI clearly distinguishes between the original RAG answer and the verified answer, highlighting removed or modified parts to demonstrate the system's fact-checking capabilities.
