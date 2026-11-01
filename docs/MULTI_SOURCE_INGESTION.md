# VeriRAG Multi-Source Ingestion Architecture

This document describes the multi-source document ingestion system added to VeriRAG, covering supported ingestion sources, end-to-end processing pipeline, SSRF security guards, content deduplication, and API interfaces.

---

## 1. Supported Ingestion Sources

VeriRAG supports ingestion from diverse local and remote sources:

| Source Type | Extension / Scheme | Processing Engine | Characteristics |
|---|---|---|---|
| **PDF Documents** | `.pdf`, Base64 | `pdf-parse` v2 (`PDFParse`) | Page-number extraction, multi-page chunk splitting |
| **Word Documents** | `.docx`, Base64 | `mammoth` | Paragraph extraction, XML tag stripping, page estimation |
| **Plain Text** | `.txt`, raw string | Direct buffer parser | Clean paragraph formatting |
| **Public Websites** | `http://`, `https://` | Native `fetch` + regex parser | Script/style stripping, entity decoding, navigation removal |
| **Google Drive Files** | `drive.google.com/file/d/` | Drive export API + direct stream | Direct binary file fetch & format routing |
| **Google Docs** | `docs.google.com/document/d/` | Google Docs text export endpoint | Direct plain-text streaming (`export?format=txt`) |
| **Google Sheets** | `docs.google.com/spreadsheets/d/` | Google Sheets CSV export endpoint | Plain tabular text streaming (`export?format=csv`) |

---

## 2. Ingestion Pipeline Architecture

```
[User Input] 
  ├── File Upload (PDF / DOCX / TXT)
  └── Remote URL (Website / Google Drive link)
          │
          ▼
[Input Validation & SSRF Guard]
  ├── Scheme check: only http:// and https:// allowed
  ├── Host validation: blocks loopback, private IPv4/IPv6, cloud metadata
  └── Timeout (15s) and response size limit (10 MB)
          │
          ▼
[Content Extraction & Normalization]
  ├── PDF: pdf-parse v2 with [Page N] markers
  ├── DOCX: mammoth paragraph extraction
  ├── HTML: clean text extraction, script/style/nav removal
  └── Drive: canonical file ID extraction and export routing
          │
          ▼
[Content Hashing & Deduplication]
  ├── Compute SHA-256 hash of extracted plain text
  └── Compare against indexed documents; short-circuit if identical
          │
          ▼
[Chunking & Dense Vector Indexing]
  ├── chunkDocumentText (300-500 char overlapping semantic windows)
  ├── SentenceTransformers (all-MiniLM-L6-v2) 384-dimensional embeddings
  └── DenseVectorStore KNN indexing
          │
          ▼
[Persistence & Sync]
  ├── Optional Firebase Firestore storage
  └── Automatic rollback of vector index on persistence failure
```

---

## 3. Security Considerations & SSRF Protection

Remote URL ingestion introduces Server-Side Request Forgery (SSRF) risks. VeriRAG implements multi-layered protections in `src/server/urlFetcher.ts`:

1. **Protocol Restriction**: Only `http:` and `https:` schemes are accepted. Schemes such as `file:`, `ftp:`, `gopher:`, and `data:` are immediately rejected.
2. **Private Address Blocking**:
   - `127.0.0.0/8` (Loopback)
   - `10.0.0.0/8` (Private Network Class A)
   - `172.16.0.0/12` (Private Network Class B)
   - `192.168.0.0/16` (Private Network Class C)
   - `169.254.0.0/16` (Link-Local & Cloud Metadata endpoint `169.254.169.254`)
   - `::1`, `fc00::/7`, `fd00::/8` (IPv6 loopback & Unique Local Addresses)
   - `metadata.google.internal` (GCP metadata service)
3. **Redirect Re-Validation**: Any HTTP 3xx redirect is verified against the SSRF rules before following (capped at 5 redirects).
4. **Payload Size Capping**: Responses larger than 10 MB are rejected before buffering into memory.
5. **Fetch Timeout**: Maximum 15 seconds per request to avoid resource exhaustion.

---

## 4. API Endpoints

### `POST /api/documents/upload`
Uploads a local document in base64 format or as raw text.

**Request Body:**
```json
{
  "name": "Regulation_2026.pdf",
  "category": "Academic Regulations",
  "pdfBase64": "<base64_encoded_string>",
  "docxBase64": "<optional_base64_docx_string>",
  "content": "<optional_raw_text_string>"
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc-uuid",
    "name": "Regulation_2026.pdf",
    "category": "Academic Regulations",
    "pageCount": 4,
    "chunkCount": 12,
    "uploadDate": "2026-10-26",
    "sourceType": "pdf",
    "contentHash": "sha256...",
    "status": "ready"
  },
  "totalChunks": 48
}
```

### `POST /api/documents/ingest-url`
Ingests a web page or Google Drive document from a public link.

**Request Body:**
```json
{
  "url": "https://docs.google.com/document/d/1ab-CD_EF12345/edit",
  "category": "Academic Regulations",
  "name": "Optional Custom Name"
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc-uuid",
    "name": "Optional Custom Name",
    "category": "Academic Regulations",
    "pageCount": 2,
    "chunkCount": 6,
    "uploadDate": "2026-10-26",
    "sourceType": "drive",
    "sourceUrl": "https://docs.google.com/document/d/1ab-CD_EF12345/edit",
    "contentHash": "sha256...",
    "status": "ready"
  },
  "totalChunks": 54
}
```

### `DELETE /api/documents/:id`
Deletes a document from the in-memory store, unindexes all its chunks from `DenseVectorStore`, and removes it from Firestore if configured.

---

## 5. Verification & Testing

The multi-source ingestion pipeline is covered by comprehensive unit tests:
- `tests/ingestion.test.ts`: SSRF protection, URL scheme filtering, HTML parser, Google Drive URL parser, content deduplication, DOCX error handling.
- `tests/pdf-extractor.test.ts`: PDF parsing error handling, page counting, corrupt buffer rejection.
- `tests/chunking-regression.test.ts`: Chunking algorithm integrity, heading preservation, vector store indexing and deletion.
