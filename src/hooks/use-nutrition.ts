// hooks/use-nutrition.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { 
  getNutritionFacts, 
  searchNutritionFacts, 
  saveNutritionAnalysis,
  getUserSearchHistory,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from '../lib/db';
import { NutritionFactDocument, SearchDocument } from '../lib/firebase';
import { NutritionAnalysis, ApiResponse } from '../types';

// =================================================================
// TYPES
// =================================================================

interface NutritionState {
  currentAnalysis: NutritionAnalysis | null;
  searchResults: NutritionFactDocument[];
  searchHistory: SearchDocument[];
  favorites: any[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

interface UseNutritionReturn extends NutritionState {
  // Search functions
  searchNutrition: (query: string) => Promise<void>;
  analyzeNutrition: (foodItem: string) => Promise<NutritionAnalysis | null>;
  clearSearch: () => void;
  
  // History functions
  loadSearchHistory: () => Promise<void>;
  clearSearchHistory: () => void;
  
  // Favorites functions
  loadFavorites: () => Promise<void>;
  toggleFavorite: (itemId: string, itemType: 'nutrition' | 'myth') => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  
  // Utility functions
  clearError: () => void;
  refreshData: () => Promise<void>;
}

// =================================================================
// CUSTOM HOOK
// =================================================================

export const useNutrition = (): UseNutritionReturn => {
  const { user } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [state, setState] = useState<NutritionState>({
    currentAnalysis: null,
    searchResults: [],
    searchHistory: [],
    favorites: [],
    loading: false,
    error: null,
    isSearching: false
  });

  // =================================================================
  // STATE MANAGEMENT HELPERS
  // =================================================================

  const updateState = useCallback((updates: Partial<NutritionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setError = useCallback((error: string | null) => {
    updateState({ error, loading: false, isSearching: false });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // =================================================================
  // API FUNCTIONS
  // =================================================================

  /**
   * Analyzes nutrition for a food item using the API
   */
  const analyzeNutrition = useCallback(async (foodItem: string): Promise<NutritionAnalysis | null> => {
    if (!user) {
      setError('User must be logged in to analyze nutrition');
      return null;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      updateState({ loading: true, error: null });

      const response = await fetch('/api/analyze-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItem,
          userId: user.uid
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<NutritionAnalysis> = await response.json();
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error?.message || 'Failed to analyze nutrition');
      }

      const analysis = apiResponse.data;
      
      // Save to Firestore
      await saveNutritionAnalysis(analysis, user.uid);
      
      updateState({ 
        currentAnalysis: analysis,
        loading: false 
      });

      return analysis;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return null; // Request was cancelled
      }
      
      console.error('Nutrition analysis error:', error);
      setError(error.message || 'Failed to analyze nutrition');
      return null;
    }
  }, [user, updateState, setError]);

  /**
   * Searches for nutrition facts in the database
   */
  const searchNutrition = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      updateState({ searchResults: [] });
      return;
    }

    try {
      updateState({ isSearching: true, error: null });

      // First, search local database
      const localResults = await searchNutritionFacts(query);
      
      updateState({ 
        searchResults: localResults,
        isSearching: false 
      });

      // If no local results and user is logged in, try API analysis
      if (localResults.length === 0 && user) {
        const analysis = await analyzeNutrition(query);
        if (analysis) {
          // Refresh search results to include the new analysis
          const updatedResults = await searchNutritionFacts(query);
          updateState({ searchResults: updatedResults });
        }
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message || 'Failed to search nutrition facts');
    }
  }, [user, updateState, setError, analyzeNutrition]);

  /**
   * Clears current search results
   */
  const clearSearch = useCallback(() => {
    updateState({ 
      searchResults: [],
      currentAnalysis: null,
      isSearching: false 
    });
  }, [updateState]);

  // =================================================================
  // HISTORY FUNCTIONS
  // =================================================================

  /**
   * Loads user's search history
   */
  const loadSearchHistory = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      updateState({ loading: true, error: null });
      
      const history = await getUserSearchHistory(user.uid, 'nutrition', 20);
      
      updateState({ 
        searchHistory: history,
        loading: false 
      });
    } catch (error: any) {
      console.error('Load search history error:', error);
      setError(error.message || 'Failed to load search history');
    }
  }, [user, updateState, setError]);

  /**
   * Clears search history from state (not from database)
   */
  const clearSearchHistory = useCallback(() => {
    updateState({ searchHistory: [] });
  }, [updateState]);

  // =================================================================
  // FAVORITES FUNCTIONS
  // =================================================================

  /**
   * Loads user's favorites
   */
  const loadFavorites = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      updateState({ loading: true, error: null });
      
      const favorites = await getUserFavorites(user.uid);
      
      updateState({ 
        favorites,
        loading: false 
      });
    } catch (error: any) {
      console.error('Load favorites error:', error);
      setError(error.message || 'Failed to load favorites');
    }
  }, [user, updateState, setError]);

  /**
   * Toggles an item in favorites
   */
  const toggleFavorite = useCallback(async (
    itemId: string, 
    itemType: 'nutrition' | 'myth'
  ): Promise<void> => {
    if (!user) {
      setError('User must be logged in to manage favorites');
      return;
    }

    try {
      const isFav = state.favorites.some(fav => fav.id === itemId && fav.type === itemType);
      
      if (isFav) {
        await removeFromFavorites(user.uid, itemId, itemType);
        updateState({
          favorites: state.favorites.filter(fav => !(fav.id === itemId && fav.type === itemType))
        });
      } else {
        await addToFavorites(user.uid, itemId, itemType);
        updateState({
          favorites: [...state.favorites, { id: itemId, type: itemType }]
        });
      }
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      setError(error.message || 'Failed to update favorites');
    }
  }, [user, state.favorites, updateState, setError]);

  /**
   * Checks if an item is favorited
   */
  const isFavorite = useCallback((itemId: string): boolean => {
    return state.favorites.some(fav => fav.id === itemId);
  }, [state.favorites]);

  // =================================================================
  // UTILITY FUNCTIONS
  // =================================================================

  /**
   * Refreshes all data
   */
  const refreshData = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      updateState({ loading: true, error: null });
      
      await Promise.all([
        loadSearchHistory(),
        loadFavorites()
      ]);
      
      updateState({ loading: false });
    } catch (error: any) {
      console.error('Refresh data error:', error);
      setError(error.message || 'Failed to refresh data');
    }
  }, [user, updateState, setError, loadSearchHistory, loadFavorites]);

  // =================================================================
  // EFFECTS
  // =================================================================

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      loadSearchHistory();
      loadFavorites();
    } else {
      // Clear data when user logs out
      updateState({
        currentAnalysis: null,
        searchResults: [],
        searchHistory: [],
        favorites: [],
        loading: false,
        error: null,
        isSearching: false
      });
    }
  }, [user, loadSearchHistory, loadFavorites, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // =================================================================
  // RETURN
  // =================================================================

  return {
    // State
    ...state,
    
    // Search functions
    searchNutrition,
    analyzeNutrition,
    clearSearch,
    
    // History functions
    loadSearchHistory,
    clearSearchHistory,
    
    // Favorites functions
    loadFavorites,
    toggleFavorite,
    isFavorite,
    
    // Utility functions
    clearError,
    refreshData
  };
};

// =================================================================
// EXPORT DEFAULT
// =================================================================

export default useNutrition;