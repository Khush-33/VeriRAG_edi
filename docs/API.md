# API Reference

## Health

- GET `/api/health`
- Response: status, engine, and timestamp

## Documents

- GET `/api/documents` — list documents and total chunk count
- GET `/api/documents/:id` — fetch a document and its chunks
- POST `/api/documents/upload` — upload a document payload with `name`, optional `category`, optional `content`, optional `pdfBase64`
- DELETE `/api/documents/:id` — remove a document and its chunks
- POST `/api/documents/load-sample` — reload the demo academic sample set

### Upload request example

```json
{
  "name": "mydoc.pdf",
  "category": "Academic Regulations",
  "content": "Raw text here",
  "pdfBase64": "data:application/pdf;base64,..."
}
```

### Upload success response

```json
{
  "success": true,
  "document": {
    "id": "doc-123",
    "name": "mydoc.pdf",
    "category": "Academic Regulations",
    "pageCount": 2,
    "chunkCount": 8,
    "status": "ready"
  },
  "totalChunks": 8
}
```

## Query

- POST `/api/rag/query`
- Body: `{ "question": "...", "method": "hybrid" | "semantic_only" | "nli_only", "docIds": ["doc-1"] }`
- Response: `QueryResponse`

## Compare

- POST `/api/rag/compare`
- Compare the hybrid, NLI-only, and semantic-only verification methods.

## Benchmark

- POST `/api/benchmark/run`
- Body: `{ "selectedDataset": "AcademicDomain" }`

## Error handling

- Validation errors return HTTP 400 with `{ "error": "..." }`.
- Server errors return HTTP 500 with `{ "error": "..." }`.
- Authentication is not implemented in the current code path.
