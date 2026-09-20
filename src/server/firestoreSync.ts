import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { DocumentFile, DocumentChunk } from '../types';

function stripChunkEmbedding(chunkData: any): DocumentChunk {
  const { embedding, ...rest } = chunkData;
  return rest as DocumentChunk;
}

export async function loadDocumentsFromFirestore(): Promise<{ documents: DocumentFile[]; chunks: DocumentChunk[] } | null> {
  try {
    const docsSnapshot = await getDocs(collection(db, 'documents'));
    if (docsSnapshot.empty) {
      return null;
    }

    const documents: DocumentFile[] = [];
    docsSnapshot.forEach(d => {
      documents.push(d.data() as DocumentFile);
    });

    const chunksSnapshot = await getDocs(collection(db, 'chunks'));
    const chunks: DocumentChunk[] = [];
    chunksSnapshot.forEach(c => {
      chunks.push(stripChunkEmbedding(c.data()));
    });

    return { documents, chunks };
  } catch (error) {
    console.warn('Firestore load warning (falling back to memory store):', error);
    return null;
  }
}

export async function saveDocumentToFirestore(document: DocumentFile, chunks: DocumentChunk[]): Promise<void> {
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
    console.warn('Firestore save document error:', error);
  }
}

export async function deleteDocumentFromFirestore(docId: string, chunks: DocumentChunk[]): Promise<void> {
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
    console.warn('Firestore delete document error:', error);
  }
}
