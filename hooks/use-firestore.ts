import { useMemo } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

export function useFirestore() {
  const api = useMemo(
    () => ({
      db,
      collection: <T = DocumentData>(path: string): CollectionReference<T> =>
        collection(db, path) as CollectionReference<T>,
      doc: (path: string, id: string) => doc(db, path, id),
      getDoc,
      getDocs,
      query,
      where,
      limit,
    }),
    []
  );

  return api;
}


