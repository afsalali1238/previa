import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    onSnapshot,
    type DocumentData,
    type QueryConstraint,
    type WithFieldValue,
    type Unsubscribe,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

import type { CollectionReference } from 'firebase/firestore';

export class FirestoreService<T extends DocumentData> {
    protected collectionRef: CollectionReference<DocumentData>;

    constructor(collectionPath: string) {
        this.collectionRef = collection(db, collectionPath);
    }

    async getById(id: string): Promise<T | null> {
        try {
            const docRef = doc(this.collectionRef, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as unknown as T;
            }
            return null;
        } catch (error) {
            console.error(`Error getting document ${id}:`, error);
            throw error;
        }
    }

    async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
        try {
            const q = query(this.collectionRef, ...constraints);
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as unknown as T[];
        } catch (error) {
            console.error('Error getting documents:', error);
            throw error;
        }
    }

    // Create with auto-generated ID
    async create(data: WithFieldValue<Omit<T, 'id'>>): Promise<string> {
        try {
            const docRef = await addDoc(this.collectionRef, {
                ...(data as any),
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    // Create or overwrite with specific ID
    async set(id: string, data: WithFieldValue<Omit<T, 'id'>>): Promise<void> {
        try {
            const docRef = doc(this.collectionRef, id);
            await setDoc(docRef, {
                ...(data as any),
                updated_at: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error(`Error setting document ${id}:`, error);
            throw error;
        }
    }

    async update(id: string, data: WithFieldValue<Partial<T>>): Promise<void> {
        try {
            const docRef = doc(this.collectionRef, id);
            await updateDoc(docRef, {
                ...(data as any),
                updated_at: serverTimestamp()
            });
        } catch (error) {
            console.error(`Error updating document ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(this.collectionRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting document ${id}:`, error);
            throw error;
        }
    }

    subscribeToDocument(id: string, callback: (data: T | null) => void): Unsubscribe {
        const docRef = doc(this.collectionRef, id);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() } as unknown as T);
            } else {
                callback(null);
            }
        });
    }

    subscribeToCollection(
        callback: (data: T[]) => void,
        constraints: QueryConstraint[] = []
    ): Unsubscribe {
        const q = query(this.collectionRef, ...constraints);
        return onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as unknown as T[];
            callback(data);
        });
    }
}
