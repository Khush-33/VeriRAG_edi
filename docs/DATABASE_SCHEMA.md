# Database Schema

## Firestore collections

### `documents`

- `id`: string
- `name`: string
- `category`: string
- `pageCount`: number
- `chunkCount`: number
- `uploadDate`: string
- `isSample`: boolean
- `content`: string
- `status`: string

### `chunks`

- `id`: string
- `docId`: string
- `docName`: string
- `pageNumber`: number
- `text`: string
- `score`: number (optional)
- `embedding`: omitted from persisted Firestore records

## Vector store file

- File: `.vector_store.json`
- Shape: list of vector items with `chunkId`, `docId`, `docName`, `pageNumber`, `text`, `embedding`, and `metadata`
- This is the local dense vector index used by the app.

## Relationships

- One document has many chunks.
- Each chunk belongs to exactly one document.
- Each chunk id is unique across the app and used as the Firestore chunk document ID.

## Indexing and validation

- Chunks are written in batches of 400 to Firestore.
- The vector store only accepts embeddings that match the fixed 384-dimensional model size.
- There is no current migration or schema-versioning system.
- Legacy records whose stored content begins with `%PDF-` are ignored during startup because they represent an old raw-binary fallback, not readable extracted text.
- Firestore access requires an authenticated Firebase session. The current single-user deployment uses Firebase Anonymous Authentication; multi-user tenant isolation is not yet implemented.
