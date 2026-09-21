import fs from 'fs/promises';
import path from 'path';
import { DocumentChunk } from '../types';

export interface VectorItem {
  chunkId: string;
  docId: string;
  docName: string;
  pageNumber: number;
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  chunk: DocumentChunk;
  similarity: number; // 0.0 to 1.0 Cosine Similarity
}

export interface IVectorDatabase {
  addChunk(chunk: DocumentChunk): Promise<void>;
  addChunks(chunks: DocumentChunk[]): Promise<void>;
  search(queryEmbedding: number[], topK?: number, docIds?: string[]): Promise<VectorSearchResult[]>;
  deleteChunksByDocId(docId: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): { totalChunks: number; dimension: number; indexType: string };
  getChunkIds(): string[];
  saveToFile(filePath: string): Promise<void>;
  loadFromFile(filePath: string): Promise<boolean>;
}

/**
 * In-Memory Dense Vector Database with Cosine Similarity KNN Search.
 * Implements IVectorDatabase interface so it can be swapped with FAISS or Pinecone seamlessly.
 */
export class DenseVectorStore implements IVectorDatabase {
  private items: VectorItem[] = [];
  private readonly dimension: number = 384; // SentenceTransformer all-MiniLM-L6-v2 vector size

  public async addChunk(chunk: DocumentChunk): Promise<void> {
    if (!chunk.embedding || chunk.embedding.length !== this.dimension) {
      throw new Error(`Invalid embedding for chunk ${chunk.id}: expected ${this.dimension} dimensions.`);
    }

    if (!chunk.embedding.every(value => Number.isFinite(value))) {
      throw new Error(`Invalid embedding for chunk ${chunk.id}: all values must be finite numbers.`);
    }

    const item: VectorItem = {
      chunkId: chunk.id,
      docId: chunk.docId,
      docName: chunk.docName,
      pageNumber: chunk.pageNumber,
      text: chunk.text,
      embedding: chunk.embedding,
      metadata: {
        score: chunk.score
      }
    };

    const existingIdx = this.items.findIndex(i => i.chunkId === chunk.id);
    if (existingIdx >= 0) {
      this.items[existingIdx] = item;
    } else {
      this.items.push(item);
    }
  }

  public async addChunks(chunks: DocumentChunk[]): Promise<void> {
    for (const chunk of chunks) {
      await this.addChunk(chunk);
    }
  }

  public async search(
    queryEmbedding: number[],
    topK: number = 4,
    docIds?: string[]
  ): Promise<VectorSearchResult[]> {
    if (this.items.length === 0 || !queryEmbedding || queryEmbedding.length !== this.dimension) {
      return [];
    }

    const filtered = docIds && docIds.length > 0
      ? this.items.filter(item => docIds.includes(item.docId))
      : this.items;

    const scored: VectorSearchResult[] = [];
    for (const item of filtered) {
      const similarity = this.cosineSimilarity(queryEmbedding, item.embedding);
      scored.push({
        chunk: {
          id: item.chunkId,
          docId: item.docId,
          docName: item.docName,
          pageNumber: item.pageNumber,
          text: item.text,
          score: Math.round(similarity * 1000) / 1000
        },
        similarity: Math.round(similarity * 1000) / 1000
      });
    }

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  public async deleteChunksByDocId(docId: string): Promise<void> {
    this.items = this.items.filter(item => item.docId !== docId);
  }

  public async clear(): Promise<void> {
    this.items = [];
  }

  public getStats(): { totalChunks: number; dimension: number; indexType: string } {
    return {
      totalChunks: this.items.length,
      dimension: this.dimension,
      indexType: 'Dense Vector Cosine Flat Index (FAISS-Compatible Interface)'
    };
  }

  public getChunkIds(): string[] {
    return this.items.map(item => item.chunkId);
  }

  public async saveToFile(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(this.items), 'utf-8');
  }

  public async loadFromFile(filePath: string): Promise<boolean> {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const loaded = JSON.parse(raw) as VectorItem[];
      if (!Array.isArray(loaded)) return false;
      const invalidItems = loaded.filter(item => !Array.isArray(item.embedding) || item.embedding.length !== this.dimension);
      if (invalidItems.length > 0) {
        throw new Error(`Vector index contains ${invalidItems.length} invalid embeddings.`);
      }
      this.items = loaded;
      return true;
    } catch (error) {
      console.warn(`Vector index load failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA * normB);
    if (denom === 0) return 0;
    return Math.max(0, Math.min(1, dotProduct / denom));
  }
}

// Global vector store instance
export const vectorStore: IVectorDatabase = new DenseVectorStore();
