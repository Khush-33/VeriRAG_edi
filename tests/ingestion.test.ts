import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isBlockedHostname, extractTextFromHtml } from '../src/server/urlFetcher';
import { parseDriveUrl } from '../src/server/driveFetcher';
import { extractTextFromDocxBuffer } from '../src/server/docxExtractor';
import { findDuplicateDocument } from '../src/server/ingestionPipeline';
import { DocumentFile } from '../src/types';

describe('SSRF Protection & URL Security', () => {
  it('blocks private IPv4 addresses', () => {
    assert.equal(isBlockedHostname('127.0.0.1'), true);
    assert.equal(isBlockedHostname('10.0.0.1'), true);
    assert.equal(isBlockedHostname('10.255.255.255'), true);
    assert.equal(isBlockedHostname('172.16.0.1'), true);
    assert.equal(isBlockedHostname('172.31.255.255'), true);
    assert.equal(isBlockedHostname('192.168.1.1'), true);
    assert.equal(isBlockedHostname('169.254.169.254'), true);
    assert.equal(isBlockedHostname('0.0.0.0'), true);
  });

  it('blocks loopback hostnames and cloud metadata', () => {
    assert.equal(isBlockedHostname('localhost'), true);
    assert.equal(isBlockedHostname('LOCALHOST'), true);
    assert.equal(isBlockedHostname('metadata.google.internal'), true);
  });

  it('allows valid public domain names', () => {
    assert.equal(isBlockedHostname('example.com'), false);
    assert.equal(isBlockedHostname('drive.google.com'), false);
    assert.equal(isBlockedHostname('docs.google.com'), false);
    assert.equal(isBlockedHostname('vit.ac.in'), false);
    assert.equal(isBlockedHostname('arxiv.org'), false);
  });
});

describe('HTML Text Extraction', () => {
  it('strips script, style, nav, and footer tags and extracts clean text', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { font-size: 14px; }</style>
          <script>console.log("secret");</script>
        </head>
        <body>
          <nav><a href="/">Home</a></nav>
          <main>
            <h1>Academic Regulations 2026</h1>
            <p>Students must maintain at least 75% attendance in all courses.</p>
            <p>Failure to meet attendance requires summer semester registration.</p>
          </main>
          <footer>Copyright 2026 University</footer>
        </body>
      </html>
    `;

    const text = extractTextFromHtml(html, 'https://example.com/regs');
    assert.ok(text.includes('Academic Regulations 2026'));
    assert.ok(text.includes('Students must maintain at least 75% attendance'));
    assert.ok(!text.includes('body { font-size: 14px; }'));
    assert.ok(!text.includes('console.log'));
    assert.ok(!text.includes('Copyright 2026'));
  });

  it('decodes HTML entities properly', () => {
    const html = '<p>Credits &amp; Courses: Grade A &gt; 90% and Grade B &lt; 80% &quot;Pass&quot;</p>';
    const text = extractTextFromHtml(html, 'https://example.com');
    assert.ok(text.includes('Credits & Courses'));
    assert.ok(text.includes('Grade A > 90%'));
    assert.ok(text.includes('Grade B < 80%'));
    assert.ok(text.includes('"Pass"'));
  });
});

describe('Google Drive URL Parser', () => {
  it('correctly parses Drive file view links', () => {
    const url = 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OIvE2up0/view?usp=sharing';
    const parsed = parseDriveUrl(url);
    assert.notEqual(parsed, null);
    assert.equal(parsed?.fileId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OIvE2up0');
    assert.equal(parsed?.resourceType, 'file');
  });

  it('correctly parses Google Docs links', () => {
    const url = 'https://docs.google.com/document/d/1ab-CD_EF12345/edit';
    const parsed = parseDriveUrl(url);
    assert.notEqual(parsed, null);
    assert.equal(parsed?.fileId, '1ab-CD_EF12345');
    assert.equal(parsed?.resourceType, 'doc');
  });

  it('correctly parses Google Sheets links', () => {
    const url = 'https://docs.google.com/spreadsheets/d/2xy-ZZ_98765/edit#gid=0';
    const parsed = parseDriveUrl(url);
    assert.notEqual(parsed, null);
    assert.equal(parsed?.fileId, '2xy-ZZ_98765');
    assert.equal(parsed?.resourceType, 'sheet');
  });

  it('correctly parses drive uc download link', () => {
    const url = 'https://drive.google.com/uc?id=999888777fileid';
    const parsed = parseDriveUrl(url);
    assert.notEqual(parsed, null);
    assert.equal(parsed?.fileId, '999888777fileid');
    assert.equal(parsed?.resourceType, 'file');
  });

  it('returns null for non-Google links', () => {
    assert.equal(parseDriveUrl('https://example.com/file/d/123'), null);
    assert.equal(parseDriveUrl('invalid-url'), null);
  });
});

describe('Deduplication Detection', () => {
  const existingDocs: DocumentFile[] = [
    {
      id: 'doc-1',
      name: 'Existing Policy.pdf',
      category: 'Academic Regulations',
      pageCount: 3,
      chunkCount: 5,
      uploadDate: '2026-10-01',
      isSample: false,
      content: 'Sample text content',
      contentHash: 'hash-abc-123'
    },
    {
      id: 'doc-sample',
      name: 'Sample Doc',
      category: 'Student Handbook',
      pageCount: 1,
      chunkCount: 2,
      uploadDate: '2026-10-01',
      isSample: true,
      content: 'Sample doc text',
      contentHash: 'sample-hash'
    }
  ];

  it('detects duplicate document by content hash', () => {
    const dup = findDuplicateDocument(existingDocs, 'hash-abc-123');
    assert.notEqual(dup, undefined);
    assert.equal(dup?.id, 'doc-1');
  });

  it('returns undefined for non-duplicate hash', () => {
    const dup = findDuplicateDocument(existingDocs, 'unique-new-hash');
    assert.equal(dup, undefined);
  });

  it('ignores sample documents during deduplication check', () => {
    const dup = findDuplicateDocument(existingDocs, 'sample-hash');
    assert.equal(dup, undefined);
  });
});

describe('DOCX Extractor Error Handling', () => {
  it('rejects empty buffer with clear error', async () => {
    await assert.rejects(
      async () => {
        await extractTextFromDocxBuffer(Buffer.alloc(0));
      },
      /empty/i
    );
  });

  it('rejects invalid non-docx buffer with descriptive error', async () => {
    await assert.rejects(
      async () => {
        await extractTextFromDocxBuffer(Buffer.from('not a zip or docx file'));
      },
      /DOCX extraction failed/i
    );
  });
});
