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

test('page-marked text keeps page metadata across multiple chunks', async () => {
  const text = [
    '[Page 1]',
    'The first page contains a complete attendance policy and its eligibility requirements. '.repeat(8),
    '[Page 2]',
    'The second page contains examination rules, permitted materials, and the appeal process. '.repeat(8)
  ].join('\n');

  const chunks = await chunkDocumentText('doc-pages', 'rules.pdf', text, { chunkSize: 180, overlap: 20 });
  assert.ok(chunks.length > 2, `expected a full page breakdown, got ${chunks.length}`);
  assert.ok(chunks.some(chunk => chunk.pageNumber === 1));
  assert.ok(chunks.some(chunk => chunk.pageNumber === 2));
  assert.ok(chunks.every(chunk => !/^%PDF|^obj$|^stream$/i.test(chunk.text.trim())));
});

test('PDF-style single-line extraction preserves headings and creates semantic windows', async () => {
  const text = [
    '[Page 1]',
    'SECTION 1: ATTENDANCE',
    'Students must maintain 75% attendance in every registered course.',
    'Attendance below 65% is not eligible for the examination.',
    'Medical condonation requires documentary evidence within 3 working days.',
    'SECTION 2: RE-EVALUATION',
    'Students may request re-evaluation within 7 days of result declaration.',
    'The request must include the prescribed fee.'
  ].join('\n');

  const chunks = await chunkDocumentText('doc-lines', 'policy.pdf', text, { chunkSize: 150, overlap: 30, minChunkLength: 80 });
  const combinedText = chunks.map(chunk => chunk.text).join(' ');

  assert.ok(chunks.length >= 3, `expected semantic windows, got ${chunks.length}`);
  assert.match(combinedText, /SECTION 1: ATTENDANCE/);
  assert.match(combinedText, /SECTION 2: RE-EVALUATION/);
  assert.match(combinedText, /75% attendance/);
  assert.match(combinedText, /prescribed fee/);
  assert.ok(chunks.every(chunk => chunk.text.length <= 150));
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

test('answer synthesis includes retrieved evidence rather than a fixed policy answer', async () => {
  const answer = await generateLocalRAGAnswer('What is the policy?', [{
    id: 'doc-4-c1',
    docId: 'doc-4',
    docName: 'policy.txt',
    pageNumber: 2,
    text: 'The policy requires a signed request within five working days.'
  }]);

  assert.match(answer, /signed request within five working days/i);
});
