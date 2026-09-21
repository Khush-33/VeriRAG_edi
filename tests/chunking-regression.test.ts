import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocumentText } from '../src/server/verificationEngine';
import { DenseVectorStore } from '../src/server/vectorStore';
import { generateLocalRAGAnswer } from '../src/server/verificationEngine';

test('empty text is rejected by chunkDocumentText', async () => {
  await assert.rejects(
    async () => chunkDocumentText('doc-1', 'demo.txt', '   '),
    /non-empty text/i
  );
});

test('long text produces multiple real chunks', async () => {
  const text = [
    'This is the first paragraph for chunking validation.',
    'This is the second paragraph for chunking validation.',
    'This is the third paragraph for chunking validation.',
    'This is the fourth paragraph for chunking validation.'
  ].join('\n\n');

  const chunks = await chunkDocumentText('doc-2', 'demo.txt', text, { chunkSize: 140, overlap: 20 });
  assert.ok(Array.isArray(chunks));
  assert.ok(chunks.length >= 2, `expected multiple chunks, got ${chunks.length}`);
  assert.ok(chunks.every(chunk => chunk.text.length > 0));
  assert.ok(chunks.every(chunk => chunk.id.startsWith('doc-2')));
});

test('vector store searches and deletes actual indexed chunks', async () => {
  const store = new DenseVectorStore();
  const embedding = Array.from({ length: 384 }, (_, index) => index === 0 ? 1 : 0);
  const chunk = {
    id: 'doc-3-c1',
    docId: 'doc-3',
    docName: 'facts.txt',
    pageNumber: 1,
    text: 'The attendance requirement is 75 percent.',
    embedding
  };

  await store.addChunk(chunk);
  const results = await store.search(embedding, 1, ['doc-3']);
  assert.equal(results[0]?.chunk.text, chunk.text);
  assert.deepEqual(store.getChunkIds(), ['doc-3-c1']);

  await store.deleteChunksByDocId('doc-3');
  assert.equal(store.getStats().totalChunks, 0);
});

test('answer synthesis includes retrieved evidence rather than a fixed policy answer', () => {
  const answer = generateLocalRAGAnswer('What is the policy?', [{
    id: 'doc-4-c1',
    docId: 'doc-4',
    docName: 'policy.txt',
    pageNumber: 2,
    text: 'The policy requires a signed request within five working days.'
  }]);

  assert.match(answer, /signed request within five working days/i);
});
