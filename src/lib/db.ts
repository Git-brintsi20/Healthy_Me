// lib/db.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  runTransaction,
  FirestoreError
} from 'firebase/firestore';
import { db, COLLECTIONS, type UserDocument, type NutritionFactDocument, type MythDocument, type SearchDocument } from './firebase';
import { FirestoreCache } from './cache';
import { NutritionAnalysis, MythAnalysis, SearchType } from '../types';

// =================================================================
// ERROR HANDLING
// =================================================================

export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

const handleFirestoreError = (error: FirestoreError): never => {
  console.error('Firestore error:', error);
  throw new DatabaseError(error.message, error.code);
};

// =================================================================
// USER MANAGEMENT
// =================================================================

/**
 * Creates a new user document in Firestore
 */
export const createUserDocument = async (
  uid: string,
  userData: Partial<UserDocument>
): Promise<UserDocument> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const now = Timestamp.now();
    
    const userDoc: UserDocument = {
      uid,
      email: userData.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      role: userData.role || 'user',
      preferences: userData.preferences || {
        theme: 'light',
        notifications: true,
        dietary_restrictions: []
      },
      createdAt: now,
      updatedAt: now
    };

    await setDoc(userRef, userDoc);
    
    // Invalidate cache
    FirestoreCache.invalidateDocument(COLLECTIONS.USERS, uid);
    
    return userDoc;
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets a user document by UID
 */
export const getUserDocument = async (uid: string): Promise<UserDocument | null> => {
  try {
    return await FirestoreCache.getDocument<UserDocument>(COLLECTIONS.USERS, uid);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Updates a user document
 */
export const updateUserDocument = async (
  uid: string,
  updates: Partial<UserDocument>
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(userRef, updateData);
    
    // Invalidate cache
    FirestoreCache.invalidateDocument(COLLECTIONS.USERS, uid);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets all users (admin only)
 */
export const getAllUsers = async (): Promise<UserDocument[]> => {
  try {
    return await FirestoreCache.getCollection<UserDocument>(
      COLLECTIONS.USERS,
      [orderBy('createdAt', 'desc')],
      5 * 60 * 1000 // 5 minutes cache
    );
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// NUTRITION DATA MANAGEMENT
// =================================================================

/**
 * Saves nutrition analysis to Firestore
 */
export const saveNutritionAnalysis = async (
  nutritionData: NutritionAnalysis,
  userId: string
): Promise<string> => {
  try {
    const nutritionRef = doc(collection(db, COLLECTIONS.NUTRITION_FACTS));
    const now = Timestamp.now();
    
    const nutritionDoc: NutritionFactDocument = {
      id: nutritionRef.id,
      foodName: nutritionData.foodName,
      calories: nutritionData.calories,
      macros: nutritionData.macros,
      vitamins: nutritionData.vitamins,
      minerals: nutritionData.minerals,
      source: 'gemini_api',
      verified: false,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(nutritionRef, nutritionDoc);
    
    // Save to user's search history
    await saveSearchHistory(userId, nutritionData.foodName, 'nutrition', [nutritionDoc]);
    
    // Invalidate cache
    FirestoreCache.invalidateCollection(COLLECTIONS.NUTRITION_FACTS);
    
    return nutritionRef.id;
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets nutrition facts by food name
 */
export const getNutritionFacts = async (foodName: string): Promise<NutritionFactDocument[]> => {
  try {
    return await FirestoreCache.getCollection<NutritionFactDocument>(
      COLLECTIONS.NUTRITION_FACTS,
      [where('foodName', '==', foodName.toLowerCase()), orderBy('createdAt', 'desc')],
      30 * 60 * 1000 // 30 minutes cache
    );
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Searches nutrition facts by partial name
 */
export const searchNutritionFacts = async (searchTerm: string): Promise<NutritionFactDocument[]> => {
  try {
    // Note: Firestore doesn't support full-text search, so we'll use a simple prefix search
    const searchTermLower = searchTerm.toLowerCase();
    const endTerm = searchTermLower + '\uf8ff';
    
    return await FirestoreCache.getCollection<NutritionFactDocument>(
      COLLECTIONS.NUTRITION_FACTS,
      [
        where('foodName', '>=', searchTermLower),
        where('foodName', '<=', endTerm),
        orderBy('foodName'),
        limit(10)
      ],
      5 * 60 * 1000 // 5 minutes cache
    );
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// MYTH MANAGEMENT
// =================================================================

/**
 * Saves myth analysis to Firestore
 */
export const saveMythAnalysis = async (
  mythData: MythAnalysis,
  userId: string
): Promise<string> => {
  try {
    const mythRef = doc(collection(db, COLLECTIONS.MYTHS));
    const now = Timestamp.now();
    
    const mythDoc: MythDocument = {
      id: mythRef.id,
      title: mythData.claim,
      myth: mythData.claim,
      fact: mythData.verdict === 'fact' ? mythData.explanation : '',
      explanation: mythData.explanation,
      sources: mythData.sources,
      category: mythData.category,
      verified: false,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(mythRef, mythDoc);
    
    // Save to user's search history
    await saveSearchHistory(userId, mythData.claim, 'myth', [mythDoc]);
    
    // Invalidate cache
    FirestoreCache.invalidateCollection(COLLECTIONS.MYTHS);
    
    return mythRef.id;
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets all myths with pagination
 */
export const getMyths = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ myths: MythDocument[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    const constraints = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const mythsQuery = query(collection(db, COLLECTIONS.MYTHS), ...constraints);
    const snapshot = await getDocs(mythsQuery);
    
    const myths: MythDocument[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MythDocument[];
    
    const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;
    
    return { myths, lastDoc: lastDocument };
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets a specific myth by ID
 */
export const getMythById = async (mythId: string): Promise<MythDocument | null> => {
  try {
    return await FirestoreCache.getDocument<MythDocument>(COLLECTIONS.MYTHS, mythId);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Searches myths by category
 */
export const getMythsByCategory = async (category: string): Promise<MythDocument[]> => {
  try {
    return await FirestoreCache.getCollection<MythDocument>(
      COLLECTIONS.MYTHS,
      [where('category', '==', category), orderBy('createdAt', 'desc')],
      60 * 60 * 1000 // 1 hour cache
    );
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// SEARCH HISTORY MANAGEMENT
// =================================================================

/**
 * Saves search history for a user
 */
export const saveSearchHistory = async (
  userId: string,
  query: string,
  type: SearchType,
  results: any[]
): Promise<void> => {
  try {
    const searchRef = doc(collection(db, COLLECTIONS.SEARCHES));
    const now = Timestamp.now();
    
    const searchDoc: SearchDocument = {
      id: searchRef.id,
      userId,
      query,
      results,
      type,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(searchRef, searchDoc);
    
    // Invalidate user's history cache
    FirestoreCache.invalidateDocument(COLLECTIONS.SEARCHES, userId);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets search history for a user
 */
export const getUserSearchHistory = async (
  userId: string,
  type?: SearchType,
  limit_count: number = 20
): Promise<SearchDocument[]> => {
  try {
    const constraints = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    ];
    
    if (type) {
      constraints.splice(1, 0, where('type', '==', type));
    }
    
    return await FirestoreCache.getCollection<SearchDocument>(
      COLLECTIONS.SEARCHES,
      constraints,
      10 * 60 * 1000 // 10 minutes cache
    );
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// FAVORITES MANAGEMENT
// =================================================================

/**
 * Adds an item to user's favorites
 */
export const addToFavorites = async (
  userId: string,
  itemId: string,
  itemType: 'nutrition' | 'myth'
): Promise<void> => {
  try {
    const favoritesRef = doc(db, COLLECTIONS.FAVORITES, userId);
    const now = Timestamp.now();
    
    const favoriteItem = {
      id: itemId,
      type: itemType,
      addedAt: now
    };
    
    await setDoc(favoritesRef, {
      userId,
      items: arrayUnion(favoriteItem),
      updatedAt: now
    }, { merge: true });
    
    // Invalidate cache
    FirestoreCache.invalidateDocument(COLLECTIONS.FAVORITES, userId);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Removes an item from user's favorites
 */
export const removeFromFavorites = async (
  userId: string,
  itemId: string,
  itemType: 'nutrition' | 'myth'
): Promise<void> => {
  try {
    const favoritesRef = doc(db, COLLECTIONS.FAVORITES, userId);
    
    const favoriteItem = {
      id: itemId,
      type: itemType
    };
    
    await updateDoc(favoritesRef, {
      items: arrayRemove(favoriteItem),
      updatedAt: Timestamp.now()
    });
    
    // Invalidate cache
    FirestoreCache.invalidateDocument(COLLECTIONS.FAVORITES, userId);
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets user's favorites
 */
export const getUserFavorites = async (userId: string): Promise<any[]> => {
  try {
    const favoritesDoc = await FirestoreCache.getDocument<any>(COLLECTIONS.FAVORITES, userId);
    return favoritesDoc?.items || [];
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// BATCH OPERATIONS
// =================================================================

/**
 * Batch update multiple documents
 */
export const batchUpdateDocuments = async (
  updates: Array<{ collection: string; id: string; data: any }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ collection: collectionName, id, data }) => {
      const docRef = doc(db, collectionName, id);
      batch.update(docRef, { ...data, updatedAt: Timestamp.now() });
    });
    
    await batch.commit();
    
    // Invalidate relevant caches
    updates.forEach(({ collection: collectionName, id }) => {
      FirestoreCache.invalidateDocument(collectionName, id);
    });
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Batch delete multiple documents
 */
export const batchDeleteDocuments = async (
  deletions: Array<{ collection: string; id: string }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    deletions.forEach(({ collection: collectionName, id }) => {
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    
    // Invalidate relevant caches
    deletions.forEach(({ collection: collectionName, id }) => {
      FirestoreCache.invalidateDocument(collectionName, id);
    });
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

// =================================================================
// ANALYTICS AND STATS
// =================================================================

/**
 * Gets database statistics (admin only)
 */
export const getDatabaseStats = async (): Promise<{
  totalUsers: number;
  totalNutritionFacts: number;
  totalMyths: number;
  totalSearches: number;
}> => {
  try {
    const [users, nutrition, myths, searches] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.USERS)),
      getDocs(collection(db, COLLECTIONS.NUTRITION_FACTS)),
      getDocs(collection(db, COLLECTIONS.MYTHS)),
      getDocs(collection(db, COLLECTIONS.SEARCHES))
    ]);
    
    return {
      totalUsers: users.size,
      totalNutritionFacts: nutrition.size,
      totalMyths: myths.size,
      totalSearches: searches.size
    };
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Increments a counter (useful for analytics)
 */
export const incrementCounter = async (
  counterName: string,
  incrementBy: number = 1
): Promise<void> => {
  try {
    const counterRef = doc(db, 'counters', counterName);
    await updateDoc(counterRef, {
      count: increment(incrementBy),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      await setDoc(counterRef, {
        count: incrementBy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } else {
      handleFirestoreError(error as FirestoreError);
    }
  }
};

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * Checks if a document exists
 */
export const documentExists = async (collectionName: string, docId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};

/**
 * Gets the total count of documents in a collection
 */
export const getCollectionCount = async (collectionName: string): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (error) {
    handleFirestoreError(error as FirestoreError);
  }
};