import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export interface FavoriteFood {
  id: string;
  name: string;
  calories: number;
  addedAt: Date;
}

export interface SearchHistory {
  id: string;
  foodName: string;
  searchedAt: Date;
}

export interface UserData {
  favorites: FavoriteFood[];
  searchHistory: SearchHistory[];
  totalSearches: number;
  mythsDebunked: number;
  dailyGoal: {
    calories: number;
    current: number;
  };
}

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Subscribe to user document
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            favorites: data.favorites || [],
            searchHistory: data.searchHistory || [],
            totalSearches: data.totalSearches || 0,
            mythsDebunked: data.mythsDebunked || 0,
            dailyGoal: data.dailyGoal || { calories: 2000, current: 0 },
          });
        } else {
          // Create initial user document
          const initialData: UserData = {
            favorites: [],
            searchHistory: [],
            totalSearches: 0,
            mythsDebunked: 0,
            dailyGoal: { calories: 2000, current: 0 },
          };
          await setDoc(userDocRef, {
            ...initialData,
            email: user.email,
            displayName: user.displayName,
            createdAt: serverTimestamp(),
          });
          setUserData(initialData);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addToFavorites = async (food: Omit<FavoriteFood, "id" | "addedAt">) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const newFavorite: FavoriteFood = {
      ...food,
      id: Date.now().toString(),
      addedAt: new Date(),
    };

    const currentFavorites = userData?.favorites || [];
    await updateDoc(userDocRef, {
      favorites: [...currentFavorites, newFavorite],
    });
  };

  const removeFromFavorites = async (foodId: string) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const currentFavorites = userData?.favorites || [];
    await updateDoc(userDocRef, {
      favorites: currentFavorites.filter((f) => f.id !== foodId),
    });
  };

  const addSearchHistory = async (foodName: string) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const newSearch: SearchHistory = {
      id: Date.now().toString(),
      foodName,
      searchedAt: new Date(),
    };

    const currentHistory = userData?.searchHistory || [];
    const totalSearches = (userData?.totalSearches || 0) + 1;

    // Keep only last 50 searches
    const updatedHistory = [newSearch, ...currentHistory].slice(0, 50);

    await updateDoc(userDocRef, {
      searchHistory: updatedHistory,
      totalSearches,
    });
  };

  const incrementMythsDebunked = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const currentCount = userData?.mythsDebunked || 0;

    await updateDoc(userDocRef, {
      mythsDebunked: currentCount + 1,
    });
  };

  const updateDailyGoal = async (calories: number, current: number) => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      dailyGoal: { calories, current },
    });
  };

  return {
    userData,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    addSearchHistory,
    incrementMythsDebunked,
    updateDailyGoal,
  };
}
