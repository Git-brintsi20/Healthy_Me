// hooks/use-myth.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { 
  getMyths,
  getMythById,
  getMythsByCategory,
  saveMythAnalysis,
  getUserSearchHistory,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from '../lib/db';
import { MythDocument, SearchDocument } from '../lib/firebase';
import { MythAnalysis, ApiResponse } from '../types';
import { QueryDocumentSnapshot } from 'firebase/firestore';

// =================================================================
// TYPES
// =================================================================

interface MythState {
  currentAnalysis: MythAnalysis | null;
  myths: MythDocument[];
  searchResults: MythDocument[];
  searchHistory: SearchDocument[];
  favorites: any[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
  isAnalyzing: boolean;
  hasMore: boolean;
  lastDoc: QueryDocumentSnapshot | null;
  selectedCategory: string | null;
  categories: string[];
}

interface UseMythReturn extends MythState {
  // Analysis functions
  analyzeMythClaim: (claim: string) => Promise<MythAnalysis | null>;
  clearCurrentAnalysis: () => void;
  
  // Search functions
  searchMyths: (query: string) => Promise<void>;
  loadMyths: (pageSize?: number) => Promise<void>;
  loadMoreMyths: (pageSize?: number) => Promise<void>;
  getMythDetails: (mythId: string) => Promise<MythDocument | null>;
  clearSearch: () => void;
  
  // Category functions
  loadMythsByCategory: (category: string) => Promise<void>;
  clearCategoryFilter: () => void;
  
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
  resetPagination: () => void;
}

// =================================================================
// CUSTOM HOOK
// =================================================================

export const useMyth = (): UseMythReturn => {
  const { user } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [state, setState] = useState<MythState>({
    currentAnalysis: null,
    myths: [],
    searchResults: [],
    searchHistory: [],
    favorites: [],
    loading: false,
    error: null,
    isSearching: false,
    isAnalyzing: false,
    hasMore: true,
    lastDoc: null,
    selectedCategory: null,
    categories: [
      'nutrition',
      'exercise',
      'supplements',
      'weight_loss',
      'mental_health',
      'sleep',
      'immunity',
      'chronic_disease',
      'pregnancy',
      'aging',
      'general_health'
    ]
  });

  // =================================================================
  // STATE MANAGEMENT HELPERS
  // =================================================================

  const updateState = useCallback((updates: Partial<MythState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setError = useCallback((error: string | null) => {
    updateState({ 
      error, 
      loading: false, 
      isSearching: false, 
      isAnalyzing: false 
    });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // =================================================================
  // ANALYSIS FUNCTIONS
  // =================================================================

  /**
   * Analyzes a myth claim using the API
   */
  const analyzeMythClaim = useCallback(async (claim: string): Promise<MythAnalysis | null> => {
    if (!user) {
      setError('User must be logged in to analyze myths');
      return null;
    }

    if (!claim.trim()) {
      setError('Please enter a claim to analyze');
      return null;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      updateState({ isAnalyzing: true, error: null });

      const response = await fetch('/api/analyze-myth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim,
          userId: user.uid
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<MythAnalysis> = await response.json();
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error?.message || 'Failed to analyze myth');
      }

      const analysis = apiResponse.data;
      
      // Save to Firestore
      await saveMythAnalysis(analysis, user.uid);
      
      updateState({ 
        currentAnalysis: analysis,
        isAnalyzing: false 
      });

      return analysis;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return null; // Request was cancelled
      }
      
      console.error('Myth analysis error:', error);
      setError(error.message || 'Failed to analyze myth');
      return null;
    }
  }, [user, updateState, setError]);

  /**
   * Clears the current analysis
   */
  const clearCurrentAnalysis = useCallback(() => {
    updateState({ currentAnalysis: null });
  }, [updateState]);

  // =================================================================
  // SEARCH FUNCTIONS
  // =================================================================

  /**
   * Searches for myths (this is a placeholder for actual search implementation)
   */
  const searchMyths = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      updateState({ searchResults: [] });
      return;
    }

    try {
      updateState({ isSearching: true, error: null });

      // For now, we'll search by category or load all myths
      // In a real implementation, you'd want full-text search
      const results = await getMyths(20);
      
      // Filter results by query (basic implementation)
      const filteredResults = results.myths.filter(myth =>
        myth.title.toLowerCase().includes(query.toLowerCase()) ||
        myth.myth.toLowerCase().includes(query.toLowerCase()) ||
        myth.explanation.toLowerCase().includes(query.toLowerCase())
      );

      updateState({ 
        searchResults: filteredResults,
        isSearching: false 
      });

    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message || 'Failed to search myths');
    }
  }, [updateState, setError]);

  /**
   * Loads myths with pagination
   */
  const loadMyths = useCallback(async (pageSize: number = 10): Promise<void> => {
    try {
      updateState({ loading: true, error: null });

      const result = await getMyths(pageSize);
      
      updateState({ 
        myths: result.myths,
        lastDoc: result.lastDoc,
        hasMore: result.myths.length === pageSize,
        loading: false 
      });

    } catch (error: any) {
      console.error('Load myths error:', error);
      setError(error.message || 'Failed to load myths');
    }
  }, [updateState, setError]);

  /**
   * Loads more myths for pagination
   */
  const loadMoreMyths = useCallback(async (pageSize: number = 10): Promise<void> => {
    if (!state.hasMore || state.loading || !state.lastDoc) return;

    try {
      updateState({ loading: true, error: null });

      const result = await getMyths(pageSize, state.lastDoc);
      
      updateState({ 
        myths: [...state.myths, ...result.myths],
        lastDoc: result.lastDoc,
        hasMore: result.myths.length === pageSize,
        loading: false 
      });

    } catch (error: any) {
      console.error('Load more myths error:', error);
      setError(error.message || 'Failed to load more myths');
    }
  }, [state.hasMore, state.loading, state.lastDoc, state.myths, updateState, setError]);

  /**
   * Gets details for a specific myth
   */
  const getMythDetails = useCallback(async (mythId: string): Promise<MythDocument | null> => {
    try {
      updateState({ loading: true, error: null });

      const myth = await getMythById(mythId);
      
      updateState({ loading: false });
      return myth;

    } catch (error: any) {
      console.error('Get myth details error:', error);
      setError(error.message || 'Failed to get myth details');
      return null;
    }
  }, [updateState, setError]);

  /**
   * Clears search results
   */
  const clearSearch = useCallback(() => {
    updateState({ 
      searchResults: [],
      isSearching: false 
    });
  }, [updateState]);

  // =================================================================
  // CATEGORY FUNCTIONS
  // =================================================================

  /**
   * Loads myths by category
   */
  const loadMythsByCategory = useCallback(async (category: string): Promise<void> => {
    try {
      updateState({ loading: true, error: null, selectedCategory: category });

      const categoryMyths = await getMythsByCategory(category);
      
      updateState({ 
        myths: categoryMyths,
        loading: false,
        hasMore: false, // Category results don't use pagination
        lastDoc: null
      });

    } catch (error: any) {
      console.error('Load myths by category error:', error);
      setError(error.message || 'Failed to load myths by category');
    }
  }, [updateState, setError]);

  /**
   * Clears category filter
   */
  const clearCategoryFilter = useCallback(() => {
    updateState({ selectedCategory: null });
    loadMyths();
  }, [updateState, loadMyths]);

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
      
      const history = await getUserSearchHistory(user.uid, 'myth', 20);
      
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
   * Clears search history from state
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
        loadMyths(),
        loadSearchHistory(),
        loadFavorites()
      ]);
      
      updateState({ loading: false });
    } catch (error: any) {
      console.error('Refresh data error:', error);
      setError(error.message || 'Failed to refresh data');
    }
  }, [user, updateState, setError, loadMyths, loadSearchHistory, loadFavorites]);

  /**
   * Resets pagination state
   */
  const resetPagination = useCallback(() => {
    updateState({
      hasMore: true,
      lastDoc: null,
      myths: []
    });
  }, [updateState]);

  // =================================================================
  // EFFECTS
  // =================================================================

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      loadMyths();
      loadSearchHistory();
      loadFavorites();
    } else {
      // Clear data when user logs out
      updateState({
        currentAnalysis: null,
        myths: [],
        searchResults: [],
        searchHistory: [],
        favorites: [],
        loading: false,
        error: null,
        isSearching: false,
        isAnalyzing: false,
        hasMore: true,
        lastDoc: null,
        selectedCategory: null
      });
    }
  }, [user, loadMyths, loadSearchHistory, loadFavorites, updateState]);

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
    
    // Analysis functions
    analyzeMythClaim,
    clearCurrentAnalysis,
    
    // Search functions
    searchMyths,
    loadMyths,
    loadMoreMyths,
    getMythDetails,
    clearSearch,
    
    // Category functions
    loadMythsByCategory,
    clearCategoryFilter,
    
    // History functions
    loadSearchHistory,
    clearSearchHistory,
    
    // Favorites functions
    loadFavorites,
    toggleFavorite,
    isFavorite,
    
    // Utility functions
    clearError,
    refreshData,
    resetPagination
  };
};

// =================================================================
// EXPORT DEFAULT
// =================================================================

export default useMyth;