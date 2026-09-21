# Testing

## Current status

- A Node test runner is configured in [package.json](../package.json#L1-L31).
- Regression coverage exists under [tests](../tests) for empty-text rejection and multi-chunk generation.
- Browser and live Firebase integration coverage remains outstanding.

## What should be tested

1. Valid text upload yields non-empty extracted content.
2. Empty upload fails clearly.
3. Chunking creates multiple chunks for long text.
4. Chunk metadata preserves document and page information.
5. Retrieval returns actual document chunks instead of placeholders.
6. Verification uses evidence content and not the fixed answer path.
7. Deleting a document removes its chunks and vector entries.

## Commands to use when tests are added

- `npm run lint`
- `npm run build`
- `npm run dev`

## Live Firebase smoke test

With a configured `.env`, start the app with `npm run dev` and verify:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/documents
```

Upload a real text or PDF document through the Documents tab, expand the document row, and confirm the displayed chunk IDs and text match the persisted records returned by `/api/documents/:id`.

## Known gaps

- There is no real end-to-end test harness, no CI pipeline, and no production-grade fixture set.
- The training scripts in [training](../training) are not integrated into the runtime app test process.
