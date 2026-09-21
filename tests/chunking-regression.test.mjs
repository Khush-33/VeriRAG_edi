import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocumentText } from '../src/server/verificationEngine.ts';

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

  const chunks = await chunkDocumentText('doc-2', 'demo.txt', text);
  assert.ok(Array.isArray(chunks));
  assert.ok(chunks.length >= 2);
  assert.ok(chunks.every(chunk => chunk.text.length > 0));
});
