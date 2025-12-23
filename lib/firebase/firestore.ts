import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";

export const getUserDocRef = (userId: string) => doc(db, "users", userId);

export const getUserNutritionHistoryCollection = (userId: string) =>
  collection(db, "users", userId, "nutrition_history");

export const getUserFavoritesCollection = (userId: string) =>
  collection(db, "users", userId, "favorites");

export const getUserMealLogsCollection = (userId: string) =>
  collection(db, "users", userId, "meal_logs");

export async function ensureUserDocument(userId: string, data: Record<string, any>) {
  const userRef = getUserDocRef(userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
}

export async function fetchRecentFavorites(userId: string, max: number = 50) {
  const col = getUserFavoritesCollection(userId);
  const q = query(col, orderBy("addedAt", "desc"), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((doc: any) => !doc.deletedAt);
}

export async function fetchRecentNutritionHistory(userId: string, max: number = 50) {
  const col = getUserNutritionHistoryCollection(userId);
  const q = query(col, orderBy("searchedAt", "desc"), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  db,
};


