import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

// Generic hook for fetching a single document
export const useDocument = <T extends DocumentData>(
  collectionName: string,
  documentId: string | null
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as unknown as T);
        } else {
          setData(null);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch document');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return { data, loading, error };
};

// Generic hook for fetching a collection
export const useCollection = <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];

        setData(documents);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch collection');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionName, JSON.stringify(constraints)]);

  const refetch = async () => {
    try {
      setLoading(true);
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[];

      setData(documents);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch collection');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook for CRUD operations
export const useFirestoreCRUD = <T extends DocumentData>(collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Partial<T>): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const docData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, docData);

      return docRef.id;
    } catch (err: any) {
      setError(err.message || 'Failed to create document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (documentId: string, data: Partial<T>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, docData);

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (documentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAll = async (): Promise<T[]> => {
    try {
      setLoading(true);
      setError(null);

      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[];

      return documents;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, getAll, loading, error };
};

// Specific hooks for each collection

// Profile hook - fetches the first profile document
export const useProfile = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const collectionRef = collection(db, COLLECTIONS.PROFILE);
        const querySnapshot = await getDocs(collectionRef);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          setData({
            id: firstDoc.id,
            ...firstDoc.data(),
          });
        } else {
          setData(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { data, loading, error };
};

// Music hooks
export const useMusic = () => {
  return useCollection(COLLECTIONS.MUSIC);
};

export const useMusicById = (id: string | null) => {
  return useDocument(COLLECTIONS.MUSIC, id);
};

// Videos hooks
export const useVideos = () => {
  return useCollection(COLLECTIONS.VIDEOS);
};

export const useVideoById = (id: string | null) => {
  return useDocument(COLLECTIONS.VIDEOS, id);
};

// Events hooks
export const useUpcomingEvents = () => {
  return useCollection(COLLECTIONS.EVENTS, [orderBy('date', 'asc')]);
};

export const usePastEvents = () => {
  return useCollection(COLLECTIONS.EVENTS, [orderBy('date', 'desc')]);
};

export const useEventById = (id: string | null) => {
  return useDocument(COLLECTIONS.EVENTS, id);
};

// Posts hooks
export const usePublishedPosts = () => {
  return useCollection(COLLECTIONS.POSTS, [orderBy('publishDate', 'desc')]);
};

export const useAllPosts = () => {
  return useCollection(COLLECTIONS.POSTS, [orderBy('publishDate', 'desc')]);
};

export const usePostById = (id: string | null) => {
  return useDocument(COLLECTIONS.POSTS, id);
};

// Contact messages hooks
export const useContactMessages = () => {
  return useCollection(COLLECTIONS.CONTACT_MESSAGES, [orderBy('createdAt', 'desc')]);
};

export const useUnreadMessages = () => {
  return useCollection(COLLECTIONS.CONTACT_MESSAGES, [
    where('isRead', '==', false),
    orderBy('createdAt', 'desc'),
  ]);
};

// Social links hook - fetches first document from collection
export const useSocialLinks = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        const collectionRef = collection(db, COLLECTIONS.SOCIAL_LINKS);
        const querySnapshot = await getDocs(collectionRef);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          setData({
            id: firstDoc.id,
            ...firstDoc.data(),
          });
        } else {
          setData(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch social links');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return { data, loading, error };
};
