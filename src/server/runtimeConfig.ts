import 'dotenv/config';

function readPositiveInteger(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export const runtimeConfig = {
  port: readPositiveInteger('PORT', 3000),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '20mb',
  vectorStoreFile: process.env.VECTOR_STORE_FILE || './.vector_store.json',
  embeddingBatchSize: readPositiveInteger('EMBEDDING_BATCH_SIZE', 64),
  firestoreBatchSize: readPositiveInteger('FIRESTORE_BATCH_SIZE', 400),
  chunkSize: readPositiveInteger('CHUNK_SIZE', 500),
  chunkOverlap: Number.isInteger(Number(process.env.CHUNK_OVERLAP)) && Number(process.env.CHUNK_OVERLAP) >= 0
    ? Number(process.env.CHUNK_OVERLAP)
    : 80,
  minChunkLength: readPositiveInteger('MIN_CHUNK_LENGTH', 80),
  retrievalTopK: readPositiveInteger('RETRIEVAL_TOP_K', 4),
  answerMaxCharacters: readPositiveInteger('ANSWER_MAX_CHARACTERS', 2400)
};
