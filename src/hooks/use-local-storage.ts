// hooks/use-local-storage.ts

import { useState, useEffect, useCallback } from 'react';

// Storage key prefix for the app
const STORAGE_PREFIX = 'healthyme_';

// Storage event for cross-tab synchronization
const STORAGE_EVENT = 'healthyme-storage-change';

// Type definitions
type StorageValue<T> = T | null;
type SetStorageValue<T> = (value: T | ((prevValue: T | null) => T)) => void;
type RemoveStorageValue = () => void;

// Serialization utilities
const serialize = <T>(value: T): string => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to serialize value:', error);
    return '';
  }
};

const deserialize = <T>(value: string): T | null => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Failed to deserialize value:', error);
    return null;
  }
};

// Storage utilities
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
    
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, {
      detail: { key: `${STORAGE_PREFIX}${key}`, value }
    }));
  } catch (error) {
    console.error('Failed to set storage item:', error);
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    
    // Dispatch custom event for cross-tab sync
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, {
      detail: { key: `${STORAGE_PREFIX}${key}`, value: null }
    }));
  } catch (error) {
    console.error('Failed to remove storage item:', error);
  }
};

// Storage quota utilities
const getStorageQuota = (): { used: number; total: number; available: number } => {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, available: 0 };
  }

  try {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate total storage (usually 5-10MB)
    const total = 5 * 1024 * 1024; // 5MB estimate
    const available = total - used;

    return { used, total, available };
  } catch (error) {
    console.error('Failed to get storage quota:', error);
    return { used: 0, total: 0, available: 0 };
  }
};

// Main hook
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    syncAcrossTabs?: boolean;
    compress?: boolean;
    expire?: number; // milliseconds
  } = {}
): [StorageValue<T>, SetStorageValue<T>, RemoveStorageValue] {
  const {
    syncAcrossTabs = true,
    compress = false,
    expire
  } = options;

  // Initialize state
  const [value, setValue] = useState<StorageValue<T>>(() => {
    if (typeof window === 'undefined') return defaultValue;

    const item = getStorageItem(key);
    if (!item) return defaultValue;

    const parsed = deserialize<{ value: T; timestamp?: number }>(item);
    if (!parsed) return defaultValue;

    // Check expiration
    if (expire && parsed.timestamp) {
      const now = Date.now();
      if (now - parsed.timestamp > expire) {
        removeStorageItem(key);
        return defaultValue;
      }
    }

    return parsed.value;
  });

  // Set value function
  const setStorageValue = useCallback<SetStorageValue<T>>((newValue) => {
    setValue(prevValue => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prevValue: T | null) => T)(prevValue)
        : newValue;

      // Prepare storage object
      const storageObject = {
        value: valueToStore,
        ...(expire && { timestamp: Date.now() })
      };

      const serialized = serialize(storageObject);
      
      // Check storage quota before storing
      const quota = getStorageQuota();
      if (quota.available < serialized.length) {
        console.warn('Storage quota exceeded, cannot store value');
        return prevValue;
      }

      setStorageItem(key, serialized);
      return valueToStore;
    });
  }, [key, expire]);

  // Remove value function
  const removeStorageValue = useCallback<RemoveStorageValue>(() => {
    removeStorageItem(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  // Handle cross-tab synchronization
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e: CustomEvent) => {
      const { key: changedKey, value: changedValue } = e.detail;
      
      if (changedKey === `${STORAGE_PREFIX}${key}`) {
        if (changedValue === null) {
          setValue(defaultValue);
        } else {
          const parsed = deserialize<{ value: T; timestamp?: number }>(changedValue);
          if (parsed) {
            // Check expiration
            if (expire && parsed.timestamp) {
              const now = Date.now();
              if (now - parsed.timestamp > expire) {
                removeStorageItem(key);
                setValue(defaultValue);
                return;
              }
            }
            setValue(parsed.value);
          }
        }
      }
    };

    window.addEventListener(STORAGE_EVENT, handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageChange as EventListener);
    };
  }, [key, defaultValue, syncAcrossTabs, expire]);

  // Handle standard storage events (for external changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === `${STORAGE_PREFIX}${key}`) {
        if (e.newValue === null) {
          setValue(defaultValue);
        } else {
          const parsed = deserialize<{ value: T; timestamp?: number }>(e.newValue);
          if (parsed) {
            setValue(parsed.value);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, defaultValue]);

  return [value, setStorageValue, removeStorageValue];
}

// Specialized hooks for common use cases
export function useUserPreferences() {
  return useLocalStorage('user_preferences', {
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'en',
    notifications: true,
    units: 'metric' as 'metric' | 'imperial',
    compactMode: false,
  });
}

export function useSearchHistory() {
  return useLocalStorage('search_history', [] as string[], {
    expire: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function useRecentSearches() {
  return useLocalStorage('recent_searches', [] as Array<{
    query: string;
    type: 'nutrition' | 'myth';
    timestamp: number;
  }>, {
    expire: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useFavorites() {
  return useLocalStorage('favorites', [] as Array<{
    id: string;
    type: 'nutrition' | 'myth';
    title: string;
    timestamp: number;
  }>);
}

export function useOfflineQueue() {
  return useLocalStorage('offline_queue', [] as Array<{
    id: string;
    action: string;
    data: any;
    timestamp: number;
  }>);
}

// Storage management utilities
export const storageUtils = {
  // Clear all app storage
  clearAll: () => {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(STORAGE_PREFIX)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
  },

  // Get storage size
  getSize: () => {
    if (typeof window === 'undefined') return 0;
    
    let size = 0;
    for (let key in localStorage) {
      if (key.startsWith(STORAGE_PREFIX)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  },

  // Get all app keys
  getKeys: () => {
    if (typeof window === 'undefined') return [];
    
    return Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  },

  // Cleanup expired items
  cleanup: () => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(STORAGE_PREFIX)
    );
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = deserialize<{ timestamp?: number }>(item);
          if (parsed && parsed.timestamp && now - parsed.timestamp > 30 * 24 * 60 * 60 * 1000) {
            // Remove items older than 30 days
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove corrupted items
        localStorage.removeItem(key);
      }
    });
  },

  // Get storage quota info
  getQuota: getStorageQuota,

  // Export data
  exportData: () => {
    if (typeof window === 'undefined') return null;
    
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(STORAGE_PREFIX)
    );
    
    keys.forEach(key => {
      const cleanKey = key.replace(STORAGE_PREFIX, '');
      const item = localStorage.getItem(key);
      if (item) {
        data[cleanKey] = deserialize(item);
      }
    });
    
    return data;
  },

  // Import data
  importData: (data: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    Object.entries(data).forEach(([key, value]) => {
      const serialized = serialize(value);
      setStorageItem(key, serialized);
    });
  }
};

// Auto-cleanup on app start
if (typeof window !== 'undefined') {
  // Run cleanup on page load
  setTimeout(() => {
    storageUtils.cleanup();
  }, 1000);
}

export default useLocalStorage;