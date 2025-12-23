import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  db,
  getUserDocRef,
  getUserFavoritesCollection,
  getUserNutritionHistoryCollection,
} from "@/lib/firebase/firestore";
import { doc, setDoc, updateDoc, onSnapshot, serverTimestamp, getDoc, query, orderBy, limit, deleteDoc } from "firebase/firestore";

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

    const unsubscribers: (() => void)[] = [];

    const loadUserData = async () => {
      const userDocRef = getUserDocRef(user.uid);
      const favoritesCol = getUserFavoritesCollection(user.uid);
      const historyCol = getUserNutritionHistoryCollection(user.uid);
      
      try {
        const docSnap = await getDoc(userDocRef);

        const baseStats = {
          totalSearches: 0,
          mythsDebunked: 0,
          dailyGoal: { calories: 2000, current: 0 },
        };

        let currentData: UserData = {
          favorites: [],
          searchHistory: [],
          ...baseStats,
        };

        if (docSnap.exists()) {
          const data = docSnap.data();
          currentData = {
            ...currentData,
            totalSearches: data.totalSearches ?? baseStats.totalSearches,
            mythsDebunked: data.mythsDebunked ?? baseStats.mythsDebunked,
            dailyGoal: data.dailyGoal ?? baseStats.dailyGoal,
          };
        } else {
          await setDoc(userDocRef, {
            ...baseStats,
            email: user.email,
            displayName: user.displayName,
            createdAt: serverTimestamp(),
          });
        }

        setUserData(currentData);
        setLoading(false);

        // Real-time listener for user stats
        const unsubUser = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData((prev) =>
                prev
                  ? {
                      ...prev,
                      totalSearches: data.totalSearches ?? 0,
                      mythsDebunked: data.mythsDebunked ?? 0,
                      dailyGoal: data.dailyGoal ?? baseStats.dailyGoal,
                    }
                  : prev
              );
            }
          },
          (err) => console.error("Error in user stats listener:", err)
        );
        unsubscribers.push(unsubUser);

        // Real-time listener for favorites
        const favQuery = query(favoritesCol, orderBy("addedAt", "desc"), limit(50));
        const unsubFavorites = onSnapshot(
          favQuery,
          (snapshot) => {
            const favorites = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || "",
                calories: data.calories || 0,
                addedAt: data.addedAt?.toDate?.() || new Date(),
              };
            });
            setUserData((prev) => (prev ? { ...prev, favorites } : prev));
          },
          (err) => console.error("Error in favorites listener:", err)
        );
        unsubscribers.push(unsubFavorites);

        // Real-time listener for search history
        const historyQuery = query(historyCol, orderBy("searchedAt", "desc"), limit(50));
        const unsubHistory = onSnapshot(
          historyQuery,
          (snapshot) => {
            const searchHistory = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                foodName: data.foodName || "",
                searchedAt: data.searchedAt?.toDate?.() || new Date(),
              };
            });
            setUserData((prev) => (prev ? { ...prev, searchHistory } : prev));
          },
          (err) => console.error("Error in history listener:", err)
        );
        unsubscribers.push(unsubHistory);
      } catch (err: any) {
        console.error("Error loading user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadUserData();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  const addToFavorites = async (food: Omit<FavoriteFood, "id" | "addedAt">) => {
    if (!user) return;

    const favoritesCol = getUserFavoritesCollection(user.uid);
    await setDoc(doc(favoritesCol), {
      name: food.name,
      calories: food.calories,
      addedAt: serverTimestamp(),
    });
  };

  const removeFromFavorites = async (foodId: string) => {
    if (!user) return;

    const favoritesCol = getUserFavoritesCollection(user.uid);
    const favoriteDocRef = doc(favoritesCol, foodId);
    await deleteDoc(favoriteDocRef);
  };

  const addSearchHistory = async (foodName: string) => {
    if (!user) return;

    const userDocRef = getUserDocRef(user.uid);
    const historyCol = getUserNutritionHistoryCollection(user.uid);

    await setDoc(doc(historyCol), {
      foodName,
      searchedAt: serverTimestamp(),
      source: "manual_search",
    });

    const totalSearches = (userData?.totalSearches || 0) + 1;

    await updateDoc(userDocRef, {
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
