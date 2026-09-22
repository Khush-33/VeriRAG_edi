import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { DocumentFile, DocumentChunk } from '../types';
import { runtimeConfig } from './runtimeConfig';

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
    const documents: DocumentFile[] = [];
    const unreadableDocumentRefs = [] as typeof docsSnapshot.docs;
    docsSnapshot.forEach(d => {
      const document = d.data() as DocumentFile;
      if (isReadableDocument(document)) {
        documents.push(document);
      } else {
        unreadableDocumentRefs.push(d);
        console.warn(`Ignoring unreadable Firestore document ${document.id || d.id}. Re-upload the original file to index it correctly.`);
      }
    });

    const chunksSnapshot = await getDocs(collection(db, 'chunks'));
    const chunks: DocumentChunk[] = [];
    chunksSnapshot.forEach(c => {
      chunks.push(stripChunkEmbedding(c.data()));
    });

    const readableDocumentIds = new Set(documents.map(document => document.id));
    const staleChunkRefs = chunksSnapshot.docs.filter(chunk => {
      const chunkData = chunk.data() as DocumentChunk;
      return !readableDocumentIds.has(chunkData.docId);
    });
    const refsToDelete = [
      ...unreadableDocumentRefs.map(document => document.ref),
      ...staleChunkRefs.map(chunk => chunk.ref)
    ];
    const batchSize = runtimeConfig.firestoreBatchSize;
    for (let i = 0; i < refsToDelete.length; i += batchSize) {
      const batch = writeBatch(db);
      refsToDelete.slice(i, i + batchSize).forEach(ref => batch.delete(ref));
      await batch.commit();
    }

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
    const batchSize = runtimeConfig.firestoreBatchSize;
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

export async function replaceDocumentChunksInFirestore(document: DocumentFile, chunks: DocumentChunk[]): Promise<void> {
  if (!db) return;

  try {
    await setDoc(doc(db, 'documents', document.id), document);
    const existing = await getDocs(query(collection(db, 'chunks'), where('docId', '==', document.id)));
    const refs = existing.docs.map(chunk => chunk.ref);
    const batchSize = runtimeConfig.firestoreBatchSize;

    for (let i = 0; i < refs.length; i += batchSize) {
      const batch = writeBatch(db);
      refs.slice(i, i + batchSize).forEach(ref => batch.delete(ref));
      await batch.commit();
    }

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = writeBatch(db);
      chunks.slice(i, i + batchSize).forEach(chunk => {
        const { embedding, ...chunkDoc } = chunk as any;
        batch.set(doc(db, 'chunks', chunk.id), chunkDoc);
      });
      await batch.commit();
    }
  } catch (error) {
    throw new Error(`Firestore chunk replacement failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteDocumentFromFirestore(docId: string, chunks: DocumentChunk[]): Promise<void> {
  if (!db) return;

  try {
    await deleteDoc(doc(db, 'documents', docId));

    // Query Firestore instead of relying on the in-memory chunk list. The server
    // can be restarted or have an older index while Firestore still has data.
    const storedChunks = await getDocs(query(collection(db, 'chunks'), where('docId', '==', docId)));
    const storedChunkRefs = storedChunks.docs.map(chunk => chunk.ref);
    const knownChunkRefs = chunks
      .filter(chunk => chunk.docId === docId)
      .map(chunk => doc(db, 'chunks', chunk.id));
    const chunkRefs = new Map(storedChunkRefs.concat(knownChunkRefs).map(ref => [ref.path, ref]));
    const batchSize = runtimeConfig.firestoreBatchSize;
    const refs = Array.from(chunkRefs.values());
    for (let i = 0; i < refs.length; i += batchSize) {
      const batch = writeBatch(db);
      refs.slice(i, i + batchSize).forEach(chunkRef => batch.delete(chunkRef));
      await batch.commit();
    }
  } catch (error) {
    throw new Error(`Firestore delete failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
