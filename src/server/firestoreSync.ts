import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { DocumentFile, DocumentChunk } from '../types';

function stripChunkEmbedding(chunkData: any): DocumentChunk {
  const { embedding, ...rest } = chunkData;
  return rest as DocumentChunk;
}

function isReadableDocument(document: DocumentFile): boolean {
  return typeof document.content === 'string'
    && document.content.trim().length > 0
    && !document.content.trimStart().startsWith('%PDF-');
}

export async function loadDocumentsFromFirestore(): Promise<{ documents: DocumentFile[]; chunks: DocumentChunk[] } | null> {
  if (!db) {
    if (!isFirebaseConfigured) {
      console.warn('Firestore is disabled because Firebase environment variables are not configured.');
    }
    return null;
  }

  try {
    const docsSnapshot = await getDocs(collection(db, 'documents'));
    if (docsSnapshot.empty) {
      return null;
    }

    const documents: DocumentFile[] = [];
    docsSnapshot.forEach(d => {
      const document = d.data() as DocumentFile;
      if (isReadableDocument(document)) {
        documents.push(document);
      } else {
        console.warn(`Ignoring unreadable Firestore document ${document.id || d.id}. Re-upload the original file to index it correctly.`);
      }
    });

    const chunksSnapshot = await getDocs(collection(db, 'chunks'));
    const chunks: DocumentChunk[] = [];
    chunksSnapshot.forEach(c => {
      chunks.push(stripChunkEmbedding(c.data()));
    });

    const readableDocumentIds = new Set(documents.map(document => document.id));
    return {
      documents,
      chunks: chunks.filter(chunk => readableDocumentIds.has(chunk.docId))
    };
  } catch (error) {
    throw new Error(`Firestore load failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function saveDocumentToFirestore(document: DocumentFile, chunks: DocumentChunk[]): Promise<void> {
  if (!db) return;

  try {
    await setDoc(doc(db, 'documents', document.id), document);
    
    // Save chunks in batches of 450 (Firestore limit is 500)
    const batchSize = 400;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunkGroup = chunks.slice(i, i + batchSize);
      chunkGroup.forEach(chunk => {
        const { embedding, ...chunkDoc } = chunk as any;
        const chunkRef = doc(db, 'chunks', chunk.id);
        batch.set(chunkRef, chunkDoc);
      });
      await batch.commit();
    }
  } catch (error) {
    throw new Error(`Firestore save failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteDocumentFromFirestore(docId: string, chunks: DocumentChunk[]): Promise<void> {
  if (!db) return;

  try {
    await deleteDoc(doc(db, 'documents', docId));
    
    const docChunks = chunks.filter(c => c.docId === docId);
    const batchSize = 400;
    for (let i = 0; i < docChunks.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunkGroup = docChunks.slice(i, i + batchSize);
      chunkGroup.forEach(chunk => {
        batch.delete(doc(db, 'chunks', chunk.id));
      });
      await batch.commit();
    }
  } catch (error) {
    throw new Error(`Firestore delete failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
